import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";

export async function setAuthCookie(token) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
    });
}

export async function getAuthCookie() {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export function getAuthCookieFromRequest(request) {
    const cookie = request.cookies.get(COOKIE_NAME);
    return cookie?.value;
}
