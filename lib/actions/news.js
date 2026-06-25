import { supabaseAdmin } from "@/lib/supabase";

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
            console.error(
                "❌ [getNewsBySection] Error details:",
                JSON.stringify(error, null, 2),
            );
            return [];
        }

        console.log(`✅ [getNewsBySection] Found ${data?.length || 0} posts`);
        return data || [];
    } catch (error) {
        console.error("❌ [getNewsBySection] Catch error:", error);
        console.error("❌ [getNewsBySection] Error message:", error.message);
        console.error("❌ [getNewsBySection] Error stack:", error.stack);
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
