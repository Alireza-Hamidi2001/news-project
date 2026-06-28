// app/_components/Header.jsx
import Image from "next/image";
import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";
import logoImage_light from "@/public/logos/alireza3.png";
import logoImage_dark from "@/public/logos/alireza4.png";
import TimeDisplay from "./TimeDisplay";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/lib/auth/auth";
import { LuLogIn } from "react-icons/lu";
import { BiTrash } from "react-icons/bi";
import DeleteAccountButton from "./DeleteAccountButton";

async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="fixed top-0 left-0 right-0 h-20 z-50 bg-amber-50 dark:bg-zinc-950 shadow border-b border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <div className="flex justify-between items-center h-full px-8 max-w-7xl mx-auto">
                <div className="flex gap-4 items-center">
                    <ThemeToggle />
                    <FaMagnifyingGlass className="w-6 h-6 text-zinc-800 dark:text-amber-50 cursor-pointer transition-colors duration-200 hover:text-emerald-500 dark:hover:text-emerald-400" />
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="block relative"
                            >
                                <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-transform duration-200 cursor-pointer overflow-hidden">
                                    {user.avatar_url ? (
                                        <Image
                                            src={user.avatar_url}
                                            alt={user.full_name || "User"}
                                            fill
                                            className="object-cover object-top rounded-full"
                                            sizes="48px"
                                        />
                                    ) : (
                                        user.full_name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"
                                    )}
                                </div>
                                <span className="absolute -bottom-1 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white dark:border-zinc-950"></span>
                            </Link>
                            <LogoutButton variant="icon" />
                            <DeleteAccountButton variant="icon" />
                        </>
                    ) : (
                        <Link href="/login">
                            <LuLogIn className="w-9 h-9 text-zinc-800 dark:text-amber-50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200" />
                        </Link>
                    )}
                </div>

                {/* Logo */}
                <Link
                    href="/news"
                    className="relative w-48 h-14"
                >
                    <Image
                        fill
                        alt="logo"
                        src={logoImage_light}
                        className="object-contain dark:hidden"
                        priority
                    />
                    <Image
                        fill
                        alt="logo"
                        src={logoImage_dark}
                        className="object-contain hidden dark:block"
                        priority
                    />
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <TimeDisplay />
                </div>
            </div>
        </header>
    );
}

export default Header;
