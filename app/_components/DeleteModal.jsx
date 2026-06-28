// app/_components/DeleteModal.jsx
import { FaExclamationTriangle, FaSpinner, FaTimes } from "react-icons/fa";

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    loading,
    confirmText,
    setConfirmText,
}) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - z-index بالا */}
            <div
                className="fixed z-40 inset-0 bg-black/50 w-screen h-screen backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            >
                {/* Modal - z-index بالاتر */}
                <div className="fixed z-50 inset-0 flex items-center justify-center animate-scaleIn">
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
                            <div className="w-36 h-36 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                                <FaExclamationTriangle className="w-15 h-15 text-red-500 dark:text-red-400" />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="text-center mb-6 mainText">
                            <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">
                                Delete Account
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 mt-1">
                                This action is{" "}
                                <span className="text-red-500 font-bold">
                                    permanent
                                </span>{" "}
                                and cannot be undone.
                            </p>
                            <div className="text-left mt-4 text-[1.4rem] text-gray-500 dark:text-gray-400 space-y-1">
                                <p>• All your posts will be removed</p>
                                <p>• Your comments will be deleted</p>
                                <p>• Your profile data will be erased</p>
                            </div>
                        </div>

                        {/* Confirm Input */}
                        <div className="mb-4 text-left">
                            <label className="text-[1.2rem] font-medium text-gray-700 dark:text-gray-300">
                                Type{" "}
                                <span className="text-red-500 text-[1.4rem] font-bold">
                                    delete my account
                                </span>{" "}
                                to confirm
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="text-[1.2rem] w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 mt-1"
                                placeholder='Type "delete my account"'
                                disabled={loading}
                            />
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
                                onClick={onConfirm}
                                disabled={
                                    loading ||
                                    confirmText !== "delete my account"
                                }
                                className="confirmBtn bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>Delete</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
