// app/_components/DeleteAccountButton.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import DeleteModal from "./DeleteModal";

export default function DeleteAccountButton({ variant = "sidebar" }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setConfirmText("");
    };

    const handleDelete = async () => {
        if (confirmText !== "delete my account") {
            toast.error('Please type "delete my account" to confirm');
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Deleting account...");

        try {
            const res = await fetch("/api/auth/delete-account", {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete account");
            }

            toast.success("Account deleted successfully. Goodbye!", {
                id: toastId,
            });

            // ریدایرکت به صفحه خروج
            router.push("/login");
            router.refresh();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="p-2 sm:px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-sm transition-all duration-200 hover:scale-105 flex items-center gap-2 text-[1.2rem] cursor-pointer font-medium"
            >
                <FaTrash className="w-5 h-5 sm:w-7 sm:h-7" />
                <p className="hidden sm:block">Delete Account</p>
            </button>

            <DeleteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDelete}
                loading={loading}
                confirmText={confirmText}
                setConfirmText={setConfirmText}
            />
        </>
    );
}
