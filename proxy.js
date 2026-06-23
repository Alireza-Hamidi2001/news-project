// proxy.js
import { NextResponse } from "next/server";

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // Redirect root to /news
    if (pathname === "/" || pathname === "") {
        return NextResponse.redirect(new URL("/news", request.url));
    }
    if (pathname === "/news/") {
        return NextResponse.redirect(new URL("/news", request.url));
    }

    // Public paths
    const publicPaths = [
        "/news",
        "/login",
        "/api/auth/login",
        "/api/auth/logout",
        "/_next",
        "/favicon.ico",
        "/images",
        "/dashboard", // برای تست اضافه کن
    ];

    const isPublicPath = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/"),
    );

    if (isPublicPath) {
        return NextResponse.next();
    }

    // Check token
    const token = request.cookies.get("auth_token")?.value;
    console.log(`🔍 [Proxy] Token found: ${!!token}`);

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)",
    ],
};
