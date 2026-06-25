import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials in environment");
    console.error(
        "NEXT_PUBLIC_SUPABASE_URL:",
        supabaseUrl ? "✅ Set" : "❌ Missing",
    );
    console.error(
        "SUPABASE_SERVICE_ROLE_KEY:",
        supabaseServiceKey ? "✅ Set" : "❌ Missing",
    );
    process.exit(1);
}

console.log("✅ Supabase URL found:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function hashExistingPasswords() {
    console.log("🔄 Starting to hash existing passwords...");

    // گرفتن همه کاربران
    const { data: users, error } = await supabase
        .from("users")
        .select("id, email, username, password_hash");

    if (error) {
        console.error("❌ Error fetching users:", error);
        return;
    }

    console.log(`📊 Found ${users.length} users`);

    let updated = 0;
    let skipped = 0;

    for (const user of users) {
        // اگر رمز هش شده نیست (طول 64 کاراکتر نیست)
        if (user.password_hash && user.password_hash.length !== 64) {
            const hashedPassword = createHash("sha256")
                .update(user.password_hash)
                .digest("hex");

            const { error: updateError } = await supabase
                .from("users")
                .update({ password_hash: hashedPassword })
                .eq("id", user.id);

            if (updateError) {
                console.error(
                    `❌ Failed to update user ${user.email || user.username}:`,
                    updateError,
                );
            } else {
                console.log(
                    `✅ Updated: ${
                        user.email || user.username
                    } → ${hashedPassword.substring(0, 20)}...`,
                );
                updated++;
            }
        } else {
            console.log(
                `⏭️ Skipped: ${
                    user.email || user.username
                } (already hashed or no password)`,
            );
            skipped++;
        }
    }

    console.log(`✅ Done! Updated: ${updated}, Skipped: ${skipped}`);
}

// اجرا کردن
hashExistingPasswords();
