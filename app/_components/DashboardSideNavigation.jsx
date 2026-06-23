import Link from "next/link";
import LogoutButton from "./LogoutButton";
import avatarDefault from "@/public/user.png";
import Image from "next/image";

import { TfiComments } from "react-icons/tfi";
import { FaEdit } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { BsFillSignpost2Fill } from "react-icons/bs";





function DashboardSideNavigation({ isWriter, isAdmin, user }) {
    const avatar = user.avatar_url || avatarDefault;
    return (
        <>
            {/* Sidebar */}
            <aside className="bg-amber-50 dark:bg-emerald-950 border-r border-gray-300 dark:border-gray-700 p-6 relative">
                <div className="mb-8 mx-auto relative w-[13rem] h-[13rem]">
                    <Image
                        fill
                        src={avatar}
                        alt="user avatar"
                        className="object-top"
                    />
                </div>
                <div className="mb-8 text-center">
                    <h1 className="mainText">{user.full_name}</h1>
                    <p className="mainText text-[1.2rem] text-gray-800 dark:text-gray-200">
                        {isAdmin ? "Admin Panel" : "Author Panel"}
                    </p>
                </div>

                {/* Admin Menu */}
                {isAdmin && (
                    <ul className="space-y-2 mainText text-[1.4rem]">
                        <li>
                            <Link
                                href="/dashboard/writers"
                                className="menuList flex items-center gap-2"
                            >
                                <FaUserFriends />
                                New Author
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/news"
                                className="menuList flex items-center gap-2" 
                            >
                                <FaEdit />
                                Edit profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/comments"
                                className="menuList flex items-center gap-2"
                            >
                                <TfiComments />
                                Comments
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/categories"
                                className="menuList"
                            >
                                Categories
                            </Link>
                        </li>
                    </ul>
                )}

                {/* Writer Menu */}
                {(isAdmin || isWriter) && (
                    <ul className="space-y-2 mt-4 mainText text-[1.4rem]">
                        <li>
                            <Link
                                href="/dashboard/new-post"
                                className="menuList flex items-center gap-2"
                            >
                                <BsFillSignpost2Fill />
                                New Post
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                href="/dashboard/my-posts"
                                className="menuList"
                            >
                                My Posts
                            </Link>
                        </li> */}
                    </ul>
                )}

                {/* Logout - always at bottom */}
                <div className="absolute bottom-6 max-w-full">
                    <LogoutButton variant="sidebar" />
                </div>
            </aside>
        </>
    );
}

export default DashboardSideNavigation;
