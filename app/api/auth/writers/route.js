// app/api/auth/writers/route.js
import { createWriter } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    console.log("🔍 [API Writers] Creating new writer...");

    try {
        const body = await request.json();
        const { full_name, username, email, password } = body;

        // Validation
        if (!full_name || !username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 },
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { error: "Username must be at least 3 characters" },
                { status: 400 },
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 },
            );
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 },
            );
        }

        const user = await createWriter({
            full_name,
            username,
            email,
            password,
        });

        return NextResponse.json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.error("❌ [API Writers] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to create writer" },
            { status: 500 },
        );
    }
}
