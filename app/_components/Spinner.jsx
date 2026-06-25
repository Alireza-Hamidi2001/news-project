// app/loading.jsx
"use client";

import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function Loading() {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // کاهش تدریجی opacity برای افکت محو شدن
        const timer = setTimeout(() => {
            setOpacity(0.7);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center pt-20 h-64">
            <FaSpinner className="animate-spin w-12 h-12 text-gray-600 dark:text-gray-300 mx-auto mb-4" />
            <p className="text-[1.6rem] text-gray-500 dark:text-gray-400">
                Loading ...
            </p>
        </div>
    );
}
