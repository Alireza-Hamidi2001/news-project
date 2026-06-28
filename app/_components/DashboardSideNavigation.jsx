"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import avatarDefault from "@/public/user.png";
import Image from "next/image";
import { useState, useEffect } from "react";

import { MdPending } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaEdit, FaLock } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoNewspaper } from "react-icons/io5";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

function DashboardSideNavigation({
    isWriter,
    isAdmin,
    user,
    pendingCount = 0,
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const avatar = user?.avatar_url || avatarDefault;

    // ✅ بررسی فعال بودن کاربر
    const isUserActive = user?.is_active !== false;

    // check is mobile size
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
                !target.closest(".menu-toggle-btn") &&
                !target.closest(".menu-close-tab")
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    // قفل کردن اسکرول وقتی منو باز است
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    // تابع بررسی فعال بودن لینک
    const isActiveLink = (href) => {
        if (href === "/dashboard" && pathname === "/dashboard") return true;
        if (href !== "/dashboard" && pathname.startsWith(href)) return true;
        return false;
    };

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // آیتم‌های منوی ادمین
    const adminMenuItems = [
        {
            href: "/dashboard/all-posts",
            icon: IoDocuments,
            label: "All posts",
        },
        {
            href: "/dashboard/user-management",
            icon: MdManageAccounts,
            label: "Users management",
        },
        {
            href: "/dashboard/new-author",
            icon: FaUserFriends,
            label: "New Author",
        },
        {
            href: "/dashboard/pending-posts",
            icon: MdPending,
            label: "Pending posts",
            badge: pendingCount > 0 ? pendingCount : null,
        },
        {
            href: "/dashboard/categories",
            icon: BiSolidCategoryAlt,
            label: "Categories",
        },
    ];

    // آیتم‌های منوی نویسنده
    const writerMenuItems = [
        {
            href: "/dashboard",
            icon: RiDashboardHorizontalFill,
            label: "Dashboard",
        },
        {
            href: "/dashboard/new-post",
            icon: IoNewspaper,
            label: "Create a post",
        },
        {
            href: "/dashboard/edit-profile",
            icon: FaEdit,
            label: "Edit profile",
        },
    ];

    // ✅ کامپوننت آیتم منو (با قفل برای کاربر غیرفعال)
    const MenuItem = ({ item, isAdmin = false }) => {
        const isActive = isActiveLink(item.href);
        const Icon = item.icon;

        // ✅ اگر کاربر غیرفعال است، آیتم را غیرفعال کن
        if (!isUserActive) {
            return (
                <li className="opacity-60 cursor-not-allowed">
                    <div
                        className={`
                            flex items-center justify-between
                            px-4 py-2.5 rounded-lg
                            text-gray-400 dark:text-gray-500
                            ${isMobile ? "text-[1.4rem]" : "text-[1.4rem]"}
                        `}
                    >
                        <span className="flex items-center gap-3">
                            <Icon
                                className={`${
                                    isMobile ? "text-[1.6rem]" : "text-[1.8rem]"
                                }`}
                            />
                            <span>{item.label}</span>
                        </span>
                        <FaLock className="w-4 h-4 text-gray-400" />
                    </div>
                    {/* ✅ پیام غیرفعال برای کاربر */}
                    {isAdmin && item.href === "/dashboard/User-management" && (
                        <p className="text-xs text-red-500 mt-1 px-4">
                            ⚠️ Account deactivated. Contact admin.
                        </p>
                    )}
                </li>
            );
        }

        // ✅ اگر کاربر فعال است، آیتم قابل کلیک باشد
        return (
            <li>
                <Link
                    href={item.href}
                    onClick={() => {
                        if (isMobile) {
                            setIsMobileMenuOpen(false);
                        }
                    }}
                    className={`
                        flex items-center justify-between
                        px-4 py-2.5 rounded-lg
                        transition-all duration-200
                        ${
                            isActive
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500"
                                : "text-gray-700 dark:text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400"
                        }
                        ${isMobile ? "text-[1.4rem]" : "text-[1.4rem]"}
                    `}
                >
                    <span className="flex items-center gap-3">
                        <Icon
                            className={`${
                                isMobile ? "text-[1.6rem]" : "text-[1.8rem]"
                            }`}
                        />
                        <span>{item.label}</span>
                    </span>
                    {item.badge && (
                        <span className="bg-red-500 text-white text-[1.2rem] font-bold px-2 py-1 rounded-full min-w-[20px] text-center animate-pulse">
                            {item.badge}
                        </span>
                    )}
                </Link>
            </li>
        );
    };

    return (
        <>
            {/* دکمه تاگل منو - فقط در موبایل - سمت چپ */}
            {isMobile && !isMobileMenuOpen && (
                <button
                    onClick={toggleMenu}
                    className="menu-toggle-btn fixed top-24 left-4 z-[60]
                             bg-amber-200 dark:bg-zinc-600 
                             border border-gray-300 dark:border-gray-700 
                             rounded-lg p-2.5
                             shadow-lg hover:shadow-xl
                             transition-all duration-300
                             flex items-center justify-center
                             hover:bg-amber-100 dark:hover:bg-zinc-800"
                    aria-label="باز کردن منو"
                >
                    <FaChevronRight className="w-7 h-7 text-gray-700 dark:text-gray-300" />
                </button>
            )}

            {/* زائده دکمه بستن - فقط در موبایل وقتی منو باز است */}
            {isMobile && isMobileMenuOpen && (
                <button
                    onClick={toggleMenu}
                    className="menu-close-tab fixed top-24 z-[60]
                             bg-amber-50 dark:bg-zinc-950 
                             border border-l-0 border-gray-300 dark:border-gray-700 
                             rounded-r-lg p-2.5
                             shadow-lg hover:shadow-xl
                             transition-all duration-300
                             flex items-center justify-center
                             hover:bg-amber-100 dark:hover:bg-zinc-800"
                    style={{
                        left: "calc(18rem)", // عرض منو (w-72 = 18rem)
                    }}
                    aria-label="بستن منو"
                >
                    <FaChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
            )}

            {/* اوورلی تیره و مات برای موبایل */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <nav
                className={`
                    bg-amber-50 dark:bg-zinc-950 
                    border-r border-gray-300 dark:border-gray-700 
                    p-6 h-full overflow-y-auto
                    transition-all duration-300 ease-in-out
                    ${
                        isMobile
                            ? `fixed top-0 left-0 z-50 
                               w-72 h-screen
                               transform ${
                                   isMobileMenuOpen
                                       ? "translate-x-0"
                                       : "-translate-x-full"
                               }
                               shadow-2xl`
                            : "md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-[25rem] md:fixed md:left-0"
                    }
                `}
            >
                {/* ✅ اگر کاربر غیرفعال است، هشدار نمایش داده شود */}
                {!isUserActive && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                            <FaLock className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                Account Deactivated
                            </span>
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Your account has been deactivated. Please contact
                            admin.
                        </p>
                    </div>
                )}

                {/* هدر منو با آواتار و دکمه بستن (فقط موبایل) */}
                {isMobile && (
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
                        <div className="flex flex-col justify-center items-center gap-3 mx-auto">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden">
                                <Image
                                    fill
                                    src={avatar}
                                    alt="user avatar"
                                    className="object-cover object-top"
                                />
                            </div>
                            <div>
                                <h3 className="mainText text-[1.6rem] font-semibold">
                                    {user?.full_name || "User"}
                                </h3>
                                <p className="text-[1.4rem] text-gray-600 dark:text-gray-400">
                                    {isAdmin ? "Admin" : "Author"}
                                    {!isUserActive && " 🔒"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* آواتار بزرگ - فقط در دسکتاپ */}
                {!isMobile && (
                    <>
                        <div className="mb-8 mx-auto relative w-[10rem] h-[10rem] rounded-full">
                            <Image
                                fill
                                src={avatar}
                                alt="user avatar"
                                className="object-cover object-top rounded-full"
                            />
                        </div>
                        <div className="mb-8 text-center">
                            <h1 className="mainText">
                                {user?.full_name || "User"}
                            </h1>
                            <p className="mainText text-[1.2rem] text-gray-800 dark:text-gray-200">
                                {isAdmin ? "Admin Panel" : "Author Panel"}
                                {!isUserActive && " 🔒 (Inactive)"}
                            </p>
                        </div>
                    </>
                )}

                {/* Writer Menu - با قفل برای کاربر غیرفعال */}
                {(isAdmin || isWriter) && (
                    <ul className="mainText">
                        {writerMenuItems.map((item) => (
                            <MenuItem
                                key={item.href}
                                item={item}
                            />
                        ))}
                    </ul>
                )}

                {/* Admin Menu - با قفل برای کاربر غیرفعال */}
                <div className="space-y-2">
                    {isAdmin && (
                        <ul className="mainText text-[1.4rem]">
                            {adminMenuItems.map((item) => (
                                <MenuItem
                                    key={item.href}
                                    item={item}
                                    isAdmin={true}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                {/* Logout - همیشه فعال */}
                {/* <div
                    className={`${
                        isMobile
                            ? "mt-8 pt-4 border-t border-gray-300 dark:border-gray-700"
                            : "absolute bottom-6"
                    } max-w-full`}
                >
                    <LogoutButton variant="sidebar" />
                </div> */}
            </nav>
        </>
    );
}

export default DashboardSideNavigation;
