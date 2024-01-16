import React from "react";
import { auth, signIn } from "../../auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function LoginForm() {
    const session = await auth();

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Website Creation Tool</CardTitle>
                    <CardDescription>
                        Login to access the Dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        action={async (formData: FormData) => {
                            "use server";
                            const username = formData.get("username") as string;
                            const password = formData.get("password") as string;
                            await signIn("credentials", { username, password });
                        }}
                        className="flex flex-col gap-4"
                    >
                        <Label>Username</Label>
                        <Input type="text" name="username" />
                        <Label>Password</Label>
                        <Input type="password" name="password" />
                        <Button className="w-24 self-end">Sign in</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
