import {
    createWriter,
    getAllWriters,
    isAdmin,
    getCurrentUser,
} from "@/lib/auth/auth";
import { NextResponse } from "next/server";

// GET all writers (admin only)
export async function GET() {
    try {
        const writers = await getAllWriters();
        return NextResponse.json({ writers });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}

// POST create new writer (admin only)
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, full_name, username } = body;

        if (!email || !password || !full_name || !username) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 },
            );
        }

        const user = await createWriter({
            email,
            password,
            full_name,
            username,
        });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}
