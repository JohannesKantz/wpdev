import { getUrl } from "@/lib/utils";
import React from "react";

export default function ProjectListLink({ project }: { project: string }) {
    return (
        <a className="text-blue-400" href={getUrl(project)} target="_blank">
            {getUrl(project)}
        </a>
    );
}
