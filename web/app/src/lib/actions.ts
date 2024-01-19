"use server";

import path from "path";
import fs from "fs-extra";
import axios from "axios";
import { revalidatePath } from "next/cache";
import mysql, { ConnectionOptions } from "mysql2";
import decompress from "decompress";
import prisma from "./prisma";
import crypto from "crypto";

const MYSQLConnectionConfig: ConnectionOptions = {
    host: process.env.MYSQL_HOST!,
    user: process.env.MYSQL_ROOT_USER!,
    password: process.env.MYSQL_ROOT_PASSWORD!,
};

const projectsDirectory = path.join(process.cwd(), "web/subdomain");
const wordpressVersionDirectory = path.join(
    process.cwd(),
    "web/wordpressVersions"
);
const unzipedWordPressDirectory = path.join(
    process.cwd(),
    "web/unzipWordPress"
);

export interface CreateNewProjectResponse {
    message: string;
    status: "success" | "error";
    projectName: string;
}

export async function createNewProject(
    projectName: string,
    wordpressVersion: string
): Promise<CreateNewProjectResponse> {
    projectName = projectName.trim().toLowerCase();

    if (!projectName) {
        return {
            status: "error",
            message: "Project name is required",
            projectName: projectName,
        };
    }

    if (!wordpressVersion) {
        return {
            status: "error",
            message: "WordPress version is required",
            projectName: projectName,
        };
    }
    if (projectAlreadyExists(projectName)) {
        return {
            status: "error",
            message: "A project with that name already exists",
            projectName: projectName,
        };
    }
    // check if the project name is a valid subdomain
    const subdomainRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!subdomainRegex.test(projectName)) {
        return {
            status: "error",
            message: "Project name is invalid",
            projectName: projectName,
        };
    }

    console.log("Creating new project", projectName, wordpressVersion);

    await prisma.server.create({
        data: {
            name: projectName,
            wordpressVersion: wordpressVersion,
            databaseName: projectName,
            wordPressUsername: "admin",
            wordPressPassword: generateRandomPassword(16),
        },
    });

    const zipFilePath = await downloadWordPress(wordpressVersion);
    const projectPath = createProjectFolder(projectName);
    await unzipWordPressToProject(zipFilePath, projectPath);
    await setupWordPressProject(projectName, projectPath);

    revalidatePath("/");
    return {
        status: "success",
        message: "Project created successfully",
        projectName: projectName,
    };
}

export async function getWordPressVersions() {
    const res = await fetch(
        "https://api.wordpress.org/core/version-check/1.7/"
    );
    const data = await res.json();
    const versions = [
        ...new Set(data.offers.map((offer: any) => offer.version)),
    ] as Array<string>;
    return versions;
}

function projectAlreadyExists(projectName: string) {
    if (!fs.existsSync(projectsDirectory)) {
        fs.mkdirSync(projectsDirectory);
    }
    const projectPath = path.join(projectsDirectory, projectName);
    return fs.existsSync(projectPath);
}

export async function downloadWordPress(version: string) {
    if (!fs.existsSync(wordpressVersionDirectory)) {
        fs.mkdirSync(wordpressVersionDirectory);
    }
    if (
        fs.existsSync(
            path.join(wordpressVersionDirectory, `wordpress-${version}.zip`)
        )
    ) {
        console.log("File already exists");
        return path.join(wordpressVersionDirectory, `wordpress-${version}.zip`);
    }

    const res = await axios.get(
        `https://wordpress.org/wordpress-${version}.zip`,
        {
            responseType: "arraybuffer",
            headers: {
                "Cache-Control": "no-store",
            },
            onDownloadProgress: (progressEvent) => {
                console.log(
                    `Download Progress: ${Math.round(
                        (progressEvent.loaded / progressEvent.total!) * 100
                    )}%`
                );
            },
        }
    );
    const filename = path.join(
        wordpressVersionDirectory,
        `wordpress-${version}.zip`
    );
    fs.writeFileSync(filename, res.data);
    return filename;
}

function createProjectFolder(projectName: string) {
    if (!fs.existsSync(projectsDirectory)) {
        fs.mkdirSync(projectsDirectory);
    }
    const projectPath = path.join(projectsDirectory, projectName);
    if (fs.existsSync(projectPath)) {
        throw new Error("Project already exists");
    }
    fs.mkdirSync(projectPath);
    return projectPath;
}

function unzipWordPressToProject(
    zipFilePath: string,
    projectPath: string
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(unzipedWordPressDirectory)) {
            fs.mkdirSync(unzipedWordPressDirectory);
        }

        const unzipedWordPressVersionDirectory = path.join(
            unzipedWordPressDirectory,
            path.basename(zipFilePath, ".zip")
        );

        if (!fs.existsSync(unzipedWordPressVersionDirectory)) {
            fs.mkdirSync(unzipedWordPressVersionDirectory);
            await decompress(zipFilePath, unzipedWordPressVersionDirectory);

            const files = fs.readdirSync(
                path.join(unzipedWordPressVersionDirectory, "wordpress")
            );
            files.forEach((file) => {
                fs.copySync(
                    path.join(
                        unzipedWordPressVersionDirectory,
                        "wordpress",
                        file
                    ),
                    path.join(unzipedWordPressVersionDirectory, file)
                );
            });
            fs.rmSync(
                path.join(unzipedWordPressVersionDirectory, "wordpress"),
                { recursive: true }
            );
        } else {
            console.log("File already exists");
        }

        const files = fs.readdirSync(unzipedWordPressVersionDirectory);
        files.forEach((file) => {
            fs.copySync(
                path.join(unzipedWordPressVersionDirectory, file),
                path.join(projectPath, file)
            );
        });

        resolve(projectPath);
    });
}

