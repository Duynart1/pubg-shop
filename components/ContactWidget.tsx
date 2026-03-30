// components/ContactWidget.tsx
'use client';

import { Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactWidget() {
    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-5">

            {/* Nút Gọi Hotline (Đỏ) */}
            <Link href="tel:0398938686" className="relative group flex items-center">
                {/* Hiệu ứng sóng âm lan tỏa */}
                <div className="absolute -inset-2 bg-[#ff3838] rounded-full animate-ping opacity-30"></div>
                {/* Nút chính */}
                <div className="relative bg-gradient-to-br from-[#ff5e5e] to-[#ff3838] text-white p-3.5 rounded-full shadow-[0_0_20px_rgba(255,56,56,0.6)] flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Phone className="w-6 h-6 animate-pulse" />
                </div>
                {/* Nhãn thông báo ẩn (Hiện khi hover) */}
                <span className="absolute left-16 bg-white dark:bg-[#121214] text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-gray-100 dark:border-zinc-800">
                    Hotline: <span className="text-[#ff3838]">0398.93.86.86</span>
                </span>
            </Link>

            {/* Nút Chat Zalo (Xanh) */}
            <Link href="https://zalo.me/0398938686" target="_blank" className="relative group flex items-center">
                {/* Hiệu ứng sóng âm lan tỏa */}
                <div className="absolute -inset-2 bg-[#00a8ff] rounded-full animate-ping opacity-30"></div>
                {/* Nút chính */}
                <div className="relative bg-gradient-to-br from-[#00d8ff] to-[#00a8ff] text-white p-3.5 rounded-full shadow-[0_0_20px_rgba(0,168,255,0.6)] flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <MessageCircle className="w-6 h-6 animate-pulse" />
                </div>
                {/* Nhãn thông báo ẩn (Hiện khi hover) */}
                <span className="absolute left-16 bg-white dark:bg-[#121214] text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-gray-100 dark:border-zinc-800">
                    Chat Zalo <span className="text-[#00a8ff]">Hỗ Trợ 24/7</span>
                </span>
            </Link>

        </div>
    );
}