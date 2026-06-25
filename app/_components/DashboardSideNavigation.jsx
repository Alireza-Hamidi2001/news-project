import Link from "next/link";
import LogoutButton from "./LogoutButton";
import avatarDefault from "@/public/user.png";
import Image from "next/image";

import { GoCommentDiscussion } from "react-icons/go";
import { FaEdit } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoNewspaper } from "react-icons/io5";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { supabaseAdmin } from "@/lib/supabase";

async function DashboardSideNavigation({ isWriter, isAdmin, user }) {
    const avatar = user.avatar_url || avatarDefault;
    const pendingCount = await getPendingCount();

    async function getPendingCount() {
        const { count, error } = await supabaseAdmin
            .from("news")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");

        if (error) return 0;
        return count || 0;
    }

    return (
        <>
            {/* Sidebar */}
            <aside className="bg-amber-50 dark:bg-zinc-950 border-r border-gray-300 dark:border-gray-700 p-6 relative">
                <div className="mb-8 mx-auto relative w-[10rem] h-[10rem] rounded-full">
                    <Image
                        fill
                        src={avatar}
                        alt="user avatar"
                        className="object-cover object-top rounded-full"
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
                                href="/dashboard/newAuthor"
                                className="menuList flex items-center gap-2"
                            >
                                <FaUserFriends />
                                New Author
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/pendingPosts"
                                className="menuList flex items-center justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <GoCommentDiscussion />
                                    Pending posts
                                </span>
                                {pendingCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/categories"
                                className="menuList flex items-center gap-2"
                            >
                                <BiSolidCategoryAlt />
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
                                href="/dashboard/newPost"
                                className="menuList flex items-center gap-2"
                            >
                                <IoNewspaper />
                                New Post
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/editProfile"
                                className="menuList flex items-center gap-2"
                            >
                                <FaEdit />
                                Edit profile
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
