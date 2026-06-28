// middleware.js
import { NextResponse } from "next/server";
import {
    getUserFromToken,
    getUserRoleFromToken,
    getUserActiveStatus,
} from "@/lib/auth/middleware-utils";

// ============================================
// ✅ مسیرهای عمومی (نیاز به لاگین ندارن)
// ============================================
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

// ✅ مسیرهای خبر که هم برای لاگین شده و هم نشده قابل دسترسه
const NEWS_PATHS = ["/news"];

// ✅ مسیرهای API که عمومی هستن
const PUBLIC_API_PATHS = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/register",
];

// ✅ مسیرهای استاتیک
const STATIC_PATHS = ["/_next", "/favicon.ico", "/images", "/api/webhook"];

// ✅ مسیرهایی که فقط ادمین دسترسی داره
const ADMIN_PATHS = ["/admin"];

// ✅ مسیرهایی که ادمین و نویسنده دسترسی دارن
const WRITER_PATHS = ["/dashboard"];

// ✅ مسیرهایی که کاربر غیرفعال نباید به آنها دسترسی داشته باشد
const RESTRICTED_FOR_INACTIVE = [
    "/dashboard/new-post",
    "/dashboard/edit-profile",
    "/dashboard/pending-posts",
    "/dashboard/user-management",
    "/dashboard/all-posts",
    "/dashboard/new-author",
    "/dashboard/categories",
    "/api/news",
    "/api/news/approve",
    "/api/news/reject",
    "/api/news/pending",
    "/api/users",
];

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    console.log("🔍 [Middleware] Path:", path);

    // ============================================
    // 1. بررسی مسیرهای استاتیک
    // ============================================
    if (STATIC_PATHS.some((p) => path.startsWith(p))) {
        return NextResponse.next();
    }

    // ============================================
    // 2. بررسی مسیرهای API عمومی
    // ============================================
    if (PUBLIC_API_PATHS.some((p) => path.startsWith(p))) {
        return NextResponse.next();
    }

    // ============================================
    // 3. ریدایرکت ریشه (/) به /news
    // ============================================
    if (path === "/") {
        console.log("🔄 [Middleware] Redirecting root to /news");
        return NextResponse.redirect(new URL("/news", request.url));
    }

    // ============================================
    // 4. دریافت اطلاعات کاربر از توکن
    // ============================================
    const token = request.cookies.get("auth-token")?.value;
    const user = token ? getUserFromToken(token) : null;
    const isAuthenticated = !!user;
    const userRole = user?.role || null;
    const isActive = user?.is_active !== false;

    console.log(
        `🔍 [Middleware] Auth: ${isAuthenticated}, Role: ${userRole}, Active: ${isActive}, Path: ${path}`,
    );

    // ============================================
    // 5. مسیر /news همیشه قابل دسترس باشه
    // ============================================
    const isNewsPath = NEWS_PATHS.some(
        (p) => path === p || path.startsWith(p + "/"),
    );

    if (isNewsPath) {
        console.log("✅ [Middleware] News path, allowing access");
        return NextResponse.next();
    }

    // ============================================
    // 6. بررسی مسیرهای عمومی
    // ============================================
    const isPublicPath = PUBLIC_PATHS.some(
        (p) => path === p || path.startsWith(p + "/"),
    );

    if (isAuthenticated && isPublicPath) {
        console.log(
            "🔄 [Middleware] Authenticated on public page, redirecting to dashboard",
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isAuthenticated && !isPublicPath) {
        console.log("🔄 [Middleware] Unauthenticated, redirecting to login");
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    // ============================================
    // 7. بررسی کاربر غیرفعال
    // ============================================
    if (isAuthenticated && !isActive) {
        console.log(`⚠️ [Middleware] Inactive user accessing: ${path}`);

        // بررسی مسیرهای ممنوعه
        const isRestricted = RESTRICTED_FOR_INACTIVE.some(
            (p) => path === p || path.startsWith(p + "/"),
        );

        if (isRestricted) {
            console.log(
                "🚫 [Middleware] Inactive user blocked from restricted path",
            );

            if (path.startsWith("/api/")) {
                return new NextResponse(
                    JSON.stringify({
                        error: "Account deactivated. Please contact admin.",
                    }),
                    {
                        status: 403,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
            }

            return NextResponse.redirect(
                new URL("/dashboard?deactivated=true", request.url),
            );
        }

        // اجازه دسترسی به داشبورد (فقط مشاهده)
        if (path.startsWith("/dashboard")) {
            console.log(
                "✅ [Middleware] Inactive user allowed to view dashboard",
            );
            return NextResponse.next();
        }
    }

    // ============================================
    // 8. بررسی مسیرهای ادمین
    // ============================================
    const isAdminPath = ADMIN_PATHS.some(
        (p) => path === p || path.startsWith(p + "/"),
    );

    if (isAdminPath && userRole !== "admin") {
        console.log(
            "🔄 [Middleware] Non-admin user trying to access admin page",
        );
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    // ============================================
    // 9. بررسی مسیرهای نویسنده
    // ============================================
    const isWriterPath = WRITER_PATHS.some(
        (p) => path === p || path.startsWith(p + "/"),
    );

    if (isWriterPath && !["admin", "writer"].includes(userRole)) {
        console.log(
            "🔄 [Middleware] Non-writer user trying to access writer page",
        );
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/news", request.url));
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    // ============================================
    // 10. اجازه دسترسی نهایی
    // ============================================
    console.log("✅ [Middleware] Allowing access to:", path);
    return NextResponse.next();
}

// ============================================
// Config: Match all paths except static files
// ============================================
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
    ],
};
