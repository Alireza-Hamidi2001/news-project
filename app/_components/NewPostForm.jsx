// app/_components/NewPostForm.jsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaLightbulb } from "react-icons/fa6";
import {
    FaSpinner,
    FaSave,
    FaImage,
    FaTrash,
    FaCheck,
    FaNewspaper,
    FaTag,
    FaUser,
    FaClock,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function NewPostForm({ userRole, categories = [] }) {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [coverPreview, setCoverPreview] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isCoverChanged, setIsCoverChanged] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        summary: "",
        content: "",
        category_id: "",
        section_type: "others",
        status: "draft",
        is_featured: false,
    });
    const [errors, setErrors] = useState({});

    const isAdmin = userRole === "admin";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCoverClick = () => {
        fileInputRef.current?.click();
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setCoverPreview(event.target.result);
            setCoverFile(file);
            setIsCoverChanged(true);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveCover = () => {
        setCoverPreview(null);
        setCoverFile(null);
        setIsCoverChanged(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        }

        if (formData.content.length < 10) {
            newErrors.content = "Content must be at least 10 characters";
        }

        if (!formData.slug.trim()) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
                .replace(/\s+/g, "-");
            setFormData((prev) => ({ ...prev, slug }));
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Creating post...");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append(
                "slug",
                formData.slug ||
                    formData.title
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
                        .replace(/\s+/g, "-"),
            );
            formDataToSend.append("summary", formData.summary || "");
            formDataToSend.append("content", formData.content);
            formDataToSend.append("category_id", formData.category_id || "");
            formDataToSend.append("section_type", formData.section_type);
            formDataToSend.append(
                "is_featured",
                formData.is_featured ? "true" : "false",
            );
            formDataToSend.append("status", formData.status);

            if (coverFile) {
                formDataToSend.append("cover_image", coverFile);
            }

            const res = await fetch("/api/news", {
                method: "POST",
                body: formDataToSend,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create post");
            }

            // پیام مناسب بر اساس وضعیت و نقش
            if (data.status === "published") {
                toast.success("Post published successfully! 🎉", {
                    id: toastId,
                });
            } else if (data.status === "pending") {
                toast.success(
                    "Post submitted for review. Waiting for admin approval.",
                    {
                        id: toastId,
                        duration: 5000,
                    },
                );
            } else {
                toast.success("Post saved as draft.", {
                    id: toastId,
                });
            }

            // Reset form
            setFormData({
                title: "",
                slug: "",
                summary: "",
                content: "",
                category_id: "",
                section_type: "others",
                status: "draft",
                is_featured: false,
            });
            setCoverPreview(null);
            setCoverFile(null);
            setIsCoverChanged(false);

            // هدایت بر اساس نقش و وضعیت
            let redirectPath = "/dashboard/my-posts";
            if (data.status === "pending" && userRole === "writer") {
                redirectPath = "/dashboard";
            }

            setTimeout(() => {
                router.push(redirectPath);
                router.refresh();
            }, 1500);
        } catch (error) {
            toast.error(error.message || "Failed to create post", {
                id: toastId,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div>
                        <div className="flex items-center gap-4">
                            <FaNewspaper className="bg-blue-100 p-2 dark:bg-blue-900/30 rounded-lg w-18 h-18 text-blue-600 dark:text-blue-400" />
                            <h1 className="postTitle font-comic">
                                Create New Post
                            </h1>
                        </div>
                        <p className="subTitle flex items-center gap-2">
                            Write and publish a new article
                            {!isAdmin && (
                                <span className="text-yellow-600 dark:text-yellow-400 text-[1.2rem] flex items-center gap-1">
                                    <FaLightbulb className="w-8 h-8" />{" "}
                                    (Requires admin approval)
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 md:p-8">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Cover Image */}
                        <div className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                            <div className="relative">
                                <div className="relative w-48 h-32 bg-gray-200 dark:bg-zinc-700 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                    {coverPreview ? (
                                        <Image
                                            src={coverPreview}
                                            alt="Cover"
                                            fill
                                            className="object-cover"
                                            sizes="192px"
                                        />
                                    ) : (
                                        <FaImage className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCoverClick}
                                    className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                >
                                    <FaImage className="w-4 h-4" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[1.4rem] font-semibold text-gray-900 dark:text-white">
                                    Cover Image
                                </h3>
                                <p className="text-[1.2rem] text-gray-500 dark:text-gray-400">
                                    Upload a cover image for your post
                                    (recommended: 1200x630)
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={handleCoverClick}
                                        className="px-3 py-1.5 text-[1.2rem] bg-blue-500 hover:bg-blue-600 text-white rounded transition-all duration-200"
                                    >
                                        Upload
                                    </button>
                                    {coverPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveCover}
                                            className="px-3 py-1.5 text-[1.2rem] bg-red-500 hover:bg-red-600 text-white rounded transition-all duration-200 flex items-center gap-1"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {isCoverChanged && (
                                    <p className="text-[1.2rem] text-emerald-500 mt-1">
                                        <FaCheck className="inline w-3 h-3 mr-1" />
                                        Cover image selected
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="label">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaNewspaper className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                        errors.title
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                    placeholder="Enter post title"
                                    disabled={loading}
                                />
                            </div>
                            {errors.title && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ImCross className="w-3 h-3" />
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Slug */}
                        <div className="space-y-1.5">
                            <label className="label">Slug (URL)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaTag className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Auto-generated from title"
                                    disabled={loading}
                                />
                            </div>
                            <p className="text-[1.2rem] text-gray-400">
                                Leave empty to auto-generate from title
                            </p>
                        </div>

                        {/* Summary */}
                        <div className="space-y-1.5">
                            <label className="label">Summary</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleChange}
                                    rows="2"
                                    className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                                    placeholder="Brief summary of your post"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-1.5">
                            <label className="label">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows="8"
                                    className={`text-[1.2rem] w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                        errors.content
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none`}
                                    placeholder="Write your post content here..."
                                    disabled={loading}
                                />
                            </div>
                            {errors.content && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ImCross className="w-3 h-3" />
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        {/* Category & Section Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="label">Category</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaTag className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                                        disabled={loading}
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="label">Section Type</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaNewspaper className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="section_type"
                                        value={formData.section_type}
                                        onChange={handleChange}
                                        className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                                        disabled={loading}
                                    >
                                        <option value="main">
                                            Main (Hero Slider)
                                        </option>
                                        <option value="others">
                                            Others (Grid 3)
                                        </option>
                                        <option value="scrollable">
                                            Scrollable (Horizontal)
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Status & Featured */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="label">Status</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaClock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                                        disabled={loading}
                                    >
                                        <option value="draft">Draft</option>
                                        {isAdmin && (
                                            <option value="published">
                                                Published
                                            </option>
                                        )}
                                        <option value="archived">
                                            Archived
                                        </option>
                                    </select>
                                </div>
                                {!isAdmin && (
                                    <p className="flex items-center gap-2 mt-4 text-[1.2rem] text-yellow-600 dark:text-yellow-400">
                                        <FaLightbulb className="w-8 h-8" />{" "}
                                        Writers can only publish with admin
                                        approval
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5 flex items-center">
                                <label className="label flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-emerald-500 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500"
                                        disabled={loading}
                                    />
                                    Featured Post
                                    <span className="text-[1.2rem] text-gray-400">
                                        (Display on top)
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="confirmBtn bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Create Post
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/dashboard/my-posts")
                                }
                                className="cancelBtn bg-gray-200 dark:bg-gray-700"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
