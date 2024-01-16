"use client";

import { deleteProject } from "@/lib/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import React from "react";

export default function ProjectListDeleteButton({
    project,
}: {
    project: string;
}) {
    const [confirmValue, setConfirmValue] = React.useState<string>("");
    async function handleDelete() {
        if (confirmValue !== project) {
            return;
        }
        await deleteProject(project);
    }

    return (
        <>
            {/* <button className="text-red-500" onClick={handleDelete}>
                Delete
            </button> */}
            <AlertDialog>
                <AlertDialogTrigger className="text-red-500">
                    delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this server.
                            <div className="mt-4">
                                <Label>
                                    Confirm by typing{" "}
                                    <span className="font-bold text-zinc-100">
                                        {project}
                                    </span>
                                </Label>
                                <Input
                                    onChange={(e) =>
                                        setConfirmValue(e.target.value)
                                    }
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 text-white"
                            disabled={confirmValue !== project}
                        >
                            DELETE
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
