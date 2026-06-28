// app/api/news/all/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        // فقط ادمین می‌تونه همه پست‌ها رو ببینه
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        // دریافت همه پست‌های منتشر شده (به جز pending و rejected)
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
            .in("status", ["published", "draft", "archived"]) // همه به جز pending و rejected
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching all posts:", error);
            return NextResponse.json(
                { error: "Failed to fetch posts" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            posts: posts || [],
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
