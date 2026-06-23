// lib/auth/auth.js
import { signToken, verifyToken } from "./jwt";
import {
    setAuthCookie,
    getAuthCookie,
    removeAuthCookie,
    getAuthCookieFromRequest,
} from "./cookies";
import { supabase } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

console.log("🔍 [Auth] Module loaded");

// ============================================
// Login user with username and password
// ============================================
// lib/auth/auth.js - قسمت loginUser رو با این عوض کن

// lib/auth/auth.js
export async function loginUser(username, password) {
    console.log("🔍 [Auth.loginUser] Starting login process...");
    console.log(`🔍 [Auth.loginUser] Username: "${username}"`);
    console.log(`🔍 [Auth.loginUser] Password length: ${password?.length || 0}`);

    try {
        // 1. پیدا کردن کاربر
        console.log("🔍 [Auth.loginUser] Step 1: Querying Supabase for user...");
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .maybeSingle();

        console.log("🔍 [Auth.loginUser] Query result - user found:", !!user);
        console.log("🔍 [Auth.loginUser] Query result - error:", error?.message || "None");

        if (error || !user) {
            console.error("❌ [Auth.loginUser] User not found or query error");
            throw new Error("Invalid username or password");
        }

        console.log("✅ [Auth.loginUser] User found:", {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            is_active: user.is_active,
        });

        // 2. بررسی فعال بودن کاربر
        console.log("🔍 [Auth.loginUser] Step 2: Checking if user is active...");
        if (!user.is_active) {
            console.error("❌ [Auth.loginUser] User is inactive");
            throw new Error("Account is disabled. Please contact support.");
        }
        console.log("✅ [Auth.loginUser] User is active");

        // 3. تطابق رمز عبور
        console.log("🔍 [Auth.loginUser] Step 3: Verifying password...");
        console.log(`🔍 [Auth.loginUser] Password from input: "${password}"`);
        console.log(`🔍 [Auth.loginUser] Password from DB: "${user.password_hash}"`);
        
        const isValid = await verifyPassword(password, user.password_hash);
        console.log(`✅ [Auth.loginUser] Password valid: ${isValid}`);

        if (!isValid) {
            console.error("❌ [Auth.loginUser] Invalid password");
            throw new Error("Invalid username or password");
        }

        // 4. به‌روزرسانی آخرین لاگین
        console.log("🔍 [Auth.loginUser] Step 4: Updating last login...");
        const { error: updateError } = await supabase
            .from("users")
            .update({ last_login: new Date().toISOString() })
            .eq("id", user.id);
        
        if (updateError) {
            console.warn("⚠️ [Auth.loginUser] Failed to update last login:", updateError.message);
        } else {
            console.log("✅ [Auth.loginUser] Last login updated");
        }

        // 5. ساخت JWT Token
        console.log("🔍 [Auth.loginUser] Step 5: Generating JWT token...");
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            username: user.username,
            avatar_url: user.avatar_url,
        };
        console.log("🔍 [Auth.loginUser] Token payload:", { ...tokenPayload, id: user.id });
        
        const token = signToken(tokenPayload);
        console.log(`✅ [Auth.loginUser] JWT token generated: ${token ? "Yes" : "No"}`);

        // 6. ذخیره کوکی
        console.log("🔍 [Auth.loginUser] Step 6: Setting auth cookie...");
        await setAuthCookie(token);
        console.log("✅ [Auth.loginUser] Auth cookie set");

        // 7. برگرداندن اطلاعات کاربر (بدون رمز)
        console.log("✅ [Auth.loginUser] Login successful!");
        const userResponse = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            username: user.username,
            role: user.role,
            avatar_url: user.avatar_url,
        };
        console.log("🔍 [Auth.loginUser] Returning user data:", userResponse);
        
        return {
            user: userResponse,
        };

    } catch (error) {
        console.error("❌ [Auth.loginUser] Login failed:", error.message);
        console.error("❌ [Auth.loginUser] Error stack:", error.stack);
        throw new Error(error.message || "Login failed");
    }
}

