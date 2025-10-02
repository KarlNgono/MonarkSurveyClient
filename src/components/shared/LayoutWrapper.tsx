"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/shared/Header";

export default function LayoutWrapper({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const hideHeader = pathname === "/";

    return (
        <>
            {!hideHeader && <Header />}
            <main>{children}</main>
        </>
    );
}