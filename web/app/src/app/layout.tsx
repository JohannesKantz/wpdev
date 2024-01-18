import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Wordpress Manager | wpDev",
    description: "Create and manage your Wordpress sites with ease.",
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            nosnippet: true,
            noimageindex: true,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
