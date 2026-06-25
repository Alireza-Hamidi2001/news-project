// lib/utils/toast.js
import toast from "react-hot-toast";

export const showToast = {
    success: (message) => {
        toast.success(message, {
            duration: 3000,
            style: {
                background: "#e1ffdb",
                color: "#00a572",
            },
        });
    },

    error: (message) => {
        toast.error(message, {
            duration: 4000,
            style: {
                background: "#ffedeb",
                color: "#ea2901",
            },
        });
    },

    loading: (message) => {
        return toast.loading(message, {
            style: {
                background: "#95cadb",
                color: "#1d2951",
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
