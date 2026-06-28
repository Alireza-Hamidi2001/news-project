// lib/actions/news.js
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

export async function getNewsBySection(sectionType, limit = 10) {
    console.log(
        `🔍 [getNewsBySection] Fetching section: ${sectionType}, limit: ${limit}`,
    );

    try {
        const { data, error } = await supabaseAdmin
            .from("news")
            .select(
                `
                *,
                author:author_id (
                    id,
                    full_name,
                    username,
                    avatar_url
                )
            `,
            )
            .eq("section_type", sectionType)
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("❌ [getNewsBySection] Supabase error:", error);
            return [];
        }

        console.log(`✅ [getNewsBySection] Found ${data?.length || 0} posts`);
        return data || [];
    } catch (error) {
        console.error("❌ [getNewsBySection] Catch error:", error);
        return [];
    }
}

export async function getNewsById(id) {
    console.log(`🔍 [getNewsById] Fetching news by id: ${id}`);

    try {
        const { data, error } = await supabaseAdmin
            .from("news")
            .select(
                `
                *,
                author:author_id (
                    id,
                    full_name,
                    username,
                    avatar_url
                )
            `,
            )
            .eq("id", id)
            .eq("status", "published")
            .single();

        if (error) {
            console.error("❌ [getNewsById] Supabase error:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("❌ [getNewsById] Catch error:", error);
        return null;
    }
}

export async function getAllNews(limit = 50) {
    console.log(`🔍 [getAllNews] Fetching all news, limit: ${limit}`);

    try {
        const { data, error } = await supabaseAdmin
            .from("news")
            .select(
                `
                *,
                author:author_id (
                    id,
                    full_name,
                    username,
                    avatar_url
                )
            `,
            )
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("❌ [getAllNews] Supabase error:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("❌ [getAllNews] Catch error:", error);
        return [];
    }
}

export async function getNewsByCategory(categoryId, limit = 10) {
    console.log(
        `🔍 [getNewsByCategory] Category: ${categoryId}, limit: ${limit}`,
    );

    try {
        const { data, error } = await supabaseAdmin
            .from("news")
            .select(
                `
                *,
                author:author_id (
                    id,
                    full_name,
                    username,
                    avatar_url
                ),
                categories (
                    id,
                    name,
                    slug
                )
            `,
            )
            .eq("category_id", categoryId)
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("❌ [getNewsByCategory] Supabase error:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("❌ [getNewsByCategory] Catch error:", error);
        return [];
    }
}

export async function getFeaturedNews(limit = 5) {
    console.log(`🔍 [getFeaturedNews] Fetching featured news, limit: ${limit}`);

    try {
        const { data, error } = await supabaseAdmin
            .from("news")
            .select(
                `
                *,
                author:author_id (
                    id,
                    full_name,
                    username,
                    avatar_url
                )
            `,
            )
            .eq("status", "published")
            .eq("is_featured", true)
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("❌ [getFeaturedNews] Supabase error:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("❌ [getFeaturedNews] Catch error:", error);
        return [];
    }
}

export async function getPendingPosts() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            console.log("❌ User is not admin:", user?.role);
            return { posts: [], error: "Unauthorized" };
        }

        console.log("✅ User is admin, fetching pending posts...");

        const { data: posts, error } = await supabaseAdmin
            .from("news")
            .select(
                `
                id,
                title,
                summary,
                content,
                cover_image,
                created_at,
                status,
                author_id,
                author:author_id (
                    id,
                    full_name,
                    email,
                    avatar_url
                )
            `,
            )
            .eq("status", "pending")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("❌ Error fetching pending posts:", error);
            return { posts: [], error: error.message };
        }

        console.log(`✅ Found ${posts?.length || 0} pending posts`);
        return { posts: posts || [] };
    } catch (error) {
        console.error("❌ Error in getPendingPosts:", error);
        return { posts: [], error: error.message };
    }
}

// ✅ تابع جدید برای ایجاد پست با Server Action
export async function createPostAction(formData) {
    try {
        const user = await getCurrentUser();

        if (!user || !["admin", "writer"].includes(user.role)) {
            return { error: "Unauthorized" };
        }

        const title = formData.get("title");
        const content = formData.get("content");
        const slug = formData.get("slug");
        const summary = formData.get("summary") || "";
        const category_id = formData.get("category_id") || null;
        const section_type = formData.get("section_type") || "others";
        const is_featured = formData.get("is_featured") === "true";
        const coverFile = formData.get("cover_image");

        if (!title || !content) {
            return { error: "Title and content are required" };
        }

        const finalSlug =
            slug ||
            title
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
                .replace(/\s+/g, "-");

        let cover_image = null;

        if (coverFile && coverFile.size > 0) {
            const fileExt = coverFile.name.split(".").pop();
            const fileName = `covers/${Date.now()}-${Math.random()
                .toString(36)
                .substring(7)}.${fileExt}`;

            const bytes = await coverFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const { error: uploadError } = await supabaseAdmin.storage
                .from("covers")
                .upload(fileName, buffer, {
                    contentType: coverFile.type,
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) {
                console.error("❌ Upload error:", uploadError);
                return { error: "Failed to upload cover image" };
            }

            const { data: urlData } = supabaseAdmin.storage
                .from("covers")
                .getPublicUrl(fileName);

            cover_image = urlData.publicUrl;
        }

        const isAdmin = user.role === "admin";
        const postStatus = isAdmin ? "published" : "pending";

        const { data: news, error } = await supabaseAdmin
            .from("news")
            .insert({
                title,
                slug: finalSlug,
                summary,
                content,
                category_id: category_id || null,
                author_id: user.id,
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
            return { error: "Failed to create post: " + error.message };
        }

        // ✅ ریوَالیدیت کش
        revalidatePath("/");
        revalidatePath("/dashboard/my-posts");
        revalidatePath("/dashboard/pending-posts");

        return {
            success: true,
            data: news,
            status: postStatus,
            message: isAdmin
                ? "Post published successfully!"
                : "Post submitted for review. Waiting for admin approval.",
        };
    } catch (error) {
        console.error("❌ Error in createPostAction:", error);
        return { error: error.message || "Internal server error" };
    }
}
