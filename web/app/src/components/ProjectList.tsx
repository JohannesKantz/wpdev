import { getProjects } from "@/lib/actions";
import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ProjectListDeleteButton from "./ProjectListDeleteButton";
import ProjectListLink from "./ProjectListLink";

export default async function ProjectList() {
    const projects = await getProjects();

    return (
        <div className="my-12">
            <Table className="w-[690px]">
                <TableCaption>Server List</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Server name</TableHead>
                        <TableHead>url</TableHead>
                        <TableHead className="w-[120px]">
                            Creation Date
                        </TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project.name}>
                            <TableCell className="font-medium">
                                {project.name}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                                <ProjectListLink project={project.name} />
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                                {project.created.toISOString().split("T")[0]}
                            </TableCell>
                            <TableCell className="text-right">
                                <ProjectListDeleteButton
                                    project={project.name}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
