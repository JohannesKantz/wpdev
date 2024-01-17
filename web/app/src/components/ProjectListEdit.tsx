"use client";

import React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Project, updateProjectInformation } from "@/lib/actions";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

export default function ProjectListEdit({ project }: { project: Project }) {
    const userNameRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const notesRef = React.useRef<HTMLTextAreaElement>(null);

    const { toast } = useToast();

    async function handleSave() {
        const userName = userNameRef.current?.value;
        const password = passwordRef.current?.value;
        const notes = notesRef.current?.value;

        if (!userName || !password || !notes) {
            return;
        }

        await updateProjectInformation(project.name, userName, password, notes);

        toast({
            title: "Project Updated",
            description: "Project information has been updated",
        });
        console.log("save");
    }

    return (
        <div>
            <Popover>
                <PopoverTrigger>edit</PopoverTrigger>
                <PopoverContent className="w-[500px]">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                                Edit Project
                                <span className="text-slate-400 ml-2">
                                    {project.name}
                                </span>
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Be cautious when editing project information.
                                There is no history or undo.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    defaultValue={project.wordPressUsername}
                                    className="col-span-2 h-8"
                                    ref={userNameRef}
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    defaultValue={project.wordPressPassword}
                                    className="col-span-2 h-8"
                                    ref={passwordRef}
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="notes" className="self-start">
                                    Notes
                                </Label>
                                <Textarea
                                    className="col-start-2 col-end-4 h-56 resize-none"
                                    id="notes"
                                    defaultValue={project.notes}
                                    ref={notesRef}
                                />
                            </div>
                            <Button onClick={handleSave} className="mt-4">
                                Save
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
