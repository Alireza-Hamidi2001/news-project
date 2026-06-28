// // lib/auth/middleware-utils.js
// // ✅ این فایل برای Middleware در Edge Runtime بهینه شده است
// // ✅ از Web API ها استفاده می‌کند، نه Node.js API ها

// // ============================================
// // ✅ تابع دیکد کردن Base64URL (استاندارد JWT)
// // ============================================
// function base64UrlDecode(str) {
//     try {
//         // تبدیل base64url به base64 استاندارد
//         let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

//         // اضافه کردن padding اگر لازم باشد
//         while (base64.length % 4) {
//             base64 += "=";
//         }

//         // دیکد کردن با استفاده از atob (Web API)
//         const decoded = atob(base64);
//         return decoded;
//     } catch (error) {
//         console.error("❌ [Middleware] Base64 decode error:", error.message);
//         return null;
//     }
// }

// // ============================================
// // ✅ استخراج کاربر از توکن (بدون crypto)
// // ============================================
// export function getUserFromToken(token) {
//     if (!token) return null;

//     try {
//         // فقط دیکد کردن بدون verification (چون نمیتونیم crypto رو توی Edge استفاده کنیم)
//         const parts = token.split(".");
//         if (parts.length !== 3) return null;

//         const [, encodedPayload] = parts;
//         if (!encodedPayload) return null;

//         // دیکد کردن payload با استفاده از Web API
//         const decodedPayload = base64UrlDecode(encodedPayload);
//         if (!decodedPayload) return null;

//         const payload = JSON.parse(decodedPayload);

//         // بررسی انقضا (با زمان فعلی)
//         const now = Math.floor(Date.now() / 1000);
//         if (payload.exp && payload.exp < now) {
//             console.log("ℹ️ [Middleware] Token expired");
//             return null;
//         }

//         return payload;
//     } catch (error) {
//         console.error("❌ [Middleware] Token decode error:", error.message);
//         return null;
//     }
// }

// // ============================================
// // ✅ تابع ساده برای چک کردن اینکه کاربر لاگین هست یا نه
// // ============================================
// export function isAuthenticated(request) {
//     const token = request.cookies.get("auth-token")?.value;
//     if (!token) return false;

//     const user = getUserFromToken(token);
//     return !!user;
// }

// // ============================================
// // ✅ تابع برای گرفتن نقش کاربر از توکن
// // ============================================
// export function getUserRoleFromToken(request) {
//     const token = request.cookies.get("auth-token")?.value;
//     if (!token) return null;

//     const user = getUserFromToken(token);
//     return user?.role || null;
// }

// // ============================================
// // ✅ تابع برای گرفتن وضعیت فعال بودن کاربر
// // ============================================
// export function getUserActiveStatus(request) {
//     const token = request.cookies.get("auth-token")?.value;
//     if (!token) return true;

//     const user = getUserFromToken(token);
//     return user?.is_active !== false;
// }
