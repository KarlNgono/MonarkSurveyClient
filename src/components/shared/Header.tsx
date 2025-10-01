"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/logout`, {
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

    const navLinks = [
        { href: "/surveyList", label: "Survey List" },
        { href: "/users", label: "Users" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/tabulator", label: "Results Table" },
        { href: "/pdf-export", label: "PDF Generator" },
    ];

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
                {/* Logo */}
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

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-6 font-medium">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                    >
                        Logout
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <nav className="flex flex-col p-4 gap-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="text-gray-700 hover:text-[#A8CD28] dark:text-gray-200 dark:hover:text-blue-400 transition text-left"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
}
