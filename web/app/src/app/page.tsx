import CreateNewServer from "@/components/CreateNewServer";
import ProjectList from "@/components/ProjectList";
import { auth } from "../../auth";
import LoginForm from "@/components/LoginForm";
import SignOutButton from "@/components/SignOutButton";
import DatabaseInfo from "@/components/DatabaseInfo";
import { Toaster } from "@/components/ui/toaster";

export default async function Home() {
    const sesstion = await auth();

    if (!sesstion) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <LoginForm />
            </main>
        );
    }

    return (
        <>
            <header className="flex justify-between items-center p-4">
                <h1 className="text-xl font-bold">Website Manger</h1>
                <SignOutButton />
            </header>
            <main className="flex min-h-screen flex-col items-center p-24">
                <CreateNewServer />
                <ProjectList />
                <DatabaseInfo />
            </main>
            <Toaster />
        </>
    );
}
