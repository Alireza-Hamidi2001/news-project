// app/_components/ToggleStatusModal.jsx
"use client";

import { FaSpinner, FaUserCheck, FaUserTimes } from "react-icons/fa";

export default function ToggleStatusModal({
    isOpen,
    onClose,
    onConfirm,
    userName,
    currentStatus,
    isLoading,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div
                className="bg-white dark:bg-zinc-900 rounded-sm shadow-2xl max-w-md w-[75vw] sm:w-[50vw] md:w-[35vw] p-12 border border-gray-200 dark:border-gray-700 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4 -mt-32 z-30">
                        <div className="w-36 h-36 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                            {currentStatus ? (
                                <FaUserTimes className="w-15 h-15 text-red-600 dark:text-red-400" />
                            ) : (
                                <FaUserCheck className="w-15 h-15 text-green-600 dark:text-green-400" />
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[2rem] font-bold text-gray-900 dark:text-white mb-2">
                        {currentStatus ? "Deactivate" : "Activate"} User
                    </h3>

                    {/* Message */}
                    <p className="text-[1.4rem] text-gray-600 dark:text-gray-300 mb-6">
                        Are you sure you want to{" "}
                        {currentStatus ? "deactivate" : "activate"}
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {" "}
                            {userName}
                        </span>
                        ?
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2.5 text-white text-[1.4rem] font-medium rounded-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                currentStatus
                                    ? "confirmBtn bg-red-500 hover:bg-red-600"
                                    : "confirmBtn bg-green-500 hover:bg-green-600"
                            }`}
                        >
                            {isLoading ? (
                                <FaSpinner className="animate-spin" />
                            ) : currentStatus ? (
                                <FaUserTimes />
                            ) : (
                                <FaUserCheck />
                            )}
                            {currentStatus ? "Deactivate" : "Activate"}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 cancelBtn bg-gray-100 dark:bg-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
