// app/_components/LogoutModal.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

export default function LogoutModal({ isOpen, onClose }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const toastId = toast.loading("Logging out...");

        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!res.ok) {
                toast.error("Logout failed", { id: toastId });
                setLoading(false);
                return;
            }

            toast.success("Logged out successfully 👋", { id: toastId });
            onClose();
            router.push("/login");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong", { id: toastId });
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center animate-scaleIn">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-sm shadow-2xl max-w-md w-[75vw] sm:w-[50vw] md:w-[35vw] p-12 border border-gray-200 dark:border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative flex justify-between items-center mb-6">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                            disabled={loading}
                        >
                            <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-4 -mt-36 z-30">
                        <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center">
                            <FaSignOutAlt className="w-15 h-15 text-red-500 dark:text-red-400" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center mb-6 mainText">
                        <p className="text-gray-600 dark:text-gray-300">
                            Are you sure you want to logout?
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 mt-1">
                            You will need to login again to access your
                            dashboard
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex w-50% mx-auto gap-3 mt-10 mainText">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="cancelBtn bg-gray-100 dark:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="confirmBtn bg-red-500 hover:bg-red-600"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Logging out...
                                </>
                            ) : (
                                <>Confirm</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
