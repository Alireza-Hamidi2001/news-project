// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(request, { params }) {
    try {
        // ✅ اصلاح: استفاده از await برای params
        const { id } = await params; // ← اینجا باید await استفاده شود

        // ✅ بررسی ادمین بودن
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized - Only admins can delete users" },
                { status: 403 },
            );
        }

        // ✅ جلوگیری از حذف خودش
        if (id === currentUser.id) {
            return NextResponse.json(
                { error: "You cannot delete your own account" },
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

        // ✅ جلوگیری از حذف ادمین
        if (user.role === "admin") {
            return NextResponse.json(
                { error: "Cannot delete another admin" },
                { status: 400 },
            );
        }

        // ✅ حذف کاربر
        const { error } = await supabaseAdmin
            .from("users")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting user:", error);
            return NextResponse.json(
                { error: "Failed to delete user: " + error.message },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully!",
        });
    } catch (error) {
        console.error("Error in delete user:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
