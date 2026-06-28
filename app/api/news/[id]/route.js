// app/api/news/[id]/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        // فقط ادمین می‌تونه پست رو حذف کنه
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 },
            );
        }

        // ابتدا بررسی کنیم پست وجود دارد
        const { data: existingPost, error: fetchError } = await supabaseAdmin
            .from("news")
            .select("id, cover_image")
            .eq("id", id)
            .single();

        if (fetchError || !existingPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 },
            );
        }

        // حذف کاور تصویر از storage اگر وجود دارد
        if (existingPost.cover_image) {
            try {
                // استخراج نام فایل از URL
                const urlParts = existingPost.cover_image.split("/");
                const fileName = urlParts[urlParts.length - 1];

                if (fileName) {
                    await supabaseAdmin.storage
                        .from("covers")
                        .remove([`covers/${fileName}`]);
                }
            } catch (storageError) {
                console.error("Error deleting cover image:", storageError);
                // ادامه می‌دهیم حتی اگر حذف تصویر失敗 کند
            }
        }

        // حذف پست از دیتابیس
        const { error: deleteError } = await supabaseAdmin
            .from("news")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("Error deleting post:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete post" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Post deleted successfully!",
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
