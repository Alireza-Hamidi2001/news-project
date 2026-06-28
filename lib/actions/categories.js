// lib/actions/categories.js
"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function getAllCategories() {
    try {
        const { data, error } = await supabaseAdmin
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching categories:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        return [];
    }
}
