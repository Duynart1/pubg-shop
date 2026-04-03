'use client';

import Link from "next/link";
import { Home, Phone } from "lucide-react";

export default function ContactWidget() {
    return (
        <>
            {/* Định nghĩa hiệu ứng chuông reo (Pop nhẹ + Rung) */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes phone-ring {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          10% { transform: translateY(-6px) scale(1.1); } /* Bật lên và to ra nhẹ */
          15% { transform: translateY(-6px) scale(1.1) rotate(-15deg); } /* Bắt đầu rung */
          20% { transform: translateY(-6px) scale(1.1) rotate(15deg); }
          25% { transform: translateY(-6px) scale(1.1) rotate(-15deg); }
          30% { transform: translateY(-6px) scale(1.1) rotate(15deg); }
          35% { transform: translateY(-6px) scale(1.1) rotate(0deg); } /* Dừng rung */
          45% { transform: translateY(0) scale(1); } /* Thu về bình thường */
          /* Từ 45% đến 100% là khoảng nghỉ chờ lặp lại */
        }
        .animate-phone-ring {
          animation: phone-ring 2.5s infinite;
        }
      `}} />

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-[#242424] text-white px-6 py-2.5 rounded-full flex items-center justify-between gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-gray-700/50 backdrop-blur-md">

                    {/* HOME */}
                    <Link href="/" className="flex flex-col items-center gap-1 group">
                        <div className="w-8 h-8 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                            <Home className="w-6 h-6 text-[#00a8ff]" fill="currentColor" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Home</span>
                    </Link>

                    {/* INBOX (Messenger) */}
                    <a href="https://www.facebook.com/thevan2512" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 shadow-inner bg-white">
                            <img src="/logo-messenger.jpg" alt="Messenger" className="w-full h-full object-cover scale-110" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Inbox</span>
                    </a>

                    {/* ZALO */}
                    <a href="https://zalo.me/0398938686" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 shadow-inner bg-white">
                            <img src="/logo-zalo.png" alt="Zalo" className="w-full h-full object-cover p-0.5" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Zalo</span>
                    </a>

                    {/* GỌI NGAY - Áp dụng class rung */}
                    <a href="tel:0398938686" className="flex flex-col items-center gap-1 group">
                        <div className="w-8 h-8 rounded-full bg-[#ff3838] flex items-center justify-center shadow-[0_0_15px_rgba(255,56,56,0.4)] animate-phone-ring">
                            <Phone className="w-4 h-4 text-white" fill="currentColor" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Gọi Ngay</span>
                    </a>

                </div>
            </div>
        </>
    );
}