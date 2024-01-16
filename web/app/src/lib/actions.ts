"use server";

import path from "path";
import fs from "fs";
import axios from "axios";
import unzipper from "unzipper";
import { revalidatePath } from "next/cache";

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

    console.log("Creating new project", projectName, wordpressVersion);

    const zipFilePath = await downloadWordPress(wordpressVersion);
    const projectPath = createProjectFolder(projectName);
    console.log("Project path", projectPath);
    await unzipWordPressToProject(zipFilePath, projectPath);

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
    const projectDirectory = path.join(process.cwd(), "web/subdomain");
    if (!fs.existsSync(projectDirectory)) {
        fs.mkdirSync(projectDirectory);
    }
    const projectPath = path.join(projectDirectory, projectName);
    return fs.existsSync(projectPath);
}

export async function downloadWordPress(version: string) {
    const wordpressVersionDirectory = path.join(
        process.cwd(),
        "web/wordpressVersions"
    );

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
    const projectDirectory = path.join(process.cwd(), "web/subdomain");
    if (!fs.existsSync(projectDirectory)) {
        fs.mkdirSync(projectDirectory);
    }
    const projectPath = path.join(projectDirectory, projectName);
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
    return new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: projectPath }))
            .on("close", () => {
                console.log("Finished unzipping");
                // move files from wordpress folder to project folder
                const wordpressFolder = path.join(projectPath, "wordpress");
                console.log(
                    "Moving files from",
                    wordpressFolder,
                    "to",
                    projectPath
                );
                const files = fs.readdirSync(wordpressFolder);
                console.log(files);
                files.forEach((file) => {
                    fs.renameSync(
                        path.join(wordpressFolder, file),
                        path.join(projectPath, file)
                    );
                });
                fs.rmdirSync(wordpressFolder);
                resolve(path.join(projectPath, "wordpress"));
            })
            .on("error", (e) => {
                console.log("Error unzipping", e.message);
                reject(e.message);
            });
    });
}

interface Project {
    name: string;
    created: Date;
}

export async function getProjects(): Promise<Project[]> {
    const projectDirectory = path.join(process.cwd(), "web/subdomain");
    if (!fs.existsSync(projectDirectory)) {
        fs.mkdirSync(projectDirectory);
    }
    const projectFiles = fs.readdirSync(projectDirectory);

    let projects: Array<Project> = [];
    projectFiles.forEach((project) => {
        const stats = fs.statSync(path.join(projectDirectory, project));
        projects.push({
            name: project,
            created: stats.birthtime,
        });
    });

    return projects;
}

export async function deleteProject(project: string) {
    const projectDirectory = path.join(process.cwd(), "web/subdomain", project);
    if (!fs.existsSync(projectDirectory)) {
        throw new Error("Project does not exist");
    }
    console.log("Deleting project", projectDirectory);
    fs.rmSync(projectDirectory, { recursive: true });
    revalidatePath("/");
    return true;
}
