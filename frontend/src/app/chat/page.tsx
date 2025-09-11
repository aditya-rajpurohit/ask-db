"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
    const [connectionId, setConnectionId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("connectionId");
        setConnectionId(stored || "");
    }, []);

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="w-full max-w-3xl h-[80vh]">
                {connectionId === null ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : connectionId ? (
                    <ChatBox connectionId={connectionId} />
                ) : (
                    <div className="flex flex-col h-full bg-white shadow-md rounded-xl items-center justify-center">
                        <p className="text-gray-600 text-center">
                            No database connection found. Please{" "}
                            <a href="/db-connection" className="text-black underline">
                                connect a database
                            </a>{" "}
                            first.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}