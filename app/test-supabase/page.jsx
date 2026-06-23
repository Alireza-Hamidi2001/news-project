// app/test-supabase/page.jsx
import { testConnection } from "@/lib/test-supabase";

export default async function TestSupabasePage() {
    let result;
    try {
        result = await testConnection();
    } catch (error) {
        result = {
            success: false,
            error: error.message,
            stack: error.stack,
        };
    }

    return (
        <div className="p-10 max-w-2xl mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4 text-white">
                Supabase Connection Test
            </h1>

            <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <h2 className="text-sm font-semibold text-gray-400 mb-2">
                    Environment Variables:
                </h2>
                <pre className="text-xs text-gray-300">
                    URL:{" "}
                    {process.env.NEXT_PUBLIC_SUPABASE_URL
                        ? "✅ Set"
                        : "❌ Missing"}
                    {"\n"}
                    Key:{" "}
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                        ? "✅ Set"
                        : "❌ Missing"}
                </pre>
            </div>

            <div
                className={`p-4 rounded-lg ${
                    result.success ? "bg-green-900/50" : "bg-red-900/50"
                }`}
            >
                <h2 className="text-lg font-semibold mb-2 text-white">
                    {result.success ? "✅ Success" : "❌ Failed"}
                </h2>
                <pre className="whitespace-pre-wrap text-sm text-gray-300">
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>
        </div>
    );
}
