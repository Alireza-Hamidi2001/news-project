// app/api/users/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    try {
        // ✅ بررسی ادمین بودن
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        // ✅ دریافت همه کاربران
        const { data: users, error } = await supabaseAdmin
            .from("users")
            .select(
                `
                id,
                full_name,
                email,
                role,
                is_active,
                created_at,
                last_login,
                avatar_url
            `,
            )
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching users:", error);
            return NextResponse.json(
                { error: "Failed to fetch users: " + error.message },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            users: users || [],
        });
    } catch (error) {
        console.error("Error in get users:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
