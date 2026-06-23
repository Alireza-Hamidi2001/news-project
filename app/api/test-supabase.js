// app/api/test-supabase/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing environment variables",
                    url: supabaseUrl ? "Set" : "Missing",
                    key: supabaseAnonKey ? "Set" : "Missing",
                },
                { status: 500 },
            );
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .limit(1);

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                    details: error,
                },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            data: data,
            message: "Connection successful!",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                stack: error.stack,
            },
            { status: 500 },
        );
    }
}
