"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                router.push("/");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">

                <button
                    type="button"
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <Image
                        className="h-8 w-auto dark:invert"
                        src="/next.svg"
                        alt="Next.js Logo"
                        width={40}
                        height={40}
                        priority
                    />
                    <span className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">
                        MONARK <span className="text-[#A8CD28]">SURVEY</span>
                    </span>
                </button>

                <nav className="hidden md:flex items-center gap-6 font-medium">
                    <Link
                        href="/surveyList"
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        Survey List
                    </Link>
                    <Link
                        href="/creator"
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        Create Survey
                    </Link>
                    <Link
                        href="/users"
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        Users
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/tabulator"
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        Results Table
                    </Link>
                    <Link
                        href="/pdf-export"
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        PDF Generator
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}