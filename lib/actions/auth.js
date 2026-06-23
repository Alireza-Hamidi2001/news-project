// lib/actions/auth.js (Server Action)
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    // اعتبارسنجی
    if (!username || !password) {
        return { error: "همه فیلدها الزامی هستند" };
    }

    // محدودیت تلاش (مثلاً با Redis)
    // ...

    // احراز هویت با Supabase
    const supabase = createClient();
    const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !data) {
        return { error: "نام کاربری یا رمز عبور اشتباه است" };
    }

    // بررسی رمز (با bcrypt یا ...)
    // ...

    // ایجاد Session
    cookies().set("admin_session", data.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 روز
        path: "/",
    });

    redirect("/admin/dashboard");
}
