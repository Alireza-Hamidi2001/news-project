// middleware.js
import { NextResponse } from "next/server";
import {
    getUserFromToken,
    getUserRoleFromToken,
} from "@/lib/auth/middleware-utils";

// ============================================
// 1. تعریف مسیرهای مختلف
// ============================================

// مسیرهای عمومی (نیاز به لاگین ندارن)
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

// مسیرهای خبر که هم برای لاگین شده و هم نشده قابل دسترسه
const NEWS_PATHS = ["/news"];

// مسیرهای API که عمومی هستن
const PUBLIC_API_PATHS = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/register",
];

// مسیرهای استاتیک (نیاز به بررسی ندارن)
const STATIC_PATHS = ["/_next", "/favicon.ico", "/images", "/api/webhook"];

// مسیرهایی که فقط ادمین دسترسی داره
const ADMIN_PATHS = ["/admin"];

// مسیرهایی که ادمین و نویسنده دسترسی دارن
const WRITER_PATHS = ["/dashboard"];

// ✅ مسیرهایی که کاربر غیرفعال نباید به آنها دسترسی داشته باشد
const RESTRICTED_FOR_INACTIVE = [
    "/dashboard/new-post", // ایجاد پست جدید
    "/dashboard/edit-profile", // ویرایش پروفایل
    "/dashboard/pending-posts", // پست‌های در انتظار تایید (فقط ادمین)
    "/dashboard/User-management", // مدیریت کاربران (فقط ادمین)
    "/dashboard/all-posts", // همه پست‌ها (فقط ادمین)
    "/dashboard/new-author", // ایجاد نویسنده جدید (فقط ادمین)
    "/dashboard/categories", // مدیریت دسته‌بندی‌ها (فقط ادمین)
    "/api/news", // API ایجاد پست
    "/api/news/approve", // API تایید پست
    "/api/news/reject", // API رد پست
    "/api/news/pending", // API دریافت پست‌های pending
    "/api/users", // API مدیریت کاربران
];

// ✅ مسیرهایی که کاربر غیرفعال همچنان می‌تواند ببیند (فقط خواندنی)
const ALLOWED_FOR_INACTIVE = [
    "/dashboard", // صفحه اصلی داشبورد (فقط مشاهده آمار)
    "/news", // صفحه اخبار
    "/news/*", // جزئیات هر خبر
    "/api/news", // GET برای خواندن اخبار (نه POST)
];

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    console.log("🔍 [Middleware] Path:", path);

    // ============================================
    // 0. ✅ ریدایرکت ریشه (/) به /news
    // ============================================
    if (path === "/") {
        console.log("🔄 [Middleware] Redirecting root to /news");
        return NextResponse.redirect(new URL("/news", request.url));
    }

    // ============================================
    // 1. بررسی مسیرهای استاتیک (نیاز به بررسی ندارن)
    // ============================================
    if (STATIC_PATHS.some((p) => path.startsWith(p))) {
        return NextResponse.next();
    }

    // ============================================
    // 2. بررسی مسیرهای API عمومی (نیاز به لاگین ندارن)
    // ============================================
    if (PUBLIC_API_PATHS.some((p) => path.startsWith(p))) {
        return NextResponse.next();
    }

    // ============================================
    // 3. دریافت کاربر از توکن
    // ============================================
    const token = request.cookies.get("auth-token")?.value;
    const user = token ? getUserFromToken(token) : null;
    const isAuthenticated = !!user;
    const userRole = user?.role || null;
    const isActive = user?.is_active !== false; // ✅ بررسی وضعیت فعال بودن

    console.log(
        `🔍 [Middleware] Auth: ${isAuthenticated}, Role: ${userRole}, Active: ${isActive}, Path: ${path}`,
    );

    // ============================================
    // 4. ✅ مسیر /news همیشه قابل دسترس باشه (چه لاگین چه نباشه)
    // ============================================
    const isNewsPath = NEWS_PATHS.some(
        (p) => path === p || path.startsWith(p + "/"),
    );

    if (isNewsPath) {
        console.log("✅ [Middleware] News path, allowing access");
        return NextResponse.next();
    }

    // ============================================
    // 5. بررسی مسیرهای عمومی (لاگین، ثبت‌نام، etc.)
    // ============================================
    const isPublicPath = PUBLIC_PATHS.some(
        (p) => path === p || path.startsWith(p + "/"),
    );

    // اگر کاربر لاگین کرده و در صفحه عمومی است -> هدایت به داشبورد
    if (isAuthenticated && isPublicPath) {
        console.log(
            "🔄 [Middleware] Authenticated user on public page, redirecting to dashboard",
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // اگر کاربر لاگین نکرده و در صفحه محافظت شده است -> هدایت به لاگین
    if (!isAuthenticated && !isPublicPath) {
        console.log(
            "🔄 [Middleware] Unauthenticated user, redirecting to login",
        );
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    // ============================================
    // 6. ✅ بررسی وضعیت کاربر (فعال/غیرفعال)
    // ============================================
    // اگر کاربر غیرفعال است و به مسیرهای ممنوعه می‌رود
    if (isAuthenticated && !isActive) {
        console.log(`⚠️ [Middleware] Inactive user trying to access: ${path}`);

        // ✅ بررسی مسیرهای ممنوعه برای کاربر غیرفعال
        const isRestricted = RESTRICTED_FOR_INACTIVE.some(
            (p) => path === p || path.startsWith(p + "/"),
        );

        if (isRestricted) {
            console.log(
                "🚫 [Middleware] Inactive user blocked from restricted path",
            );

            // اگر درخواست API است، خطای 403 برگردان
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

            // اگر صفحه وب است، به صفحه داشبورد با پیام غیرفعال هدایت کن
            const response = NextResponse.redirect(
                new URL("/dashboard?deactivated=true", request.url),
            );
            return response;
        }

        // ✅ اجازه دسترسی به مسیرهای مجاز (فقط خواندنی)
        const isAllowed = ALLOWED_FOR_INACTIVE.some(
            (p) => path === p || path.startsWith(p.replace("*", "")),
        );

        if (isAllowed) {
            console.log(
                "✅ [Middleware] Inactive user allowed to read-only path",
            );
            // اضافه کردن هدر برای اطلاع‌رسانی به کلاینت
            const response = NextResponse.next();
            response.headers.set("x-user-inactive", "true");
            return response;
        }

        // اگر هیچکدام از موارد بالا نبود، به صفحه اصلی هدایت کن
        console.log("🔄 [Middleware] Inactive user redirected to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // ============================================
    // 7. بررسی مسیرهای ادمین (فقط ادمین)
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
    // 8. بررسی مسیرهای نویسنده (ادمین یا نویسنده)
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
    // 9. اجازه دسترسی نهایی
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
