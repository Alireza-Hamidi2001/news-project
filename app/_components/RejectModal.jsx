"use client";

import { useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

export default function RejectModal({ isOpen, onClose, onConfirm, postTitle }) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm(reason);
        setLoading(false);
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
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        disabled={loading}
                    >
                        <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4 -mt-36 z-30">
                        <div className="w-36 h-36 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                            <FaExclamationTriangle className="w-15 h-15 text-red-500 dark:text-red-400" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center mb-6 mainText">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            Reject Post
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Are you sure you want to reject this post?
                        </p>
                        {postTitle && (
                            <p className="text-gray-500 dark:text-gray-400 mt-1 text-[1.2rem]">
                                <span className="font-medium">{postTitle}</span>
                            </p>
                        )}
                        <p className="text-gray-400 dark:text-gray-500 mt-2 text-[1.2rem]">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Reason Input */}
                    <div className="mb-6">
                        <label className="label text-[1.2rem] mb-1 block">
                            Reason (Optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Why are you rejecting this post?"
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex w-50% mx-auto gap-3 mainText">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="cancelBtn bg-gray-100 dark:bg-gray-800 flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="confirmBtn bg-red-500 hover:bg-red-600 flex-1"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Rejecting...
                                </>
                            ) : (
                                <>Reject</>
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
