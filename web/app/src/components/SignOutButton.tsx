import React from "react";
import { signOut } from "../../auth";
import { Button } from "./ui/button";

export default function SignOutButton() {
    return (
        <div>
            <form
                action={async () => {
                    "use server";
                    await signOut();
                }}
            >
                <Button className="w-24 self-end">Sign out</Button>
            </form>
        </div>
    );
}
