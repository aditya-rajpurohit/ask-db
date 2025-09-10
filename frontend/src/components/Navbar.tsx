"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full border-b bg-white/80 backdrop-blur px-8 py-3 flex justify-between items-center sticky top-0 z-10">
            <Link href="/" className="text-xl font-semibold tracking-tight">
                DB Assistant
            </Link>
            <div className="space-x-6 text-sm font-medium">
                <Link href="/db-connection" className="text-gray-600 hover:text-black">
                    Connect DB
                </Link>
                <Link href="/chat" className="text-gray-600 hover:text-black">
                    Chat
                </Link>
            </div>
        </nav>
    );
}