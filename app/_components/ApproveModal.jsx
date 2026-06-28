// app/_components/ApproveModal.jsx
"use client";

import { FaCheck, FaTimes } from "react-icons/fa";

export default function ApproveModal({
    isOpen,
    onClose,
    onConfirm,
    postTitle,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-sm shadow-2xl max-w-md w-[75vw] sm:w-[50vw] md:w-[35vw] p-12 border border-gray-200 dark:border-gray-800">
                <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4 -mt-30 z-30">
                        <div className="w-35 h-35 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                            <FaCheck className="animate-scaleIn-modal-icon w-15 h-15 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[3rem] font-bold text-gray-900 dark:text-white mb-2">
                        Approve Post
                    </h3>

                    {/* Message */}
                    <p className="text-[1.4rem] text-gray-600 dark:text-gray-300 mb-6">
                        Are you sure you want to approve{" "}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {postTitle}
                        </span>
                        ? This will publish it immediately.
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onConfirm}
                            className="flex-1 confirmBtn bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
                        >
                            <FaCheck />
                            Approve
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 cancelBtn bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                            <FaTimes />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
