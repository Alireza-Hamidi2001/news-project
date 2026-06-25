import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        // فقط ادمین میتونه پست‌های pending رو ببینه
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        const { data: posts, error } = await supabaseAdmin
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
            .eq("status", "pending")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching pending posts:", error);
            return NextResponse.json(
                { error: "Failed to fetch pending posts" },
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
