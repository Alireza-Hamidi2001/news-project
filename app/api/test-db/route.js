// app/api/test-db/route.js
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 1. تست اتصال و جستجوی مستقیم
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", "alireza")
            .maybeSingle();

        // 2. اگر کاربر پیدا شد، لاگین رو شبیه‌سازی کن
        if (user) {
            const isPasswordValid = (password) =>
                password === user.password_hash;

            return NextResponse.json({
                success: true,
                message: "User found!",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    // این رو ببین: رمز درخواستی "alireza123" با رمز ذخیره شده یکی هست؟
                    storedPassword: user.password_hash,
                    passwordMatch: isPasswordValid("alireza123"), // true یا false
                },
            });
        }

        // 3. اگر کاربر پیدا نشد
        return NextResponse.json({
            success: false,
            message: "User 'alireza' not found in database",
            allUsernames: (
                await supabase.from("users").select("username")
            ).data?.map((u) => u.username),
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 },
        );
    }
}
