import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createHash } from "crypto";
import { getCurrentUser, isAdmin } from "@/lib/auth/auth";

export async function POST(request) {
    try {
        // ✅ بررسی ادمین بودن
        const currentUser = await getCurrentUser();
        if (!isAdmin(currentUser)) {
            return NextResponse.json(
                { error: "Unauthorized. Only admins can create accounts." },
                { status: 403 },
            );
        }

        const { full_name, username, email, password, phone, bio, role } =
            await request.json();

        // اعتبارسنجی
        if (!full_name || !username || !email || !password) {
            return NextResponse.json(
                {
                    error: "Full name, username, email and password are required",
                },
                { status: 400 },
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 },
            );
        }

        // بررسی وجود کاربر
        const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("id")
            .or(`email.eq.${email},username.eq.${username}`)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Email or username already exists" },
                { status: 400 },
            );
        }

        // هش کردن رمز
        const hashedPassword = createHash("sha256")
            .update(password)
            .digest("hex");

        // نقش کاربر (پیش‌فرض writer)
        const userRole = role || "writer";

        // ایجاد کاربر
        const { data: user, error } = await supabaseAdmin
            .from("users")
            .insert({
                full_name,
                username,
                email,
                password_hash: hashedPassword,
                phone: phone || null,
                bio: bio || "",
                role: userRole,
                is_active: true,
                created_at: new Date().toISOString(),
                created_by: currentUser.id, // ثبت اینکه کدام ادمین ساخته
            })
            .select(
                "id, full_name, username, email, phone, role, avatar_url, bio",
            )
            .single();

        if (error) {
            console.error("❌ [Register] Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to create user" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: `User created successfully with role: ${userRole}`,
            user,
        });
    } catch (error) {
        console.error("❌ [Register] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Registration failed" },
            { status: 500 },
        );
    }
}
