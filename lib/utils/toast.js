// lib/utils/toast.js
import toast from "react-hot-toast";

export const showToast = {
    success: (message) => {
        toast.success(message, {
            duration: 3000,
            style: {
                background: "#22c55e",
                color: "#fff",
            },
        });
    },

    error: (message) => {
        toast.error(message, {
            duration: 4000,
            style: {
                background: "#ef4444",
                color: "#fff",
            },
        });
    },

    loading: (message) => {
        return toast.loading(message, {
            style: {
                background: "#3b82f6",
                color: "#fff",
            },
        });
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    custom: (message, options = {}) => {
        toast(message, {
            duration: 3000,
            ...options,
        });
    },
};
