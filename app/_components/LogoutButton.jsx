// app/_components/LogoutButton.jsx
"use client";

import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import LogoutModal from "./LogoutModal";
import { LuLogOut } from "react-icons/lu";

export default function LogoutButton({ variant = "default" }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (variant === "icon") {
        return (
            <>
                <button
                    onClick={openModal}
                    className="p-2 sm:px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-sm transition-all duration-200 hover:scale-105 flex items-center gap-2 text-[1.2rem] cursor-pointer font-medium"
                    title="Logout"
                >
                    <LuLogOut className="w-5 h-5 sm:w-7 sm:h-7" />
                    <p className="hidden sm:block">Log out</p>
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

// if (variant === "sidebar") {
//     return (
//         <>
//             <button
//                 onClick={openModal}
//                 className="w-[100%] flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
//             >
//                 <LuLogOut className="w-8 h-8" />
//                 <span>Logout</span>
//             </button>
//             <LogoutModal
//                 isOpen={isModalOpen}
//                 onClose={closeModal}
//             />
//         </>
//     );
// }
