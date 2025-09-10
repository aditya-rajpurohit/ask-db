"use client";

import { useState } from "react";
import { sendMessage } from "../lib/api";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatBox({ connectionId }: { connectionId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input) return;

        const newMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, newMessage]);

        const res = await sendMessage({
            message: input,
            database_connection_id: connectionId,
        });

        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: res.message || "Error generating SQL" },
        ]);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-white shadow-md rounded-xl">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user"
                                ? "bg-black text-white ml-auto"
                                : "bg-gray-100 text-gray-900 mr-auto"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="p-4 border-t flex">
                <input
                    className="flex-1 border rounded-lg p-2 mr-2 focus:ring-2 focus:ring-black/50"
                    placeholder="Ask your database..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                    Send
                </button>
            </div>
        </div>
    );
}