// app/dashboard/writers/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserTag,
    FaPlus,
    FaSpinner,
} from "react-icons/fa";
import { FaCheck, FaNewspaper } from "react-icons/fa6";
import { ImCross } from "react-icons/im";

export default function NewWriterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Creating writer...");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create writer");
            }

            toast.success("Writer created successfully! ✍️", { id: toastId });

            // Reset form
            setFormData({
                full_name: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            router.refresh();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <FaUserTag className="bg-emerald-100 p-2 dark:bg-emerald-900/30 rounded-lg w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                            <h1 className="postTitle font-comic">New Author</h1>
                        </div>
                        <p className="subTitle">
                            Create a new writer account with author privileges
                        </p>
                    </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 md:p-8">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 grid grid-cols-2 gap-x-2"
                    >
                        {/* Full Name */}
                        <div className="">
                            <label className="label">
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className={`text-[1.2rem] tracking-wider w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                        errors.full_name
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="Enter full name"
                                    disabled={loading}
                                />
                            </div>
                            {errors.full_name && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ImCross className="w-3 h-3" />
                                    {errors.full_name}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="label">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUserTag className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`text-[1.2rem] tracking-wider w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                        errors.full_name
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="Enter username (min 3 characters)"
                                    disabled={loading}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ImCross className="w-3 h-3" />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="label">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`text-[1.2rem] tracking-wider w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                        errors.full_name
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="Enter email address"
                                    disabled={loading}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ImCross className="w-3 h-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="label">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`text-[1.2rem] tracking-wider w-full pl-10 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                        errors.full_name
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="Enter password (min 6 characters)"
                                    disabled={loading}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ImCross className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="label">
                                Confirm Password{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`text-[1.2rem] tracking-wider w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                        errors.full_name
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="Confirm password"
                                    disabled={loading}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ImCross className="w-3 h-3" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Role Badge */}
                        <div className="text-[1.2rem] tracking-wider flex items-center self-end gap-2 p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-sm border border-emerald-300 dark:border-emerald-800">
                            <FaUserTag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                                Role:{" "}
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Writer
                                </span>
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-auto">
                                (Author privileges)
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="confirmBtn bg-emerald-500 hover:bg-emerald-600 duration-200 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FaPlus />
                                        Create Writer
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push("/dashboard")}
                                className="cancelBtn bg-gray-200 dark:bg-zinc-800"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="flex items-center gap-2 text-[1.2rem] text-blue-700 dark:text-blue-300">
                    <FaNewspaper className="w-8 h-8" />{" "}
                    <span className="font-medium">Note:</span> New writers will
                    have access to create, edit, and manage their own posts.
                    They will not have administrative privileges.
                </p>
            </div>
        </div>
    );
}
