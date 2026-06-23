// middleware.js
import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/auth";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // ============================================
    // 1. Redirect root to /news
    // ============================================
    if (pathname === "/" || pathname === "") {
        return NextResponse.redirect(new URL("/news", request.url));
    }
    if (pathname === "/news/") {
        return NextResponse.redirect(new URL("/news", request.url));
    }

    // ============================================
    // 2. Public paths (no auth required)
    // ============================================
    const publicPaths = [
        "/news",
        "/login",
        "/api/auth/login",
        "/api/auth/logout",
        "/_next",
        "/favicon.ico",
        "/images",
        "/api/webhook", // if you have webhooks
    ];

    const isPublicPath = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/"),
    );

    // ============================================
    // 3. Check authentication
    // ============================================
    const user = await getCurrentUserFromRequest(request);

    // ============================================
    // 4. Redirect to login if not authenticated
    // ============================================
    if (!user && !isPublicPath) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ============================================
    // 5. Admin only paths
    // ============================================
    const adminPaths = ["/admin"];
    const isAdminPath = adminPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/"),
    );

    if (isAdminPath && (!user || user.role !== "admin")) {
        // If user is logged in but not admin, redirect to news
        if (user) {
            return NextResponse.redirect(new URL("/news", request.url));
        }
        // If not logged in, redirect to login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ============================================
    // 6. Writer only paths (optional)
    // ============================================
    const writerPaths = ["/dashboard"];
    const isWriterPath = writerPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/"),
    );

    if (
        isWriterPath &&
        (!user || (user.role !== "writer" && user.role !== "admin"))
    ) {
        return NextResponse.redirect(new URL("/news", request.url));
    }

    // ============================================
    // 7. Allow access
    // ============================================
    return NextResponse.next();
}

// ============================================
// Config: Match all paths except static files
// ============================================
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)",
    ],
};