async function setupWordPressProject(projectName: string, projectPath: string) {
    const wpConfigPath = path.join(projectPath, "wp-config.php");
    const wpConfigSamplePath = path.join(projectPath, "wp-config-sample.php");
    const wpConfigSample = fs.readFileSync(wpConfigSamplePath, "utf-8");
    let wpConfig = wpConfigSample;

    const databaseName = await createMYSQLDatabase(projectName);
    console.log("Database name", databaseName);

    // add Database credentials
    wpConfig = wpConfig.replace("database_name_here", databaseName);
    wpConfig = wpConfig.replace("username_here", process.env.MYSQL_ROOT_USER!);
    wpConfig = wpConfig.replace(
        "password_here",
        process.env.MYSQL_ROOT_PASSWORD!
    );
    wpConfig = wpConfig.replace("localhost", "mysql");

    wpConfig += "\n\ndefine('FS_METHOD', 'direct');";

    // add salts
    const generateSalt = (length: number) => {
        return crypto.randomBytes(length).toString("hex");
    };

    const salts = `
define('AUTH_KEY',         '${generateSalt(64)}');
define('SECURE_AUTH_KEY',  '${generateSalt(64)}');
define('LOGGED_IN_KEY',    '${generateSalt(64)}');
define('NONCE_KEY',        '${generateSalt(64)}');
define('AUTH_SALT',        '${generateSalt(64)}');
define('SECURE_AUTH_SALT', '${generateSalt(64)}');
define('LOGGED_IN_SALT',   '${generateSalt(64)}');
define('NONCE_SALT',       '${generateSalt(64)}');
`;
    wpConfig = wpConfig.replace(
        /(define\s*\(\s*'[^']*'\s*,\s*'put your unique phrase here'\s*\);[\r\n\s]*){8}/g,
        salts
    );

    // write wp-config.php
    fs.writeFileSync(wpConfigPath, wpConfig);
}

async function createMYSQLDatabase(projectName: string) {
    const MySqlConnection = mysql.createConnection(MYSQLConnectionConfig);

    MySqlConnection.connect((err) => {
        if (err) {
            throw err;
        }
        console.log("Connected!");

        MySqlConnection.query(
            `CREATE DATABASE IF NOT EXISTS ${projectName}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                console.log("Database created");
            }
        );
        MySqlConnection.end();
    });

    return projectName;
}

async function deleteMYSQLDatabase(projectName: string) {
    const MySqlConnection = mysql.createConnection(MYSQLConnectionConfig);
    MySqlConnection.connect((err) => {
        if (err) {
            throw err;
        }
        console.log("Connected!");

        MySqlConnection.query(
            `DROP DATABASE IF EXISTS ${projectName}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                console.log("Database deleted");
            }
        );
        MySqlConnection.end();
    });
}

export interface Project {
    name: string;
    created: Date;
    wordpressVersion?: string;
    databaseName?: string;
    wordPressUsername?: string;
    wordPressPassword?: string;
    notes?: string;
    databaseEntriesExist: boolean;
}

export async function getProjects(): Promise<Project[]> {
    const projectDirectory = path.join(process.cwd(), "web/subdomain");
    if (!fs.existsSync(projectDirectory)) {
        fs.mkdirSync(projectDirectory);
    }
    const projectFiles = fs.readdirSync(projectDirectory);

    let projects: Array<Project> = [];

    for (let i = 0; i < projectFiles.length; i++) {
        const project = projectFiles[i];

        const stats = fs.statSync(path.join(projectDirectory, project));

        const newProject: Project = {
            name: project,
            created: stats.birthtime,
            databaseEntriesExist: false,
        };
        try {
            const databaseServerInfo = await prisma.server.findUnique({
                where: {
                    name: project,
                },
            });
            if (!databaseServerInfo) {
                console.log("Server info not found");
                throw new Error("Server info not found");
            }
            newProject.databaseEntriesExist = true;
            newProject.databaseName = databaseServerInfo.databaseName;
            newProject.wordPressUsername = databaseServerInfo.wordPressUsername;
            newProject.wordPressPassword = databaseServerInfo.wordPressPassword;
            newProject.notes = databaseServerInfo.notes || "";
            newProject.wordpressVersion =
                databaseServerInfo.wordpressVersion || "unable to find version";
        } catch (e) {}
        projects.push(newProject);
    }

    return projects;
}

export async function deleteProject(project: string) {
    const projectDirectory = path.join(process.cwd(), "web/subdomain", project);
    if (!fs.existsSync(projectDirectory)) {
        throw new Error("Project does not exist");
    }
    console.log("Deleting project", projectDirectory);
    fs.rmSync(projectDirectory, { recursive: true });

    await deleteMYSQLDatabase(project);
    try {
        await prisma.server.delete({
            where: {
                name: project,
            },
        });
    } catch (e) {}

    revalidatePath("/");
    return true;
}

function generateRandomPassword(length: number) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export async function updateProjectInformation(
    project: string,
    username: string,
    password: string,
    notes: string
) {
    try {
        await prisma.server.update({
            where: {
                name: project,
            },
            data: {
                wordPressUsername: username,
                wordPressPassword: password,
                notes: notes,
            },
        });
    } catch (e) {
        console.log(e);
    }
    revalidatePath("/");
}
