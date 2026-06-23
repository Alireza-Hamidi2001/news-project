// lib/auth/cookies.js
import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setAuthCookie(token) {
    console.log("🔍 [Cookies] Setting auth cookie...");
    try {
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: COOKIE_MAX_AGE,
            path: "/",
        });
        console.log("✅ [Cookies] Auth cookie set successfully");
    } catch (error) {
        console.error("❌ [Cookies] Failed to set cookie:", error.message);
        throw error;
    }
}

export async function getAuthCookie() {
    console.log("🔍 [Cookies] Getting auth cookie...");
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        console.log(`✅ [Cookies] Auth cookie found: ${!!token}`);
        return token;
    } catch (error) {
        console.error("❌ [Cookies] Failed to get cookie:", error.message);
        return null;
    }
}

export async function removeAuthCookie() {
    console.log("🔍 [Cookies] Removing auth cookie...");
    try {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
        console.log("✅ [Cookies] Auth cookie removed");
    } catch (error) {
        console.error("❌ [Cookies] Failed to remove cookie:", error.message);
        throw error;
    }
}

export function getAuthCookieFromRequest(request) {
    console.log("🔍 [Cookies] Getting cookie from request...");
    const token = request.cookies.get(COOKIE_NAME)?.value;
    console.log(`✅ [Cookies] Cookie from request: ${!!token}`);
    return token;
}
