"use client";

import { useState, useEffect } from "react";
import {
    FaNewspaper,
    FaFutbol,
    FaLandmark,
    FaChartLine,
    FaLaptop,
    FaBook,
    FaFilm,
    FaHouse,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa6";

const navItems = [
    { id: "home", label: "Home", icon: FaHouse },
    { id: "sport", label: "Sport", icon: FaFutbol },
    { id: "policy", label: "Policy", icon: FaLandmark },
    { id: "economy", label: "Economy", icon: FaChartLine },
    { id: "tech", label: "Tech", icon: FaLaptop },
    { id: "history", label: "History", icon: FaBook },
    { id: "cinema", label: "Cinema", icon: FaFilm },
];

function SideNavigation() {
    const [activeItem, setActiveItem] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // بستن منو هنگام کلیک خارج از آن (اختیاری)
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            if (isMobileMenuOpen && !target.closest("nav")) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* دکمه منوی موبایل - نسخه جدید با آیکون خارج از منو */}
            {isMobile && (
                <button
                    onClick={toggleMenu}
                    className={`
                        fixed top-20 z-50 
                        bg-amber-50 dark:bg-zinc-900
                        w-10 h-10 
                        flex items-center justify-center
                        rounded-r-lg shadow-lg 
                        border border-l-0 border-gray-200 dark:border-gray-700
                        transition-all duration-300 ease-in-out
                        hover:bg-amber-100 dark:hover:bg-zinc-800
                        ${isMobileMenuOpen ? "left-72" : "left-0"}
                    `}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <FaChevronLeft className="text-gray-700 dark:text-gray-300 text-lg" />
                    ) : (
                        <FaChevronRight className="text-gray-700 dark:text-gray-300 text-lg" />
                    )}
                </button>
            )}

            {/* منوی ناوبری */}
            <nav
                className={`
                    fixed left-0 top-20 
                    ${isMobile ? "w-72" : "w-64"} 
                    h-[calc(100vh-5rem)] 
                    border-r border-gray-300 dark:border-gray-700
                    bg-amber-50 dark:bg-zinc-900 
                    shadow-md overflow-hidden 
                    transition-all duration-300 ease-in-out
                    ${
                        isMobile
                            ? isMobileMenuOpen
                                ? "translate-x-0 z-50"
                                : "-translate-x-full z-40"
                            : "translate-x-0 z-40"
                    }
                `}
            >
                <ul className="py-6 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        setActiveItem(item.id);
                                        // بستن منو در موبایل بعد از انتخاب آیتم
                                        if (isMobile) {
                                            setIsMobileMenuOpen(false);
                                        }
                                    }}
                                    className={`py-3 px-3 w-full flex items-center gap-3 transition-all duration-200 text-[1.2rem] font-normal hover:text-emerald-500 ${
                                        isActive
                                            ? "border-l-3 border-emerald-500 text-emerald-600"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-500 hover:cursor-pointer"
                                    }`}
                                >
                                    <Icon
                                        className={`text-lg ${
                                            isActive
                                                ? "text-emerald-600"
                                                : "text-gray-700 dark:text-gray-300"
                                        }`}
                                    />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* بخش پایینی سایدبار */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-sm text-center">
                        <span className="font-caveat text-gray-700 dark:text-gray-300 text-[1.6rem] block mt-0.5">
                            Alireza Hamidi
                        </span>
                        <span className="block text-gray-400 text-[1.2rem]">
                            &copy; All rights reserved
                        </span>
                    </div>
                </div>
            </nav>

            {/* اوورلی برای موبایل */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}

export default SideNavigation;
