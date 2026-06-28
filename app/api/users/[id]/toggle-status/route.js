// app/api/users/[id]/toggle-status/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request, { params }) {
    try {
        // ✅ اصلاح: استفاده از await برای params
        const { id } = await params; // ← اینجا باید await استفاده شود

        // ✅ بررسی ادمین بودن
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized - Only admins can manage users" },
                { status: 403 },
            );
        }

        // ✅ دریافت body
        const body = await request.json();
        const { is_active } = body;

        // ✅ اعتبارسنجی
        if (typeof is_active !== "boolean") {
            return NextResponse.json(
                { error: "is_active must be a boolean" },
                { status: 400 },
            );
        }

        // ✅ جلوگیری از تغییر وضعیت خودش
        if (id === currentUser.id) {
            return NextResponse.json(
                { error: "You cannot change your own status" },
                { status: 400 },
            );
        }

        // ✅ بررسی وجود کاربر
        const { data: user, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id, role")
            .eq("id", id)
            .single();

        if (fetchError || !user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        // ✅ جلوگیری از غیرفعال کردن ادمین دیگر
        if (user.role === "admin" && is_active === false) {
            return NextResponse.json(
                { error: "Cannot deactivate another admin" },
                { status: 400 },
            );
        }

        // ✅ به‌روزرسانی وضعیت
        const { data, error } = await supabaseAdmin
            .from("users")
            .update({
                is_active,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating user status:", error);
            return NextResponse.json(
                { error: "Failed to update user status: " + error.message },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: `User ${
                is_active ? "activated" : "deactivated"
            } successfully!`,
            user: data,
        });
    } catch (error) {
        console.error("Error in toggle-status:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
