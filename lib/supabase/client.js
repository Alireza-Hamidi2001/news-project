// lib/supabase/client.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 [Supabase Client] URL exists:", !!supabaseUrl);
console.log("🔍 [Supabase Client] Key exists:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ [Supabase Client] Missing environment variables!");
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("✅ [Supabase Client] Client created successfully");
