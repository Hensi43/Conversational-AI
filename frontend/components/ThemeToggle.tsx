"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 transition-colors duration-300 flex items-center gap-2"
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    );
}
