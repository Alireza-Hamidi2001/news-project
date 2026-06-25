import { supabaseAdmin } from "@/lib/supabase";
import { signToken, verifyToken } from "./jwt";
import {
    setAuthCookie,
    getAuthCookie,
    removeAuthCookie,
    getAuthCookieFromRequest,
} from "./cookies";
import { createHash } from "crypto";

// لاگین کاربر
export async function loginUser(identifier, password) {
    console.log("🔍 [Auth.loginUser] ===== START =====");
    console.log(`🔍 [Auth.loginUser] Identifier: "${identifier}"`);
    console.log(
        `🔍 [Auth.loginUser] Password length: ${password?.length || 0}`,
    );

    try {
        // هش کردن رمز
        const hashedPassword = createHash("sha256")
            .update(password)
            .digest("hex");

        console.log(
            `🔍 [Auth.loginUser] Hashed password: ${hashedPassword.substring(
                0,
                30,
            )}...`,
        );

        // جستجوی کاربر با email یا username
        console.log(
            `🔍 [Auth.loginUser] Searching for user with: email=${identifier} OR username=${identifier}`,
        );

        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .or(`email.eq.${identifier},username.eq.${identifier}`)
            .single();

        if (error) {
            console.error("❌ [Auth.loginUser] Supabase error:", error);
            throw new Error("Invalid credentials");
        }

        if (!user) {
            console.error(
                "❌ [Auth.loginUser] User not found for identifier:",
                identifier,
            );
            throw new Error("Invalid credentials");
        }

        console.log(
            `✅ [Auth.loginUser] User found: ${user.username} (${user.email})`,
        );
        console.log(
            `🔍 [Auth.loginUser] DB password_hash: ${user.password_hash?.substring(
                0,
                30,
            )}...`,
        );
        console.log(
            `🔍 [Auth.loginUser] Provided hash: ${hashedPassword.substring(
                0,
                30,
            )}...`,
        );
        console.log(
            `🔍 [Auth.loginUser] Match: ${
                user.password_hash === hashedPassword
            }`,
        );

        // بررسی مطابقت رمز
        if (user.password_hash !== hashedPassword) {
            console.error("❌ [Auth.loginUser] Password mismatch");
            throw new Error("Invalid credentials");
        }

        // بررسی فعال بودن حساب
        if (user.is_active === false) {
            console.error(
                "❌ [Auth.loginUser] Account is disabled for:",
                user.username,
            );
            throw new Error("Account is disabled");
        }

        console.log("✅ [Auth.loginUser] Password verified successfully");

        // ایجاد payload برای JWT
        const tokenPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
        };

        console.log(
            "🔍 [Auth.loginUser] Creating token for:",
            tokenPayload.username,
        );

        // امضای توکن
        const token = signToken(tokenPayload);

        // ذخیره در کوکی
        await setAuthCookie(token);

        // به‌روزرسانی آخرین ورود
        await supabaseAdmin
            .from("users")
            .update({ last_login: new Date().toISOString() })
            .eq("id", user.id);

        console.log("✅ [Auth.loginUser] ===== SUCCESS =====");

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                full_name: user.full_name,
                role: user.role,
                avatar_url: user.avatar_url,
            },
        };
    } catch (error) {
        console.error("❌ [Auth.loginUser] Error:", error.message);
        console.error("❌ [Auth.loginUser] Stack:", error.stack);
        throw new Error(error.message || "Login failed");
    }
}

// دریافت کاربر فعلی
export async function getCurrentUser() {
    console.log("🔍 [Auth.getCurrentUser] ===== START =====");

    try {
        const token = await getAuthCookie();
        if (!token) {
            console.log("ℹ️ [Auth.getCurrentUser] No token found");
            return null;
        }

        console.log("🔍 [Auth.getCurrentUser] Token found, verifying...");

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            console.warn("⚠️ [Auth.getCurrentUser] Invalid token");
            return null;
        }

        console.log(`🔍 [Auth.getCurrentUser] Decoded user ID: ${decoded.id}`);

        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", decoded.id)
            .single();

        if (error || !user) {
            console.warn("⚠️ [Auth.getCurrentUser] User not found in database");
            return null;
        }

        if (user.is_active === false) {
            console.warn("⚠️ [Auth.getCurrentUser] User is inactive");
            await removeAuthCookie();
            return null;
        }

        console.log(`✅ [Auth.getCurrentUser] User found: ${user.username}`);
        return user;
    } catch (error) {
        console.error("❌ [Auth.getCurrentUser] Error:", error.message);
        return null;
    }
}

// تابع createWriter را اضافه کنید
export const createWriter = async (userData) => {
    try {
        // اینجا منطق ایجاد نویسنده جدید را بنویسید
        // مثلاً اگر از Supabase استفاده می‌کنید:
        const { data, error } = await supabase
            .from("writers")
            .insert([userData])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error creating writer:", error);
        return { success: false, error: error.message };
    }
};
// دریافت کاربر از درخواست (برای middleware)
export async function getUserFromRequest(request) {
    try {
        const token = getAuthCookieFromRequest(request);
        if (!token) return null;

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) return null;

        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", decoded.id)
            .single();

        if (error || !user || user.is_active === false) return null;

        return user;
    } catch (error) {
        console.error("❌ [Auth.getUserFromRequest] Error:", error.message);
        return null;
    }
}

// خروج کاربر
export async function logoutUser() {
    console.log("🔍 [Auth.logoutUser] Logging out...");
    await removeAuthCookie();
    console.log("✅ [Auth.logoutUser] Logout successful");
    return { success: true };
}

// بررسی دسترسی‌ها
export function isAdmin(user) {
    return user?.role === "admin";
}

export function isWriter(user) {
    return user?.role === "writer" || user?.role === "admin";
}

export function hasAccess(user) {
    return user && (isAdmin(user) || isWriter(user));
}
