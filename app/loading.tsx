import React from 'react';
import { Crosshair } from 'lucide-react';

export default function LoadingGaming() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-[#0a0a0c] rounded-2xl border border-zinc-800 shadow-[0_0_40px_rgba(0,168,255,0.08)] my-8 relative overflow-hidden">

            {/* Hiệu ứng tia sáng nền lướt qua (giống radar) */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,168,255,0.4)_0%,transparent_70%)] animate-pulse"></div>

            {/* Cụm Vòng bo ngắm bắn */}
            <div className="relative flex items-center justify-center mb-8 z-10">
                {/* Vòng ngoài xoay thuận - Màu xanh The Van */}
                <div className="absolute w-28 h-28 border-4 border-[#00a8ff] rounded-full border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '2s' }}></div>

                {/* Vòng trong xoay ngược - Màu đỏ cảnh báo cực ngầu */}
                <div className="absolute w-20 h-20 border-4 border-red-500 rounded-full border-l-transparent border-r-transparent animate-spin shadow-[0_0_15px_rgba(239,68,68,0.5)]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>

                {/* Tâm ngắm Lucide React ở giữa chớp nháy */}
                <Crosshair className="w-10 h-10 text-[#00a8ff] animate-pulse" />
            </div>

            {/* Chữ text Gaming phong cách Hologram */}
            <div className="z-10 flex flex-col items-center">
                <h2 className="text-2xl font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-[#00a8ff] via-white to-[#00a8ff] text-transparent bg-clip-text animate-pulse">
                    Đang quét Radar...
                </h2>
                <p className="mt-3 text-zinc-400 text-sm animate-bounce tracking-wide font-medium">
                    Đang dò tìm Acc VIP cho Boss... 🎯
                </p>
            </div>

        </div>
    );
}