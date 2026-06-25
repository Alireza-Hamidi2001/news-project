import { redirect } from "next/navigation";

function page() {
    redirect("/news");
    return <div className="min-h-screen"></div>;
}

export default page;
