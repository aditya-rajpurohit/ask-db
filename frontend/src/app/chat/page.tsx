"use client";

import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
    const connectionId =
        typeof window !== "undefined"
            ? localStorage.getItem("connectionId") || ""
            : "";

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="w-full max-w-3xl h-[80vh]">
                {connectionId ? (
                    <ChatBox connectionId={connectionId} />
                ) : (
                    <p className="text-gray-600 text-center">
                        No database connection found. Please{" "}
                        <a href="/db-connection" className="text-black underline">
                            connect a database
                        </a>{" "}
                        first.
                    </p>
                )}
            </div>
        </main>
    );
}