// lib/auth/jwt.js
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-me";

export function signToken(payload) {
    console.log("🔍 [JWT] Signing token for:", payload.username || payload.id);
    try {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
        console.log("✅ [JWT] Token signed successfully");
        return token;
    } catch (error) {
        console.error("❌ [JWT] Error signing token:", error.message);
        throw error;
    }
}

export function verifyToken(token) {
    console.log("🔍 [JWT] Verifying token...");
    try {
        // برای محیط توسعه، فقط دیکد میکنیم (بدون تأیید امضا)
        if (process.env.NODE_ENV === "development") {
            const decoded = jwtDecode(token);
            console.log(
                "✅ [JWT] Token decoded (development):",
                decoded.username || decoded.id,
            );
            return decoded;
        }

        // در محیط تولید، امضا رو هم چک میکنیم
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(
            "✅ [JWT] Token verified for:",
            decoded.username || decoded.id,
        );
        return decoded;
    } catch (error) {
        console.error("❌ [JWT] Token verification failed:", error.message);
        return null;
    }
}

export function decodeToken(token) {
    console.log("🔍 [JWT] Decoding token...");
    try {
        const decoded = jwtDecode(token);
        console.log(
            "✅ [JWT] Token decoded for:",
            decoded?.username || decoded?.id,
        );
        return decoded;
    } catch (error) {
        console.error("❌ [JWT] Decoding failed:", error.message);
        return null;
    }
}
