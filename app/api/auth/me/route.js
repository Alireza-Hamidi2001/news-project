import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { password_hash, ...safeUser } = user;

        return NextResponse.json({
            success: true,
            user: safeUser,
        });
    } catch (error) {
        console.error("❌ [API Me] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to get user" },
            { status: 500 },
        );
    }
}
