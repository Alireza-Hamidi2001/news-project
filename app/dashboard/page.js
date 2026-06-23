// app/dashboard/page.jsx
import { getCurrentUser } from "@/lib/auth/auth";

async function DashboardPage() {
    const user = await getCurrentUser();

    return (
        <div className="bg-emerald-700 dark:bg-emerald-900 rounded-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">
                Welcome, {user?.full_name}!
            </h1>
            <p className="text-emerald-100">
                You are logged in as <strong>{user?.role}</strong>
            </p>
            <p className="text-emerald-100 mt-2">Email: {user?.email}</p>
            <p className="text-emerald-100 mt-2">Username: {user?.username}</p>
        </div>
    );
}

export default DashboardPage;
