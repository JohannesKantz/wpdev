"use client";
import React from "react";
import {
    CreateNewProjectResponse,
    createNewProject,
    getWordPressVersions,
} from "../lib/actions";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import LoadingSpinner from "./LoadingSpinner";
import { getUrl } from "@/lib/utils";

const formSchema = zod.object({
    projectName: zod
        .string()
        .min(1)
        .max(64)
        .refine((s) => !s.includes(" "), "No Spaces!"),
    wordpressVersion: zod.string().min(1, "Please select a version"),
});

export default function CreateNewServer() {
    const form = useForm<zod.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectName: "",
            wordpressVersion: "6.4.2",
        },
    });

    const [versions, setVersions] = React.useState<Array<String>>();
    const [pending, setPending] = React.useState<boolean>(false);
    const [response, setResponse] = React.useState<CreateNewProjectResponse>();

    async function handleSubmit(values: zod.infer<typeof formSchema>) {
        const projectName = values.projectName;
        const wordpressVersion = values.wordpressVersion;
        console.log(projectName, wordpressVersion);
        setPending(true);
        const res = await createNewProject(projectName, wordpressVersion);
        setPending(false);
        if (res.status === "success") {
            setResponse(res);
        } else {
            setResponse(res);
        }
    }

    React.useEffect(() => {
        async function init() {
            setVersions(await getWordPressVersions());
        }
        init();
    }, []);

    return (
        <div>
            <Card className="min-w-[690px]">
                <CardHeader>
                    <CardTitle>Create a new Webserver</CardTitle>
                    <CardDescription>Quick and Easy</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="projectName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="projectName">
                                            Server Name
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            name="projectName"
                                            disabled={pending}
                                        />
                                        <FormMessage>
                                            {
                                                form.formState.errors
                                                    .projectName?.message
                                            }
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="wordpressVersion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="wordpressVersion">
                                            WordPress Version
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            name="wordpressVersion"
                                            disabled={pending}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Wordpress Version" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {!!versions &&
                                                    versions.map(
                                                        (
                                                            version: any,
                                                            i: number
                                                        ) => (
                                                            <SelectItem
                                                                key={i}
                                                                value={version}
                                                            >
                                                                {version}
                                                            </SelectItem>
                                                        )
                                                    )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>
                                            {
                                                form.formState.errors
                                                    .wordpressVersion?.message
                                            }
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <Button disabled={pending} className="w-48">
                                {pending ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Create Webserver"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                {!!response && response.status === "success" && (
                    <CardFooter>
                        <div>
                            <p>
                                New Server Created:{" "}
                                <a
                                    href={getUrl(response.projectName)}
                                    className="text-blue-500"
                                >
                                    {getUrl(response.projectName)}
                                </a>
                            </p>
                        </div>
                    </CardFooter>
                )}
                {!!response && response.status === "error" && (
                    <CardFooter>
                        <p className="text-red-800">{response.message}</p>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
