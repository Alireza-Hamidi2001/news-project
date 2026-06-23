"use client";

import { useState, useEffect } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import { HiMiniCalendarDateRange } from "react-icons/hi2";

export default function TimeDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // هر دقیقه به‌روزرسانی

        return () => clearInterval(interval);
    }, []);

    // زمان با AM/PM (مثلاً ۰۲:۳۰ PM)
    const timeString = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    // تاریخ میلادی (مثلاً June 25, 2026)
    const dateString = currentTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="text-left flex flex-col justify-center items-center">
            {/* زمان در بالا و درشت‌تر */}
            <span className="flex items-center gap-2 text-[1.5rem] text-gray-800 dark:text-gray-200 font-bold leading-tight">
                <MdAccessTimeFilled />
                {timeString}
            </span>

            {/* تاریخ میلادی در پایین و کمرنگ‌تر */}
            <span className="flex items-center gap-1 text-[1rem] text-gray-500 dark:text-gray-400 leading-tight">
                <HiMiniCalendarDateRange />
                {dateString}
            </span>
        </div>
    );
}
