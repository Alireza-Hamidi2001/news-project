// app/dashboard/pending-posts/page.jsx
import PendingPostClient from "@/app/_components/PendingPostClient";
import { getPendingPosts } from "@/lib/actions/news";
import { getCurrentUser } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function PendingPostsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "admin") {
        redirect("/dashboard");
    }

    const result = await getPendingPosts();

    return <PendingPostClient initialPosts={result.posts || []} />;
}
