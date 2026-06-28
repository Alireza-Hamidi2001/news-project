// app/dashboard/all-posts/page.jsx
import AllPostsClient from "@/app/_components/AllPostsClient";
import { getCurrentUser } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

async function getAllPosts() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return { posts: [], error: "Unauthorized" };
        }

        const { data: posts, error } = await supabaseAdmin
            .from("news")
            .select(
                `
                *,
                author:author_id (
                    id,
                    full_name,
                    email,
                    avatar_url
                )
            `,
            )
            .in("status", ["published", "draft", "archived"])
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching all posts:", error);
            return { posts: [], error: error.message };
        }

        return { posts: posts || [] };
    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return { posts: [], error: error.message };
    }
}

export default async function AllPostsPage() {
    // بررسی احراز هویت
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // فقط ادمین‌ها
    if (user.role !== "admin") {
        redirect("/dashboard");
    }

    // دریافت همه پست‌ها
    const result = await getAllPosts();

    return <AllPostsClient initialPosts={result.posts || []} />;
}
