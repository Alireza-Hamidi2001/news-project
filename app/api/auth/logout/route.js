// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth/cookies";

export async function POST() {
    console.log("🔍 [API Logout] Received logout request");
    try {
        await removeAuthCookie(); // عملیات حذف در اینجا انجام می‌شود
        console.log("✅ [API Logout] Logout successful");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ [API Logout] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Logout failed" },
            { status: 500 },
        );
    }
}
