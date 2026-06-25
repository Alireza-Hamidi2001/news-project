// این فایل فقط برای Middleware استفاده میشه و از crypto استفاده نمیکنه
// چون Edge Runtime از crypto پشتیبانی نمیکنه

export function getUserFromToken(token) {
    if (!token) return null;

    try {
        // فقط دیکد کردن بدون verification (چون نمیتونیم crypto رو توی Edge استفاده کنیم)
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const [, encodedPayload] = parts;
        if (!encodedPayload) return null;

        // تبدیل base64url به base64
        const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");

        // دیکد کردن payload
        const payloadJson = Buffer.from(base64, "base64").toString("utf8");
        const payload = JSON.parse(payloadJson);

        // بررسی انقضا (با زمان فعلی)
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) return null;

        return payload;
    } catch (error) {
        console.error("❌ [Middleware] Token decode error:", error.message);
        return null;
    }
}

// تابع ساده برای چک کردن اینکه کاربر لاگین هست یا نه
export function isAuthenticated(request) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return false;

    const user = getUserFromToken(token);
    return !!user;
}

// تابع برای گرفتن نقش کاربر از توکن (بدون کوئری به دیتابیس)
export function getUserRoleFromToken(request) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return null;

    const user = getUserFromToken(token);
    return user?.role || null;
}
