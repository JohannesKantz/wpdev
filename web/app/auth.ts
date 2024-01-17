import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

const UsernamePasswordLoginProvider = CredentialsProvider({
    name: "Username and Password",
    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials, request) {
        console.log("credentials", credentials);
        if (
            credentials.username == process.env.ADMIN_USER &&
            credentials.password == process.env.ADMIN_PASSWORD
        ) {
            return { id: "1", name: "Admin" };
        }
        return null;
    },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [UsernamePasswordLoginProvider],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },

    trustHost: true,
    useSecureCookies: false,
});
