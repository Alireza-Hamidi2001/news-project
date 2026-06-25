// app/dashboard/page.jsx
import { getCurrentUser } from "@/lib/auth/auth";
import {
    FaEnvelope,
    FaUserTag,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle,
} from "react-icons/fa";
import { FaPenFancy } from "react-icons/fa6";

function formatDate(dateString) {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getRoleLabel(role) {
    const roles = {
        admin: "Admin",
        writer: "Writer",
        user: "User",
    };
    return roles[role] || role;
}

function getRoleColor(role) {
    const colors = {
        admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
        writer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        user: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    };
    return (
        colors[role] ||
        "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400 border-gray-200 dark:border-gray-700"
    );
}

async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">
                    User not found
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Please log in again
                </p>
            </div>
        );
    }

    const infoItems = [
        {
            icon: FaEnvelope,
            label: "Email",
            value: user.email,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800",
            glow: "text-blue-500",
        },
        {
            icon: FaUserTag,
            label: "Role",
            value: getRoleLabel(user.role),
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            border: "border-purple-200 dark:border-purple-800",
            glow: "text-purple-500",
            badge: true,
        },
        {
            icon: FaCalendarAlt,
            label: "Member Since",
            value: formatDate(user.created_at),
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            border: "border-emerald-200 dark:border-emerald-800",
            glow: "text-emerald-500",
        },
        {
            icon: FaClock,
            label: "Last Login",
            value: formatDate(user.last_login),
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            border: "border-amber-200 dark:border-amber-800",
            glow: "text-amber-500",
        },
        {
            icon: user.is_active ? FaCheckCircle : FaTimesCircle,
            label: "Status",
            value: user.is_active ? "Active" : "Inactive",
            color: user.is_active ? "text-green-500" : "text-red-500",
            bg: user.is_active
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-red-50 dark:bg-red-900/20",
            border: user.is_active
                ? "border-green-200 dark:border-green-800"
                : "border-red-200 dark:border-red-800",
            glow: user.is_active ? "text-green-500" : "text-red-500",
        },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="bg-linear-to-br p-2 rounded-lg w-12 h-12 flex items-center justify-center">
                                <FaUserTag className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Dashboard
                            </h1>
                        </div>
                        <p className="text-[1.4rem] text-gray-500 dark:text-gray-400 mt-1">
                            Welcome back! Here&apos;s your profile overview.
                        </p>
                    </div>
                </div>
                <div className="h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mt-4"></div>
            </div>

            {/* Info Cards - One Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {infoItems.map((item, index) => (
                    <div
                        key={index}
                        className={`group relative overflow-hidden rounded-xl border ${item.border} ${item.bg} p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 animate-slideUp`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex flex-col items-start gap-2">
                            {/* Icon with pulse animation */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div
                                        className={`absolute inset-0 ${item.glow} opacity-20 rounded-full blur-md group-hover:opacity-40 transition-opacity duration-300`}
                                    ></div>
                                    <item.icon
                                        className={`w-7 h-7 ${item.color} relative z-10`}
                                    />
                                </div>

                                {/* Label */}
                                <p
                                    className={`text-[1.4rem] ${item.color} font-medium uppercase tracking-wider`}
                                >
                                    {item.label}
                                </p>
                            </div>

                            {/* Value */}
                            <div className="w-full">
                                {item.badge ? (
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-[1.2rem] font-semibold border ${getRoleColor(
                                            user.role,
                                        )}`}
                                    >
                                        {item.value}
                                    </span>
                                ) : (
                                    <p className="text-[1.2rem] font-semibold text-gray-900 dark:text-white break-all line-clamp-2">
                                        {item.value}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div
                            className={`absolute inset-0 ${item.glow} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Bio Section - Full Width */}
            {user.bio && (
                <div
                    className="mt-6 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md animate-slideUp"
                    style={{ animationDelay: "250ms" }}
                >
                    <div className="flex items-start gap-3">
                        <FaInfoCircle className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[1.5rem] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Bio
                            </p>
                            <p className="text-[1.2rem] text-gray-900 dark:text-white mt-1">
                                {user.bio}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Created By Info */}
            {user.created_by && (
                <div
                    className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 transition-all duration-300 hover:shadow-md animate-slideUp"
                    style={{ animationDelay: "300ms" }}
                >
                    <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <FaInfoCircle className="w-4 h-4" />
                        <span>
                            Account created by: <strong>Admin</strong>
                        </span>
                    </p>
                </div>
            )}

            {/* Info Box */}
            <div
                className="mt-6 p-4 bg-linear-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 transition-all duration-300 hover:shadow-md animate-slideUp"
                style={{ animationDelay: "350ms" }}
            >
                <p className="flex items-center gap-2 text-[1.2rem] text-yellow-700 dark:text-yellow-300">
                    <FaPenFancy className="w-5 h-5 shrink-0" />
                    <span>
                        You can edit your profile information from the{" "}
                        <strong className="hover:underline">
                            Edit Profile
                        </strong>{" "}
                        page.
                    </span>
                </p>
            </div>
        </div>
    );
}

export default DashboardPage;
