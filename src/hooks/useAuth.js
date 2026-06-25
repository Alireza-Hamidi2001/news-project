// hooks/useAuth.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                setUser(null);
                toast.success("Logged out successfully");
                router.push("/login");
                router.refresh();
            } else {
                toast.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
        }
    }, [router]);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isWriter: user?.role === "writer" || user?.role === "admin",
        hasAccess: user && (user?.role === "admin" || user?.role === "writer"),
        logout,
        refresh: fetchUser,
    };
}
