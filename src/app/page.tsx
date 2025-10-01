"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        try {
            const res = await fetch(`${apiBaseUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            router.push("/surveyList");
        } catch {
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden md:flex w-1/2 bg-[#D9EFC8] flex-col justify-center items-center p-10 text-gray-900">
                <div className="flex flex-col items-center gap-6 text-center">
                    <button type="button" className="flex items-center gap-3 focus:outline-none">
                        <Image
                            className="h-16 w-auto"
                            src="/next.svg"
                            alt="Next.js Logo"
                            width={64}
                            height={64}
                            priority
                        />
                        <span className="text-3xl font-bold tracking-wide">
                            MONARK <span className="text-[#A8CD28]">SURVEY</span>
                        </span>
                    </button>
                    <p className="mt-4 text-lg max-w-md text-gray-700 leading-relaxed tracking-wide">
                        Welcome back! Enter your email and password to access your surveys quickly and securely.
                    </p>
                </div>
            </div>

            <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50 dark:bg-gray-900 p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                        Sign In
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="info@gmail.com"
                                className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8CD28] dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8CD28] dark:bg-gray-800 dark:text-white"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                    className="w-4 h-4 border-gray-300 rounded text-[#A8CD28] focus:ring-[#A8CD28]"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-400">
                                    Keep me logged in
                                </span>
                            </div>
                            <Link href="#" className="text-sm text-[#A8CD28] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 text-sm font-semibold text-white bg-[#A8CD28] rounded-lg hover:bg-[#94b822] transition-colors"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
