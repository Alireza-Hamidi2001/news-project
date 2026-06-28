// app/_components/AllPostsClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    FaSpinner,
    FaTrash,
    FaImage,
    FaUser,
    FaCalendarAlt,
    FaClock,
    FaEye,
    FaEdit,
    FaNewspaper,
} from "react-icons/fa";
import { MdPublishedWithChanges } from "react-icons/md";

export default function AllPostsClient({ initialPosts = [] }) {
    const router = useRouter();
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        postId: null,
        postTitle: "",
    });

    const handleDelete = async (postId) => {
        setDeleting(postId);
        const toastId = toast.loading("Deleting post...");

        try {
            const res = await fetch(`/api/news/${postId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete post");
            }

            toast.success("Post deleted successfully!", { id: toastId });
            setPosts(posts.filter((p) => p.id !== postId));
            router.refresh();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setDeleting(null);
            setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
        }
    };

    const openDeleteModal = (postId, postTitle) => {
        setDeleteModal({
            isOpen: true,
            postId,
            postTitle,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            postId: null,
            postTitle: "",
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            published:
                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
            archived:
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        };
        return badges[status] || badges.draft;
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin w-12 h-12 text-zinc-700 dark:text-zinc-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading posts...
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
                            <MdPublishedWithChanges className="bg-blue-100 p-2 dark:bg-blue-900/30 rounded-lg w-16 h-16 text-blue-600 dark:text-blue-400" />
                            <div>
                                <h1 className="postTitle font-comic">
                                    All Posts
                                </h1>
                                <p className="subTitle">
                                    Manage all published posts
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <FaNewspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-[3rem] font-bold text-gray-700 dark:text-gray-300">
                        No posts found
                    </h2>
                    <p className="text-[1.8rem] text-gray-500 dark:text-gray-400">
                        There are no published posts yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                                {/* Cover Image */}
                                <div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700">
                                    {post.cover_image ? (
                                        <Image
                                            src={post.cover_image}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                            sizes="200px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaImage className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Post Info */}
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                                    {post.title}
                                                </h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                    {post.summary ||
                                                        "No summary"}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(
                                                    post.status,
                                                )}`}
                                            >
                                                {post.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <FaUser className="w-3 h-3" />
                                                {post.author?.full_name ||
                                                    "Unknown"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt className="w-3 h-3" />
                                                {new Date(
                                                    post.created_at,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            {post.published_at && (
                                                <span className="flex items-center gap-1">
                                                    <FaClock className="w-3 h-3" />
                                                    Published:{" "}
                                                    {new Date(
                                                        post.published_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <FaEye className="w-3 h-3" />
                                                {post.views || 0} views
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                {post.section_type ||
                                                    "Uncategorized"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/edit-post/${post.id}`,
                                                )
                                            }
                                            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200 flex items-center gap-2"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(
                                                    post.id,
                                                    post.title,
                                                )
                                            }
                                            disabled={deleting === post.id}
                                            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deleting === post.id ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaTrash />
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="bg-white dark:bg-zinc-900 rounded-sm shadow-2xl max-w-md w-[75vw] sm:w-[50vw] md:w-[35vw] p-12 border border-gray-200 dark:border-gray-700 animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <FaTrash className="w-12 h-12 text-red-600 dark:text-red-400" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Delete Post
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    &quot;{deleteModal.postTitle}&quot;
                                </span>
                                ? This action cannot be undone.
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        handleDelete(deleteModal.postId)
                                    }
                                    disabled={deleting === deleteModal.postId}
                                    className="flex-1 px-4 py-2.5 text-white text-sm font-medium rounded-sm transition-all duration-200 bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleting === deleteModal.postId ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaTrash />
                                    )}
                                    Delete
                                </button>
                                <button
                                    onClick={closeDeleteModal}
                                    className="flex-1 px-4 py-2.5 text-gray-700 dark:text-white text-sm font-medium rounded-sm transition-all duration-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
