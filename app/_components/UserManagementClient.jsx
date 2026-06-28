// app/_components/UserManagementClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    FaSpinner,
    FaUser,
    FaEnvelope,
    FaUserTag,
    FaCalendarAlt,
    FaClock,
    FaTrash,
    FaSearch,
    FaUserCheck,
    FaUserTimes,
} from "react-icons/fa";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";

// ✅ ایمپورت مودال‌های جداگانه
import ToggleStatusModal from "./ToggleStatusModal";
import DeleteUserModal from "./DeleteUserModal";

export default function UserManagementClient({
    initialUsers = [],
    currentUserId,
}) {
    const router = useRouter();
    const [users, setUsers] = useState(initialUsers);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [processing, setProcessing] = useState(null);

    // ✅ حالت‌های مودال
    const [toggleModal, setToggleModal] = useState({
        isOpen: false,
        userId: null,
        userName: "",
        currentStatus: false,
    });

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null,
        userName: "",
    });

    // ✅ فیلتر کردن کاربران
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === "all" || user.role === filterRole;

        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && user.is_active === true) ||
            (filterStatus === "inactive" && user.is_active === false);

        return matchesSearch && matchesRole && matchesStatus;
    });

    // ✅ تغییر وضعیت کاربر
    const handleToggleStatus = async (userId, newStatus) => {
        setProcessing(userId);
        const toastId = toast.loading("Updating user status...");

        try {
            const res = await fetch(`/api/users/${userId}/toggle-status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: newStatus }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update user status");
            }

            setUsers(
                users.map((user) =>
                    user.id === userId
                        ? { ...user, is_active: newStatus }
                        : user,
                ),
            );

            toast.success(
                newStatus
                    ? "User activated successfully!"
                    : "User deactivated successfully!",
                { id: toastId },
            );

            router.refresh();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setProcessing(null);
            setToggleModal({
                isOpen: false,
                userId: null,
                userName: "",
                currentStatus: false,
            });
        }
    };

    // ✅ حذف کاربر
    const handleDeleteUser = async (userId) => {
        setProcessing(userId);
        const toastId = toast.loading("Deleting user...");

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete user");
            }

            setUsers(users.filter((user) => user.id !== userId));

            toast.success("User deleted successfully!", { id: toastId });
            router.refresh();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setProcessing(null);
            setDeleteModal({ isOpen: false, userId: null, userName: "" });
        }
    };

    // ✅ دریافت نقش با رنگ
    const getRoleBadge = (role) => {
        const roles = {
            admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            writer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            user: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        };
        return roles[role] || roles.user;
    };

    // ✅ دریافت وضعیت با رنگ
    const getStatusBadge = (isActive) => {
        return isActive
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin w-12 h-12 text-zinc-700 dark:text-zinc-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div>
                        <div className="flex items-center gap-4">
                            <MdManageAccounts className="bg-purple-100 p-2 dark:bg-purple-900/30 rounded-lg w-16 h-16 text-purple-600 dark:text-purple-400" />
                            <div>
                                <h1 className="postTitle font-comic">
                                    User Management
                                </h1>
                                <p className="subTitle">
                                    Manage all users and their permissions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="text-[1.2rem] grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-[1.4rem]"
                            placeholder="Search by name or email..."
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white text-[1.4rem]"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="writer">Writer</option>
                        <option value="user">User</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white text-[1.4rem]"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <FaUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-[4rem] font-bold text-gray-700 dark:text-gray-300">
                        No users found
                    </h2>
                    <p className="text-[1.8rem] text-gray-500 dark:text-gray-400">
                        Try adjusting your filters or search terms.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[1.4rem] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-[1.4rem] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-[1.4rem] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-[1.4rem] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-[1.4rem] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-[1.4rem] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => {
                                    const isCurrentUser =
                                        user.id === currentUserId;
                                    const isProcessing = processing === user.id;

                                    return (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
                                        >
                                            {/* User Info */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-15 h-15 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-700">
                                                        {user.avatar_url ? (
                                                            <Image
                                                                src={
                                                                    user.avatar_url
                                                                }
                                                                alt={
                                                                    user.full_name
                                                                }
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FaUser className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-[1.2rem] font-medium text-gray-900 dark:text-white">
                                                            {user.full_name ||
                                                                "Unknown"}
                                                        </div>
                                                        {isCurrentUser && (
                                                            <span className="text-[1.2rem] text-purple-600 dark:text-purple-400 font-medium">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                                                    <span className="text-[1.2rem] text-gray-900 dark:text-white">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[1.2rem] font-medium ${getRoleBadge(
                                                        user.role,
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[1.2rem] font-medium ${getStatusBadge(
                                                        user.is_active,
                                                    )}`}
                                                >
                                                    {user.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            {/* Joined Date */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-[1.2rem] text-gray-500 dark:text-gray-400">
                                                    <FaCalendarAlt className="w-4 h-4" />
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Toggle Status Button */}
                                                    {!isCurrentUser && (
                                                        <button
                                                            onClick={() => {
                                                                setToggleModal({
                                                                    isOpen: true,
                                                                    userId: user.id,
                                                                    userName:
                                                                        user.full_name,
                                                                    currentStatus:
                                                                        user.is_active,
                                                                });
                                                            }}
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                                user.is_active
                                                                    ? "text-black hover:bg-black/20 dark:text-white dark:hover:bg-white/10"
                                                                    : "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20"
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                            title={
                                                                user.is_active
                                                                    ? "Deactivate"
                                                                    : "Activate"
                                                            }
                                                        >
                                                            {isProcessing ? (
                                                                <FaSpinner className="animate-spin w-5 h-5" />
                                                            ) : user.is_active ? (
                                                                <FaToggleOff className="w-8 h-8" />
                                                            ) : (
                                                                <FaToggleOn className="w-8 h-8" />
                                                            )}
                                                        </button>
                                                    )}

                                                    {/* Delete Button */}
                                                    {!isCurrentUser && (
                                                        <button
                                                            onClick={() => {
                                                                setDeleteModal({
                                                                    isOpen: true,
                                                                    userId: user.id,
                                                                    userName:
                                                                        user.full_name,
                                                                });
                                                            }}
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:text-red-400 dark:hover:bg-red-900/20"
                                                            title="Delete User"
                                                        >
                                                            <FaTrash className="w-8 h-8" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ✅ مودال تغییر وضعیت - کامپوننت جداگانه */}
            <ToggleStatusModal
                isOpen={toggleModal.isOpen}
                onClose={() =>
                    setToggleModal({
                        isOpen: false,
                        userId: null,
                        userName: "",
                        currentStatus: false,
                    })
                }
                onConfirm={() =>
                    handleToggleStatus(
                        toggleModal.userId,
                        !toggleModal.currentStatus,
                    )
                }
                userName={toggleModal.userName}
                currentStatus={toggleModal.currentStatus}
                isLoading={processing === toggleModal.userId}
            />

            {/* ✅ مودال حذف کاربر - کامپوننت جداگانه */}
            <DeleteUserModal
                isOpen={deleteModal.isOpen}
                onClose={() =>
                    setDeleteModal({
                        isOpen: false,
                        userId: null,
                        userName: "",
                    })
                }
                onConfirm={() => handleDeleteUser(deleteModal.userId)}
                userName={deleteModal.userName}
                isLoading={processing === deleteModal.userId}
            />
        </div>
    );
}
