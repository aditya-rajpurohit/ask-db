"use client";

import { useState } from "react";
import { testConnection, saveConnection } from "../lib/api";

export default function ConnectionForm({ onSuccess }: { onSuccess: () => void }) {
    const [form, setForm] = useState({
        name: "",
        host: "",
        port: 5432,
        database: "",
        username: "",
        password: "",
        db_type: "postgresql",
    });

    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTest = async () => {
        const res = await testConnection(form);
        setStatus(res.message);
    };

    const handleSave = async () => {
        const res = await saveConnection(form);
        if (res.success) {
            onSuccess();
        } else {
            setStatus(res.message);
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Database Connection</h2>
            <div className="space-y-3">
                {["name", "host", "database", "username"].map((field) => (
                    <input
                        key={field}
                        name={field}
                        placeholder={field[0].toUpperCase() + field.slice(1)}
                        value={(form as any)[field]}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black/50"
                    />
                ))}
                <input
                    type="number"
                    name="port"
                    placeholder="Port"
                    value={form.port}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black/50"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black/50"
                />
                <select
                    name="db_type"
                    value={form.db_type}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black/50"
                >
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="sqlite">SQLite</option>
                </select>
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={handleTest}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Test
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                    Save & Continue
                </button>
            </div>
            {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
        </div>
    );
}