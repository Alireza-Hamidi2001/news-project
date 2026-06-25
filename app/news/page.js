import Main from "../_components/Main";
import Others from "../_components/Others";
import ScrollableCards from "../_components/ScrollableCards";
import { getNewsBySection } from "@/lib/actions/news";

export default async function NewsPage() {
    console.log("🔍 [NewsPage] Rendering news page...");

    let mainNews = [];
    let othersNews = [];
    let scrollableNews = [];
    let error = null;

    try {
        // دریافت اخبار از دیتابیس
        mainNews = await getNewsBySection("main", 3);
        othersNews = await getNewsBySection("others", 3);
        scrollableNews = await getNewsBySection("scrollable", 3);

        console.log(
            `✅ [NewsPage] main: ${mainNews?.length}, others: ${othersNews?.length}, scrollable: ${scrollableNews?.length}`,
        );
    } catch (err) {
        console.error("❌ [NewsPage] Error:", err);
        error = err.message || "Failed to load news";
    }

    // اگر خطا داشت، پیام نمایش بده
    if (error) {
        return (
            <div className="pl-68 pt-20 min-h-screen bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Failed to load news. Please try again later.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="pl-68 pt-20 min-h-screen bg-gray-100 dark:bg-zinc-800">
            <Main data={mainNews} />
            <Others data={othersNews} />
            <ScrollableCards data={scrollableNews} />
        </div>
    );
}
