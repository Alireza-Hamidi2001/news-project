import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth/auth";

// آپلود فایل در Supabase Storage
async function uploadAvatar(userId, file) {
    try {
        // تبدیل File به Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // اسم فایل یکتا
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // آپلود در Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from("avatars")
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            console.error("❌ Upload error:", error);
            throw new Error("Failed to upload avatar");
        }

        // گرفتن لینک عمومی
        const { data: urlData } = supabaseAdmin.storage
            .from("avatars")
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    } catch (error) {
        console.error("❌ Upload avatar error:", error);
        throw error;
    }
}

// حذف آواتار قبلی
async function deleteOldAvatar(avatarUrl) {
    if (!avatarUrl) return;

    try {
        // استخراج مسیر فایل از URL
        const urlParts = avatarUrl.split("/");
        const filePath = urlParts.slice(urlParts.indexOf("avatars")).join("/");

        if (filePath) {
            await supabaseAdmin.storage.from("avatars").remove([filePath]);
            console.log("✅ Old avatar deleted:", filePath);
        }
    } catch (error) {
        console.error("❌ Delete old avatar error:", error);
        // خطا رو نادیده میگیریم چون مهم نیست
    }
}

export async function PUT(request) {
    try {
        // گرفتن کاربر فعلی
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // دریافت داده‌های فرم
        const formData = await request.formData();

        const full_name = formData.get("full_name");
        const username = formData.get("username");
        const email = formData.get("email");
        const bio = formData.get("bio") || "";
        const avatarFile = formData.get("avatar");
        const removeAvatar = formData.get("remove_avatar") === "true";

        // اعتبارسنجی
        if (!username || !email) {
            return NextResponse.json(
                { error: "Username and email are required" },
                { status: 400 },
            );
        }

        // بررسی تکراری نبودن username و email
        const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("id, username, email")
            .or(`username.eq.${username},email.eq.${email}`)
            .neq("id", user.id)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Username or email already taken" },
                { status: 400 },
            );
        }

        let avatarUrl = user.avatar_url;

        // ============================================
        // مدیریت آواتار
        // ============================================
        if (removeAvatar) {
            // حذف آواتار
            if (user.avatar_url) {
                await deleteOldAvatar(user.avatar_url);
            }
            avatarUrl = null;
        } else if (avatarFile && avatarFile.size > 0) {
            // آپلود آواتار جدید
            // حذف آواتار قدیمی
            if (user.avatar_url) {
                await deleteOldAvatar(user.avatar_url);
            }

            // آپلود جدید
            avatarUrl = await uploadAvatar(user.id, avatarFile);
        }

        // ============================================
        // به‌روزرسانی اطلاعات کاربر
        // ============================================
        const updateData = {
            full_name: full_name || user.full_name,
            username,
            email,
            bio,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        };

        const { data: updatedUser, error } = await supabaseAdmin
            .from("users")
            .update(updateData)
            .eq("id", user.id)
            .select("id, full_name, username, email, bio, avatar_url, role")
            .single();

        if (error) {
            console.error("❌ Update error:", error);
            return NextResponse.json(
                { error: "Failed to update profile" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("❌ Update profile error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
