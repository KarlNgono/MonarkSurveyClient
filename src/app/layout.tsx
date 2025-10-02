import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import {Toaster} from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MonarkSurvey",
    description: "Build your Surveys",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <LayoutWrapper>
            {children}
        </LayoutWrapper>
        <Toaster richColors position="top-right" duration={10000} />
        </body>
        </html>
    );
}
