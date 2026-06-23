// app/_components/LoginForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    console.log("🔍 [LoginForm] Component rendered");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("🔍 [LoginForm] Form submitted");
        console.log(`🔍 [LoginForm] Username: "${username}"`);
        console.log(`🔍 [LoginForm] Password length: ${password.length}`);

        setLoading(true);
        const toastId = toast.loading("Logging in...");

        try {
            console.log("🔍 [LoginForm] Sending request to /api/auth/login");
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            console.log(`🔍 [LoginForm] Response status: ${res.status}`);
            console.log(`🔍 [LoginForm] Response data:`, data);

            if (!res.ok) {
                console.warn("⚠️ [LoginForm] Login failed:", data.error);
                toast.error(data.error || "Login failed", { id: toastId });
                setLoading(false);
                return;
            }

            console.log("✅ [LoginForm] Login successful, redirecting...");
            toast.success("Login successful", { id: toastId });
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error("❌ [LoginForm] Error:", error.message);
            toast.error("Something went wrong", { id: toastId });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-12 px-18 bg-gray-100 dark:bg-zinc-900 flex flex-col justify-center items-center rounded-2xl shadow-2xl"
        >
            <h1 className="title text-blue-400 mb-12 text-3xl font-bold">
                Login form
            </h1>

            <div className="gap-2 mb-4 w-full">
                <label
                    htmlFor="username"
                    className="label block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input w-full p-2 border rounded"
                    disabled={loading}
                    required
                />
            </div>

            <div className="gap-2 mb-6 w-full">
                <label
                    htmlFor="password"
                    className="label block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full p-2 border rounded"
                    disabled={loading}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:-translate-y-1 transition-all duration-200 px-8 py-2 text-[1.5rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            {loading && (
                <div className="mt-4 text-blue-400 text-sm">Please wait...</div>
            )}
        </form>
    );
}
