"use client";

import { FaArrowLeft } from "react-icons/fa";

export default function GoBackButton() {
    return (
        <button
            onClick={() => window.history.back()}
            className="cancelBtn bg-gray-300 dark:bg-gray-700"
        >
            <FaArrowLeft className="w-4 h-4" />
            Go Back
        </button>
    );
}
