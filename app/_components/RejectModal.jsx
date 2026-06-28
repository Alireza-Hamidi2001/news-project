// app/_components/RejectModal.jsx
"use client";

import { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

export default function RejectModal({ isOpen, onClose, onConfirm, postTitle }) {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(reason || "No reason provided");
        setReason("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-sm shadow-2xl max-w-md w-[75vw] sm:w-[50vw] md:w-[35vw] p-12 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4 -mt-32 z-30">
                        <div className="w-36 h-36 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                            <TiDelete className="animate-scaleIn-modal-icon w-30 h-30 text-red-600 dark:text-red-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[3rem] font-bold text-gray-900 dark:text-white mb-2">
                        Reject Post
                    </h3>

                    {/* Message */}
                    <p className="text-[1.4rem] text-gray-600 dark:text-gray-300 mb-4">
                        Are you sure you want to reject{" "}
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            {postTitle}
                        </span>
                        ?
                    </p>

                    {/* Reason Input */}
                    <div className="mb-4 text-left">
                        <label className="label text-[1.2rem]">
                            Reason (optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows="3"
                            className="text-[1.2rem] w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                            placeholder="Why are you rejecting this post?"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleConfirm}
                            className="flex-1 confirmBtn bg-red-500 hover:bg-red-600 transition-all duration-200"
                        >
                            <FaTrash />
                            Reject
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
