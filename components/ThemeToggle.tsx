'use client';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed bottom-6 left-6 p-4 rounded-full z-50 transition-all duration-300 shadow-[0_0_15px_rgba(0,168,255,0.4)] dark:shadow-[0_0_15px_rgba(255,165,0,0.4)] bg-[#0a0a0c] text-[#00a8ff] dark:bg-white dark:text-orange-500 hover:-translate-y-1"
            title="Bật/Tắt chế độ ban đêm"
        >
            {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
    );
}