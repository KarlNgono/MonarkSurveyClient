"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/me", {
                    credentials: "include",
                });

                if (!res.ok) {
                    setUser(null);
                } else {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await fetch("http://localhost:5000/api/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            router.push("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return { user, loading, logout };
}
