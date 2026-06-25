import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request) {
    try {
        const currentUser = await getCurrentUser();

        // فقط ادمین میتونه تایید کنه
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Only admins can approve posts." },
                { status: 403 },
            );
        }

        const { postId, action } = await request.json();

        if (!postId || !action) {
            return NextResponse.json(
                { error: "Post ID and action are required" },
                { status: 400 },
            );
        }

        if (!["approve", "reject"].includes(action)) {
            return NextResponse.json(
                { error: "Action must be 'approve' or 'reject'" },
                { status: 400 },
            );
        }

        let updateData = {};

        if (action === "approve") {
            updateData = {
                status: "published",
                published_at: new Date().toISOString(),
                approved_by: currentUser.id,
                approved_at: new Date().toISOString(),
            };
        } else if (action === "reject") {
            updateData = {
                status: "rejected",
                rejected_by: currentUser.id,
                rejected_at: new Date().toISOString(),
            };
        }

        const { data: post, error } = await supabaseAdmin
            .from("news")
            .update(updateData)
            .eq("id", postId)
            .eq("status", "pending") // فقط پست‌های pending
            .select()
            .single();

        if (error) {
            console.error("❌ Approve error:", error);
            return NextResponse.json(
                { error: "Failed to update post" },
                { status: 500 },
            );
        }

        if (!post) {
            return NextResponse.json(
                { error: "Post not found or already processed" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message:
                action === "approve"
                    ? "Post approved and published successfully!"
                    : "Post rejected successfully.",
            post,
        });
    } catch (error) {
        console.error("❌ Approve error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
