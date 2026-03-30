// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Tránh lỗi Hydration của Next.js khi render UI lần đầu
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            // ĐÃ CHUYỂN TỌA ĐỘ: Sang phải (right-6) và nằm ngay trên nút cuộn lên đầu trang (bottom-24)
            className="fixed bottom-24 right-6 p-3.5 bg-white dark:bg-[#121214] border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.4)] transition-all duration-300 z-50 group hover:-translate-y-1 hover:border-[#00a8ff] dark:hover:border-[#00a8ff]"
            aria-label="Chuyển đổi giao diện Sáng/Tối"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-transform duration-500" />
            ) : (
                <Moon className="w-5 h-5 text-[#00a8ff] group-hover:-rotate-12 transition-transform duration-500" />
            )}
        </button>
    );
}