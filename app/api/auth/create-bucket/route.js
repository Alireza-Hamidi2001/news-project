// app/api/auth/create-bucket/route.js
import { NextResponse } from "next/server";

// ⚠️ این کلید را فقط برای یک بار استفاده کنید و بعد از آن حذف کنید
const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key-here";

export async function GET() {
    console.log("🔍 [API Create Bucket] Creating avatars bucket...");

    try {
        // بررسی وجود کلید
        if (
            !SUPABASE_SERVICE_ROLE_KEY ||
            SUPABASE_SERVICE_ROLE_KEY === "your-service-role-key-here"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Please set SUPABASE_SERVICE_ROLE_KEY in .env.local",
                    hint: "Copy your service_role key from Supabase Dashboard > Settings > API",
                },
                { status: 400 },
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        // 1. بررسی Bucket های موجود
        const listResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
        });

        let buckets = [];
        if (listResponse.ok) {
            buckets = await listResponse.json();
            console.log(
                "📁 Existing buckets:",
                buckets.map((b) => b.name),
            );
        }

        // 2. اگر bucket وجود دارد، حذفش کن
        const existingBucket = buckets.find((b) => b.name === "avatars");
        if (existingBucket) {
            console.log("🗑️ Deleting existing bucket...");
            await fetch(`${supabaseUrl}/storage/v1/bucket/avatars`, {
                method: "DELETE",
                headers: {
                    apikey: SUPABASE_SERVICE_ROLE_KEY,
                    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                },
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // 3. ایجاد Bucket جدید
        console.log("📁 Creating new bucket...");
        const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
            method: "POST",
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "avatars",
                public: true,
                allowed_mime_types: [
                    "image/png",
                    "image/jpeg",
                    "image/gif",
                    "image/webp",
                ],
                file_size_limit: 2 * 1024 * 1024,
            }),
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error("❌ Create bucket error:", errorText);
            return NextResponse.json(
                {
                    success: false,
                    error: errorText,
                },
                { status: createResponse.status },
            );
        }

        const data = await createResponse.json();
        console.log("✅ Bucket 'avatars' created successfully!");

        return NextResponse.json({
            success: true,
            message: "Bucket 'avatars' created successfully!",
            data,
        });
    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 },
        );
    }
}
