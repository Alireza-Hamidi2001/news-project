import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
    console.log("🔍 [API News] Creating new post...");

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // فقط admin و writer میتونن پست بسازن
        if (!["admin", "writer"].includes(currentUser.role)) {
            return NextResponse.json(
                { error: "You don't have permission to create posts" },
                { status: 403 },
            );
        }

        const formData = await request.formData();
        const title = formData.get("title");
        const slug = formData.get("slug");
        const summary = formData.get("summary") || "";
        const content = formData.get("content");
        const category_id = formData.get("category_id") || null;
        const section_type = formData.get("section_type") || "others";
        const is_featured = formData.get("is_featured") === "true";
        const coverFile = formData.get("cover_image");

        // اعتبارسنجی
        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 },
            );
        }

        // تولید slug اگر خالی بود
        const finalSlug =
            slug ||
            title
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
                .replace(/\s+/g, "-");

        let cover_image = null;

        // آپلود کاور اگر وجود داشت
        if (coverFile && coverFile.size > 0) {
            const fileExt = coverFile.name.split(".").pop();
            const fileName = `covers/${Date.now()}-${Math.random()
                .toString(36)
                .substring(7)}.${fileExt}`;

            const { data: uploadData, error: uploadError } =
                await supabaseAdmin.storage
                    .from("covers")
                    .upload(fileName, coverFile, {
                        contentType: coverFile.type,
                        cacheControl: "3600",
                        upsert: true,
                    });

            if (uploadError) {
                console.error("❌ Upload error:", uploadError);
                return NextResponse.json(
                    { error: "Failed to upload cover image" },
                    { status: 500 },
                );
            }

            const { data: urlData } = supabaseAdmin.storage
                .from("covers")
                .getPublicUrl(fileName);

            cover_image = urlData.publicUrl;
        }

        // ✅ تعیین وضعیت بر اساس نقش کاربر
        const isAdmin = currentUser.role === "admin";
        const postStatus = isAdmin ? "published" : "pending";

        // ✅ ذخیره در دیتابیس
        const { data: news, error } = await supabaseAdmin
            .from("news")
            .insert({
                title,
                slug: finalSlug,
                summary,
                content,
                category_id: category_id || null,
                author_id: currentUser.id,
                section_type,
                status: postStatus,
                is_featured,
                cover_image,
                published_at: isAdmin ? new Date().toISOString() : null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("❌ Database error:", error);
            return NextResponse.json(
                { error: "Failed to create post: " + error.message },
                { status: 500 },
            );
        }

        const message = isAdmin
            ? "Post published successfully! 🎉"
            : "Post submitted for review. Waiting for admin approval.";

        console.log(`✅ [API News] Post created with status: ${postStatus}`);
        return NextResponse.json({
            success: true,
            message,
            news,
            status: postStatus,
        });
    } catch (error) {
        console.error("❌ [API News] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
