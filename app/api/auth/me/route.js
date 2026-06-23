// app/api/auth/me/route.js
import { getCurrentUser } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("🔍 [API Me] Getting current user...");

    try {
        const user = await getCurrentUser();

        if (!user) {
            console.log("ℹ️ [API Me] No user found");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        console.log("✅ [API Me] User found:", user.username);
        return NextResponse.json({ user });
    } catch (error) {
        console.error("❌ [API Me] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to get user" },
            { status: 500 },
        );
    }
}
