import { createHmac, timingSafeEqual } from "crypto";

const SECRET_KEY =
    process.env.JWT_SECRET || "my-super-secret-key-change-this-in-production";

function base64urlToBase64(base64url) {
    return base64url.replace(/-/g, "+").replace(/_/g, "/");
}

function base64ToBase64url(base64) {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function signToken(payload) {
    // ----------------------------
    // ----------------------------
    console.log("🔍 [JWT] Signing token for:", payload.username || payload.id);
    console.log(
        "🔍 [JWT] Payload:",
        JSON.stringify(
            {
                id: payload.id,
                username: payload.username,
                email: payload.email,
                role: payload.role,
            },
            null,
            2,
        ),
    );
    // ----------------------------
    // ----------------------------
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const payloadWithExp = {
        ...payload,
        iat: now,
        exp: now + 7 * 24 * 60 * 60,
    };

    const encodedHeader = base64ToBase64url(
        Buffer.from(JSON.stringify(header)).toString("base64"),
    );
    const encodedPayload = base64ToBase64url(
        Buffer.from(JSON.stringify(payloadWithExp)).toString("base64"),
    );

    const signature = createHmac("sha256", SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64");
    const encodedSignature = base64ToBase64url(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export function verifyToken(token) {
    try {
        const [encodedHeader, encodedPayload, encodedSignature] =
            token.split(".");

        const expectedSignature = createHmac("sha256", SECRET_KEY)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest("base64");
        const expectedEncodedSignature = base64ToBase64url(expectedSignature);

        const signatureBuffer = Buffer.from(encodedSignature, "utf8");
        const expectedBuffer = Buffer.from(expectedEncodedSignature, "utf8");

        if (signatureBuffer.length !== expectedBuffer.length) return null;
        if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

        const payloadJson = Buffer.from(
            base64urlToBase64(encodedPayload),
            "base64",
        ).toString("utf8");
        const payload = JSON.parse(payloadJson);

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) return null;

        return payload;
    } catch (error) {
        console.error("❌ [JWT] Verification failed:", error.message);
        return null;
    }
}

export function decodeToken(token) {
    try {
        const [, encodedPayload] = token.split(".");
        const payloadJson = Buffer.from(
            base64urlToBase64(encodedPayload),
            "base64",
        ).toString("utf8");
        return JSON.parse(payloadJson);
    } catch (error) {
        console.error("❌ [JWT] Decoding failed:", error.message);
        return null;
    }
}