// ============================================
// Get current authenticated user
// ============================================
// lib/auth/auth.js - فقط قسمت getCurrentUser رو عوض کن

export async function getCurrentUser() {
    console.log("🔍 [Auth.getCurrentUser] Getting current user...");

    try {
        const token = await getAuthCookie();
        console.log(`🔍 [Auth.getCurrentUser] Token found: ${!!token}`);

        if (!token) {
            console.log("ℹ️ [Auth.getCurrentUser] No token found, user not logged in");
            return null;
        }

        const decoded = verifyToken(token);
        console.log(`🔍 [Auth.getCurrentUser] Token verified: ${!!decoded}`);

        if (!decoded) {
            console.warn("⚠️ [Auth.getCurrentUser] Invalid token");
            return null;
        }

        // اگر توکن معتبر بود، کاربر رو از دیتابیس بگیر
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, full_name, username, role, avatar_url, is_active")
            .eq("id", decoded.id)
            .single();

        if (error || !user || !user.is_active) {
            console.warn("⚠️ [Auth.getCurrentUser] User not found or inactive");
            return null;
        }

        console.log("✅ [Auth.getCurrentUser] User retrieved successfully");
        return user;

    } catch (error) {
        console.error("❌ [Auth.getCurrentUser] Error:", error.message);
        return null;
    }
}

// ============================================
// Get current user from request (for middleware)
// ============================================
export function getCurrentUserFromRequest(request) {
    console.log(
        "🔍 [Auth.getCurrentUserFromRequest] Getting user from request...",
    );

    try {
        const token = getAuthCookieFromRequest(request);
        console.log(
            `🔍 [Auth.getCurrentUserFromRequest] Token found: ${!!token}`,
        );

        if (!token) {
            console.log(
                "ℹ️ [Auth.getCurrentUserFromRequest] No token in request",
            );
            return null;
        }

        const decoded = verifyToken(token);
        console.log(
            `🔍 [Auth.getCurrentUserFromRequest] Token decoded: ${!!decoded}`,
        );

        if (!decoded) {
            console.warn("⚠️ [Auth.getCurrentUserFromRequest] Invalid token");
            return null;
        }

        console.log(
            "✅ [Auth.getCurrentUserFromRequest] User from token:",
            decoded.username,
        );
        return {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            full_name: decoded.full_name,
            username: decoded.username,
            avatar_url: decoded.avatar_url,
        };
    } catch (error) {
        console.error(
            "❌ [Auth.getCurrentUserFromRequest] Error:",
            error.message,
        );
        return null;
    }
}

// ============================================
// Logout user
// ============================================
export async function logoutUser() {
    console.log("🔍 [Auth.logoutUser] Logging out user...");
    try {
        await removeAuthCookie();
        console.log("✅ [Auth.logoutUser] Logout successful");
        return { success: true };
    } catch (error) {
        console.error("❌ [Auth.logoutUser] Logout failed:", error.message);
        throw new Error("Logout failed");
    }
}

// ============================================
// Role checkers
// ============================================
export function isAdmin(user) {
    const result = user?.role === "admin";
    console.log(
        `🔍 [Auth.isAdmin] User role: ${user?.role}, isAdmin: ${result}`,
    );
    return result;
}

export function isWriter(user) {
    const result = user?.role === "writer" || user?.role === "admin";
    console.log(
        `🔍 [Auth.isWriter] User role: ${user?.role}, isWriter: ${result}`,
    );
    return result;
}

export function isAuthenticated(user) {
    const result = !!user;
    console.log(`🔍 [Auth.isAuthenticated] User exists: ${result}`);
    return result;
}

// ============================================
// Password utilities
// ============================================
async function hashPassword(password) {
    console.log("🔍 [Auth.hashPassword] Hashing password...");
    if (process.env.NODE_ENV === "production") {
        const hashed = await bcrypt.hash(password, 10);
        console.log("✅ [Auth.hashPassword] Password hashed (production)");
        return hashed;
    }
    console.log(
        "✅ [Auth.hashPassword] Password stored as plain text (development)",
    );
    return password;
}

