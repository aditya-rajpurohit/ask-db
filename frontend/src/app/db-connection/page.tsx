"use client";

import ConnectionForm from "@/components/ConnectionForm";

export default function DbConnectionPage() {
    const handleSuccess = (connection: { id: string }) => {
        localStorage.setItem("connectionId", connection.id);
        window.location.href = "/chat";
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
            <ConnectionForm onSuccess={handleSuccess} />
        </main>
    );
}