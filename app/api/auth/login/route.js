// app/api/auth/login/route.js
import { loginUser } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 },
            );
        }

        const result = await loginUser(username, password);

        return NextResponse.json({
            success: true,
            user: result.user,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Login failed" },
            { status: 401 },
        );
    }
}
