/** @type {import('next').NextConfig} */
const nextConfig = {
    // ترجمه پکیج‌های خاص برای کار با Next.js
    transpilePackages: ["next-themes"],

    // فعال کردن تصاویر از دامنه‌های خارجی (اگر از Supabase Storage استفاده می‌کنی)
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
            // اگر از دامنه دیگه‌ای استفاده می‌کنی اضافه کن
            // مثلاً برای آواتارها یا تصاویر خبری
        ],
    },
};

export default nextConfig;
