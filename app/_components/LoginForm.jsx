// app/_components/LoginForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuLogIn } from "react-icons/lu";
import { FaKey, FaUser } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";

export default function LoginForm() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading("Logging in...");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Login failed", { id: toastId });
                setLoading(false);
                return;
            }

            toast.success("Welcome back!", { id: toastId });

            // رفرش صفحه برای بروزرسانی وضعیت
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error("❌ [LoginForm] Error:", error);
            toast.error(error.message || "Something went wrong", {
                id: toastId,
            });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[95vw] sm:w-[80vw] md:w-[40vw] grid grid-cols-2 shadow-lg shadow-black/10 dark:shadow-white/10">
            <div className="bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-[1.2rem] p-6">
                <p className="text-gray-700 dark:text-gray-300">
                    <IoWarning className="w-12 h-12 mx-auto mb-4" />
                    Access is restricted to admins and authors only. If you wish
                    to contribute and publish news, please contact the admin to
                    arrange for an account to be set up for you.
                </p>
            </div>
            <form
                onSubmit={handleSubmit}
                className="p-12 px-18 bg-gray-100 dark:bg-zinc-900 flex flex-col justify-center items-center"
            >
                <div className="flex justify-center mb-4 -mt-28 z-30">
                    <div className="w-36 h-36 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
                        <LuLogIn className="w-15 h-15 text-zinc-900 dark:text-zinc-100" />
                    </div>
                </div>
                <h1 className="text-[2rem] mb-8 text-gray-700 dark:text-gray-300">
                    Hello Again
                </h1>

                <div className="gap-2 mb-4 w-full">
                    <label
                        htmlFor="identifier"
                        className="label block mb-2 text-gray-700 dark:text-gray-300"
                    >
                        Email or Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-400 dark:border-zinc-700 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            disabled={loading}
                            required
                            placeholder="Enter email or username"
                        />
                    </div>
                </div>

                <div className="gap-2 mb-6 w-full">
                    <label
                        htmlFor="password"
                        className="label block mb-2 text-gray-700 dark:text-gray-300"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaKey className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-400 dark:border-zinc-700 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            disabled={loading}
                            required
                            placeholder="Enter password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:-translate-y-1 transition-all duration-200 px-8 py-2 text-[1.4rem] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {loading && (
                    <div className="mt-4 text-gray-700 dark:text-gray-300 text-[1.2rem]">
                        Please wait...
                    </div>
                )}
            </form>
        </div>
    );
}
