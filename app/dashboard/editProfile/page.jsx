// app/dashboard/edit-profile/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    FaUser,
    FaEnvelope,
    FaUserTag,
    FaSave,
    FaSpinner,
    FaCamera,
    FaTrash,
    FaCheck,
    FaLock,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoWarning } from "react-icons/io5";

export default function EditProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isAvatarChanged, setIsAvatarChanged] = useState(false);
    const [userData, setUserData] = useState({
        id: "",
        full_name: "",
        username: "",
        email: "",
        bio: "",
        avatar_url: null,
    });
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        bio: "",
    });
    const [errors, setErrors] = useState({});
    const [initialLoad, setInitialLoad] = useState(true);

    // دریافت اطلاعات کاربر از دیتابیس
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data.user);
                    setFormData({
                        full_name: data.user.full_name || "",
                        username: data.user.username || "",
                        email: data.user.email || "",
                        bio: data.user.bio || "",
                    });
                    if (data.user.avatar_url) {
                        setAvatarPreview(data.user.avatar_url);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setInitialLoad(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setAvatarPreview(event.target.result);
            setAvatarFile(file);
            setIsAvatarChanged(true);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        setAvatarFile(null);
        setIsAvatarChanged(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
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
        const toastId = toast.loading("Updating profile...");

        try {
            // ساخت FormData برای ارسال فایل
            const formDataToSend = new FormData();
            formDataToSend.append("full_name", formData.full_name);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("bio", formData.bio || "");

            if (isAvatarChanged) {
                if (avatarFile) {
                    formDataToSend.append("avatar", avatarFile);
                } else {
                    formDataToSend.append("remove_avatar", "true");
                }
            }

            const res = await fetch("/api/auth/update-profile", {
                method: "PUT",
                body: formDataToSend,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            // به‌روزرسانی اطلاعات کاربر با داده‌های جدید
            if (data.user) {
                setUserData(data.user);
                setFormData({
                    full_name: data.user.full_name || "",
                    username: data.user.username || "",
                    email: data.user.email || "",
                    bio: data.user.bio || "",
                });
                if (data.user.avatar_url) {
                    setAvatarPreview(data.user.avatar_url);
                } else {
                    setAvatarPreview(null);
                }
                setIsAvatarChanged(false);
                setAvatarFile(null);
            }

            toast.success("Profile updated successfully! ✅", { id: toastId });

            // رفرش صفحه و هدر
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to update profile", {
                id: toastId,
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin w-12 h-12 text-zinc-700 dark:text-zinc-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <FaUser className="bg-blue-100 p-2 dark:bg-blue-900/30 rounded-lg w-12 h-12 text-blue-600 dark:text-blue-400" />
                            <h1 className="postTitle font-comic">
                                Edit Profile
                            </h1>
                        </div>
                        <p className="subTitle">
                            Update your personal information and avatar
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
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                            <div className="relative">
                                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                    {avatarPreview ? (
                                        <Image
                                            src={avatarPreview}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                            sizes="112px"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold">
                                            {userData.full_name
                                                ?.charAt(0)
                                                .toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                >
                                    <FaCamera className="w-4 h-4" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[1.4rem] font-semibold text-gray-900 dark:text-white">
                                    Profile Picture
                                </h3>
                                <p className="text-[1.2rem] text-gray-500 dark:text-gray-400">
                                    Click the camera icon to upload a new photo
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={handleAvatarClick}
                                        className="px-3 py-1.5 text-[1.2rem] bg-blue-500 hover:bg-blue-600 text-white rounded transition-all duration-200"
                                    >
                                        Change
                                    </button>
                                    {(avatarPreview || userData.avatar_url) && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="px-3 py-1.5 text-[1.2rem] bg-red-500 hover:bg-red-600 text-white rounded transition-all duration-200 flex items-center gap-1"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {isAvatarChanged && (
                                    <p className="text-[1.2rem] text-emerald-500 mt-1">
                                        <FaCheck className="inline w-3 h-3 mr-1" />
                                        Avatar changed (save to apply)
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Fields - Grid 2 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name - غیرقابل تغییر */}
                            <div className="space-y-1.5">
                                <label className="label flex items-center gap-2">
                                    Full Name{" "}
                                    <span className="text-red-500">*</span>
                                    <span className="text-[1.2rem] text-gray-400 flex items-center gap-1">
                                        <FaLock className="w-3 h-3" />
                                        (Read-only)
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        readOnly
                                        disabled
                                        className="text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800/50 border border-gray-300 dark:border-gray-600 rounded-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        placeholder="Full name"
                                    />
                                </div>
                                <p className="text-[1.2rem] text-gray-400">
                                    Name cannot be changed
                                </p>
                            </div>

                            {/* Username */}
                            <div className="space-y-1.5">
                                <label className="label">
                                    Username{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserTag className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`text-[1.2rem] w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                            errors.username
                                                ? "border-red-500"
                                                : "border-gray-300 dark:border-gray-600"
                                        } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                        placeholder="Enter username"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <ImCross className="w-3 h-3" />
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="label">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`text-[1.2rem] tracking-wide w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-300 dark:border-gray-600"
                                        } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                        placeholder="Enter email address"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <ImCross className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="space-y-1.5">
                                <label className="label">Bio</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border ${
                                            errors.bio
                                                ? "border-red-500"
                                                : "border-gray-300 dark:border-gray-600"
                                        } rounded-sm focus:outline-none focus:ring focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none`}
                                        placeholder="Tell us about yourself"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.bio && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <ImCross className="w-3 h-3" />
                                        {errors.bio}
                                    </p>
                                )}
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
                                        Saving...
                                    </>
                                ) : (
                                    <>Save Changes</>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push("/dashboard")}
                                className="cancelBtn bg-gray-200 dark:bg-gray-700"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl border border-yellow-400 dark:border-yellow-800">
                <p className="flex items-center gap-2 text-[1.2rem] text-yellow-700 dark:text-yellow-300">
                    <IoWarning className="w-8 h-8" />{" "}
                    <span className="font-medium">Note:</span> If you can not
                    see your information in this form , refresh tha page or try
                    another internet .
                </p>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="flex items-center gap-2 text-[1.2rem] text-blue-700 dark:text-blue-300">
                    <FaUser className="w-8 h-8" />{" "}
                    <span className="font-medium">Note:</span> Your full name
                    cannot be changed. Please contact support if you need to
                    update it.
                </p>
            </div>
        </div>
    );
}
