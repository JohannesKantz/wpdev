import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import ShowHidePassword from "./ShowHidePassword";

export default async function DatabaseInfo() {
    const rootUser = (await process.env.MYSQL_ROOT_USER) || "root";
    const rootPassword = (await process.env.MYSQL_ROOT_PASSWORD) || "root";
    const phpmyadminUrl =
        (await process.env.PHPMYADMIN_URL) || "http://localhost:8080";
    const mysqlVersion = (await process.env.MYSQL_VERSION) || "8.0.26";

    return (
        <div>
            <Card className="w-[690px]">
                <CardHeader>
                    <CardTitle>Database Info</CardTitle>
                    <CardDescription>
                        MySQL version {mysqlVersion}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-bold text-lg">Root user</h3>
                        <p className="text-sm text-muted-foreground">
                            Username: {rootUser}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Password:{" "}
                        </p>
                        <ShowHidePassword password={rootPassword} />
                    </div>
                    <div>
                        <h3 className="text-bold text-lg">phpMyAdmin</h3>
                        <p className="text-sm text-blue-400">
                            <a href={phpmyadminUrl}>{phpmyadminUrl}</a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
