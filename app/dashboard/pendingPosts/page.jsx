"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    FaSpinner,
    FaCheck,
    FaTimes,
    FaUser,
    FaCalendarAlt,
    FaClock,
    FaImage,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";
import RejectModal from "@/app/_components/RejectModal";

export default function PendingPostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [rejectModal, setRejectModal] = useState({
        isOpen: false,
        postId: null,
        postTitle: "",
    });

    // دریافت پست‌های pending
    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const fetchPendingPosts = async () => {
        try {
            const res = await fetch("/api/news/pending");
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (error) {
            console.error("Error fetching pending posts:", error);
            toast.error("Failed to load pending posts");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (postId) => {
        if (!confirm("Are you sure you want to approve this post?")) return;

        setProcessing(postId);
        const toastId = toast.loading("Approving post...");

        try {
            const res = await fetch("/api/news/approve", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, action: "approve" }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to approve post");
            }

            toast.success("Post approved and published! 🎉", { id: toastId });
            setPosts(posts.filter((p) => p.id !== postId));
            router.refresh();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (postId, reason = "") => {
        setProcessing(postId);
        const toastId = toast.loading("Rejecting post...");

        try {
            const res = await fetch("/api/news/approve", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId,
                    action: "reject",
                    reason: reason || "No reason provided",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reject post");
            }

            toast.success("Post rejected.", { id: toastId });
            setPosts(posts.filter((p) => p.id !== postId));
            router.refresh();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setProcessing(null);
            setRejectModal({ isOpen: false, postId: null, postTitle: "" });
        }
    };

    const openRejectModal = (postId, postTitle) => {
        setRejectModal({
            isOpen: true,
            postId,
            postTitle,
        });
    };

    const closeRejectModal = () => {
        setRejectModal({
            isOpen: false,
            postId: null,
            postTitle: "",
        });
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin w-12 h-12 text-zinc-700 dark:text-zinc-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading pending posts...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <MdPending className="bg-yellow-100 p-2 dark:bg-yellow-900/30 rounded-lg w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                            <h1 className="postTitle font-comic">
                                Pending Posts
                            </h1>
                        </div>
                        <p className="subTitle">
                            Review and approve posts submitted by writers
                        </p>
                    </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <FaCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                        No pending posts
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        All posts have been reviewed. Great job! 🎉
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-6">
                                    {/* Cover Image */}
                                    <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700">
                                        {post.cover_image ? (
                                            <Image
                                                src={post.cover_image}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                sizes="192px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaImage className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-[1.6rem] font-bold text-gray-900 dark:text-white line-clamp-2">
                                                    {post.title}
                                                </h2>

                                                <div className="flex items-center gap-4 mt-2 text-[1.2rem] text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <FaUser className="w-3 h-3" />
                                                        {post.author
                                                            ?.full_name ||
                                                            "Unknown"}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaCalendarAlt className="w-3 h-3" />
                                                        {new Date(
                                                            post.created_at,
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            },
                                                        )}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaClock className="w-3 h-3" />
                                                        {new Date(
                                                            post.created_at,
                                                        ).toLocaleTimeString(
                                                            "en-US",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <span className="px-3 py-1 rounded-full text-[1.2rem] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                Pending Review
                                            </span>
                                        </div>

                                        {/* Summary */}
                                        {post.summary && (
                                            <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                                                {post.summary}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                onClick={() =>
                                                    handleApprove(post.id)
                                                }
                                                disabled={
                                                    processing === post.id
                                                }
                                                className="confirmBtn bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
                                            >
                                                {processing === post.id ? (
                                                    <FaSpinner className="animate-spin" />
                                                ) : (
                                                    <FaCheck />
                                                )}
                                                Approve & Publish
                                            </button>

                                            <button
                                                onClick={() =>
                                                    openRejectModal(
                                                        post.id,
                                                        post.title,
                                                    )
                                                }
                                                disabled={
                                                    processing === post.id
                                                }
                                                className="cancelBtn bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                                            >
                                                {processing === post.id ? (
                                                    <FaSpinner className="animate-spin" />
                                                ) : (
                                                    <FaTimes />
                                                )}
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            <RejectModal
                isOpen={rejectModal.isOpen}
                onClose={closeRejectModal}
                onConfirm={(reason) => handleReject(rejectModal.postId, reason)}
                postTitle={rejectModal.postTitle}
            />
        </div>
    );
}
