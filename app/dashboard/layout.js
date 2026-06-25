// app/dashboard/layout.jsx
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import LogoutButton from "../_components/LogoutButton";
import DashboardSideNavigation from "../_components/DashboardSideNavigation";

async function DashboardLayout({ children }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const isAdmin = user.role === "admin";
    const isWriter = user.role === "writer";

    return (
        <div className="mt-20 grid grid-cols-[25rem_1fr] min-h-[calc(100vh-5rem)]">
            <DashboardSideNavigation
                isAdmin={isAdmin}
                isWriter={isWriter}
                user={user}
            />
            <main className="p-8 dark:bg-zinc-900">{children}</main>
        </div>
    );
}

export default DashboardLayout;
