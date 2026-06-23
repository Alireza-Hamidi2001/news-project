// app/_components/ThemeProvider.jsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div style={{ visibility: "hidden", display: "contents" }}>
                {children}
            </div>
        );
    }

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            storageKey="theme"
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
