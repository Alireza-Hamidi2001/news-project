import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth/auth";

export async function POST() {
    try {
        await logoutUser();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ [API Logout] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Logout failed" },
            { status: 500 },
        );
    }
}
