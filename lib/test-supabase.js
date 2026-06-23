// lib/test-supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseAnonKey);

export async function testConnection() {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .limit(1);

        if (error) {
            return {
                success: false,
                error: error.message,
                details: error,
            };
        }

        return {
            success: true,
            data: data,
            message: "Connection successful!",
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
            stack: err.stack,
        };
    }
}
