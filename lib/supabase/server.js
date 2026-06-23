// lib/supabase/server.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 [Supabase Server] URL exists:", !!supabaseUrl);
console.log("🔍 [Supabase Server] Key exists:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ [Supabase Server] Missing environment variables!");
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("✅ [Supabase Server] Client created successfully");
