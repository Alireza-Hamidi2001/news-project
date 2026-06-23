// app/loading.jsx
"use client";

import { useEffect, useState } from "react";

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
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-amber-50 dark:bg-zinc-900 transition-opacity duration-700"
            style={{ opacity }}
        >
            <div className="flex flex-col items-center gap-8">
                {/* لوگوی متحرک با افکت تایپ‌رایتر */}
                <div className="relative">
                    <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse">
                        News
                    </div>
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-pulse" />
                </div>

                {/* انیمیشن نقطه‌های خبری */}
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                                style={{
                                    animation: `bounce 1.4s ease-in-out ${
                                        i * 0.2
                                    }s infinite`,
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wider">
                        LOADING
                    </span>
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                                style={{
                                    animation: `bounce 1.4s ease-in-out ${
                                        i * 0.2 + 0.3
                                    }s infinite`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* خطوط متحرک خبری */}
                <div className="w-64 sm:w-80 md:w-96 overflow-hidden">
                    <div className="flex flex-col gap-2">
                        <div className="h-2 bg-gradient-to-r from-blue-600/20 via-purple-600/40 to-pink-600/20 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                        <div className="h-2 bg-gradient-to-r from-purple-600/20 via-pink-600/40 to-blue-600/20 rounded-full animate-[pulse_2s_ease-in-out_0.5s_infinite]" />
                        <div className="h-2 bg-gradient-to-r from-pink-600/20 via-blue-600/40 to-purple-600/20 rounded-full animate-[pulse_2s_ease-in-out_1s_infinite]" />
                    </div>
                </div>
            </div>

            {/* استایل‌های انیمیشن */}
            <style jsx>{`
                @keyframes bounce {
                    0%,
                    100% {
                        transform: scale(0.8);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