async function verifyPassword(password, hashedPassword) {
    console.log("🔍 [Auth.verifyPassword] Verifying password...");
    console.log(
        `🔍 [Auth.verifyPassword] Environment: ${process.env.NODE_ENV}`,
    );

    if (process.env.NODE_ENV === "production") {
        const isValid = await bcrypt.compare(password, hashedPassword);
        console.log(
            `✅ [Auth.verifyPassword] Password valid (production): ${isValid}`,
        );
        return isValid;
    }

    const isValid = password === hashedPassword;
    console.log(
        `✅ [Auth.verifyPassword] Password valid (development): ${isValid}`,
    );
    console.log(
        `🔍 [Auth.verifyPassword] Password matches? ${
            password === hashedPassword
        }`,
    );
    return isValid;
}

// ============================================
// Create new writer (admin only)
// ============================================
export async function createWriter(data) {
    console.log("🔍 [Auth.createWriter] Creating new writer...");
    console.log("🔍 [Auth.createWriter] Data:", {
        ...data,
        password: "[REDACTED]",
    });

    try {
        const currentUser = await getCurrentUser();
        console.log(
            `🔍 [Auth.createWriter] Current user role: ${currentUser?.role}`,
        );

        if (!isAdmin(currentUser)) {
            console.error(
                "❌ [Auth.createWriter] Only administrators can create writers",
            );
            throw new Error("Only administrators can create writers");
        }

        const { email, password, full_name, username } = data;
        if (!email || !password || !full_name || !username) {
            console.error("❌ [Auth.createWriter] Missing required fields");
            throw new Error(
                "All fields are required: email, password, full_name, username",
            );
        }

        console.log("🔍 [Auth.createWriter] Checking for existing user...");
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .or(`email.eq.${email},username.eq.${username}`)
            .maybeSingle();

        if (existingUser) {
            console.error(
                "❌ [Auth.createWriter] Username or email already exists",
            );
            throw new Error("Username or email already exists");
        }

        const hashedPassword = await hashPassword(password);
        console.log("🔍 [Auth.createWriter] Inserting user into database...");

        const { data: user, error } = await supabase
            .from("users")
            .insert({
                email,
                password_hash: hashedPassword,
                full_name,
                username,
                role: "writer",
                is_active: true,
            })
            .select()
            .single();

        if (error) {
            console.error(
                "❌ [Auth.createWriter] Database error:",
                error.message,
            );
            throw new Error(`Failed to create writer: ${error.message}`);
        }

        console.log("✅ [Auth.createWriter] Writer created successfully");
        delete user.password_hash;
        return user;
    } catch (error) {
        console.error("❌ [Auth.createWriter] Failed:", error.message);
        throw new Error(error.message || "Failed to create writer");
    }
}

// ============================================
// Get all writers (admin only)
// ============================================
export async function getAllWriters() {
    console.log("🔍 [Auth.getAllWriters] Fetching all writers...");

    try {
        const currentUser = await getCurrentUser();
        console.log(
            `🔍 [Auth.getAllWriters] Current user role: ${currentUser?.role}`,
        );

        if (!isAdmin(currentUser)) {
            console.error(
                "❌ [Auth.getAllWriters] Only administrators can view writers",
            );
            throw new Error("Only administrators can view writers");
        }

        const { data, error } = await supabase
            .from("users")
            .select(
                "id, email, full_name, username, role, is_active, created_at, last_login, avatar_url",
            )
            .eq("role", "writer")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(
                "❌ [Auth.getAllWriters] Database error:",
                error.message,
            );
            throw new Error(`Failed to fetch writers: ${error.message}`);
        }

        console.log(
            `✅ [Auth.getAllWriters] Found ${data?.length || 0} writers`,
        );
        return data;
    } catch (error) {
        console.error("❌ [Auth.getAllWriters] Failed:", error.message);
        throw new Error(error.message || "Failed to fetch writers");
    }
}
