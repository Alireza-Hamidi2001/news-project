// app/api/news/reject/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        const body = await request.json();
        const { postId, reason } = body;

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 },
            );
        }

        // ✅ فقط reject
        const updateData = {
            status: "rejected",
            rejected_by: currentUser.id,
            rejected_at: new Date().toISOString(),
            rejection_reason: reason || "No reason provided",
            approved_by: null,
            approved_at: null,
            published_at: null,
        };

        const { data, error } = await supabaseAdmin
            .from("news")
            .update(updateData)
            .eq("id", postId)
            .eq("status", "pending")
            .select()
            .single();

        if (error) {
            console.error("Error rejecting post:", error);
            return NextResponse.json(
                { error: "Failed to reject post" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Post rejected successfully!",
            post: data,
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
