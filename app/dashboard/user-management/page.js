// app/dashboard/User-management/page.jsx
import UserManagementClient from "@/app/_components/UserManagementClient";
import { getCurrentUser } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

// ✅ تابع دریافت همه کاربران (فقط برای ادمین)
async function getAllUsers() {
    try {
        const user = await getCurrentUser();

        // فقط ادمین دسترسی دارد
        if (!user || user.role !== "admin") {
            return { users: [], error: "Unauthorized" };
        }

        const { data: users, error } = await supabaseAdmin
            .from("users")
            .select(
                `
                id,
                full_name,
                email,
                role,
                is_active,
                created_at,
                last_login,
                avatar_url
            `,
            )
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching users:", error);
            return { users: [], error: error.message };
        }

        return { users: users || [] };
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return { users: [], error: error.message };
    }
}

export default async function UserManagementPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    if (currentUser.role !== "admin") {
        redirect("/dashboard");
    }

    const result = await getAllUsers();

    return (
        <UserManagementClient
            initialUsers={result.users || []}
            currentUserId={currentUser.id}
        />
    );
}
