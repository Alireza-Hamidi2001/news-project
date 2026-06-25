import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth/auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json(
                { error: "Email/Username and password are required" },
                { status: 400 },
            );
        }

        const result = await loginUser(identifier, password);

        return NextResponse.json({
            success: true,
            user: result.user,
        });
    } catch (error) {
        console.error("❌ [API Login] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Login failed" },
            { status: 401 },
        );
    }
}
