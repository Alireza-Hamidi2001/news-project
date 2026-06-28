// app/api/auth/delete-account/route.js
import { NextResponse } from "next/server";
import { getCurrentUser, logoutUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(request) {
    console.log("🔍 [API Delete Account] Starting...");

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // جلوگیری از حذف ادمین اصلی
        if (
            currentUser.username === "alireza" &&
            currentUser.role === "admin"
        ) {
            return NextResponse.json(
                { error: "Cannot delete the main admin account" },
                { status: 403 },
            );
        }

        // 1. حذف آواتار از Storage
        if (currentUser.avatar_url) {
            try {
                const oldPath = currentUser.avatar_url.split("/").pop();
                if (oldPath) {
                    await supabaseAdmin.storage
                        .from("avatars")
                        .remove([oldPath]);
                    console.log("✅ Avatar deleted from storage");
                }
            } catch (error) {
                console.warn("Could not delete avatar:", error.message);
            }
        }

        // 2. حذف پست‌های کاربر
        await supabaseAdmin
            .from("news")
            .delete()
            .eq("author_id", currentUser.id);

        // 3. حذف کامنت‌های کاربر
        await supabaseAdmin
            .from("comments")
            .delete()
            .eq("user_id", currentUser.id);

        // 4. حذف کاربر از دیتابیس
        const { error } = await supabaseAdmin
            .from("users")
            .delete()
            .eq("id", currentUser.id);

        if (error) {
            console.error("❌ Delete error:", error);
            return NextResponse.json(
                { error: "Failed to delete account" },
                { status: 500 },
            );
        }

        // 5. خروج از حساب
        await logoutUser();

        console.log(`✅ Account deleted: ${currentUser.username}`);
        return NextResponse.json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("❌ Delete account error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
