// sidenavigation.jsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
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
    { id: "home", label: "Home", icon: FaHouse, href: "/" },
    { id: "sport", label: "Sport", icon: FaFutbol, href: "/category/sport" },
    {
        id: "policy",
        label: "Policy",
        icon: FaLandmark,
        href: "/category/policy",
    },
    {
        id: "economy",
        label: "Economy",
        icon: FaChartLine,
        href: "/category/economy",
    },
    { id: "tech", label: "Tech", icon: FaLaptop, href: "/category/tech" },
    {
        id: "history",
        label: "History",
        icon: FaBook,
        href: "/category/history",
    },
    { id: "cinema", label: "Cinema", icon: FaFilm, href: "/category/cinema" },
];

function SideNavigation() {
    const pathname = usePathname();
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

    // بستن منو هنگام کلیک خارج از آن
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            if (
                isMobileMenuOpen &&
                !target.closest("nav") &&
                !target.closest("button")
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    // ✅ تابع بررسی فعال بودن لینک
    const isActiveLink = (href) => {
        if (href === "/" && pathname === "/") return true;
        if (href !== "/" && pathname.startsWith(href)) return true;
        return false;
    };

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* دکمه منوی موبایل */}
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
                    bg-amber-50 dark:bg-zinc-950 
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
                <ul className="p-6 text-[1.4rem]">
                    {navItems.map((item) => {
                        const isActive = isActiveLink(item.href);
                        const Icon = item.icon;

                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    onClick={() => {
                                        if (isMobile) {
                                            setIsMobileMenuOpen(false);
                                        }
                                    }}
                                    className={`
                                        py-3 px-3 w-full flex items-center gap-3 
                                        transition-all duration-200 
                                        text-[1.2rem] font-normal 
                                        rounded-lg
                                        ${
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400"
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`text-lg ${
                                            isActive
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-gray-700 dark:text-gray-300"
                                        }`}
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* بخش پایینی سایدبار */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
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
