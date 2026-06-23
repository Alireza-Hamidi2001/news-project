// app/_components/LogoutButton.jsx
"use client";

import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import LogoutModal from "./LogoutModal";

export default function LogoutButton({ variant = "default" }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // استایل‌های مختلف
    if (variant === "sidebar") {
        return (
            <>
                <button
                    onClick={openModal}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <FaSignOutAlt className="w-8 h-8" />
                    <span>Logout</span>
                </button>
                <LogoutModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            </>
        );
    }

    if (variant === "icon") {
        return (
            <>
                <button
                    onClick={openModal}
                    className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Logout"
                >
                    <FaSignOutAlt className="w-7 h-7" />
                </button>
                <LogoutModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            </>
        );
    }

    // حالت پیشفرض
    return (
        <>
            <button
                onClick={openModal}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 text-sm font-medium"
            >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
            </button>
            <LogoutModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>
    );
}
