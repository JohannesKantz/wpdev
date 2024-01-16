import { getUrl } from "@/lib/utils";
import React from "react";

export default function ProjectListLink({ project }: { project: string }) {
    return <a href={getUrl(project)}>{getUrl(project)}</a>;
}
