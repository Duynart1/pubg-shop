'use client';

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { supabase } from "../lib/supabase"; // Import Supabase để quét mã đang có

// Dàn data ngẫu nhiên siêu thật (đã trộn Tên + SĐT che số + Nickname game)
const names = [
    "Hữu Tuyên", "Tiến Thực", "Hữu Đạt", "Việt Phúc", "Nguyễn Minh Vũ", "Minh Thư",
    "098***1254", "Thế Trường", "Phan Quốc Thế", "Thái Lê", "Lê Hồng Vương", "035***8899",
    "Đậu Tuấn Anh", "Ngọc Mai", "Ngọc Châu", "Huỳnh Phục", "Minh Độ", "Hoàn Tân",
    "091***6677", "Nam Giang", "Minh Nam", "Phạm Quốc Tuấn", "Lê Quang Minh", "Hoài Nam",
    "086***1102", "Ái Vi", "Ân Lighris", "Anh Nguyễn", "Nam Hải", "Văn Trọng",
    "Bình An Foods", "033***4567", "Bình Nguyễn", "Bơ", "Bimxinhshop", "Cô Huyền Đáng Yêu",
    "Congdanh", "Cong Tru", "097***0022", "Chkiet", "Danh", "Đặng Quân", "Diễn",
    "Đỗ Văn Định", "081***2233", "Đoàn Minh Anh", "Dương Kỳ Minh", "Hoàng Anh", "Gia Linh",
    "Hải", "090***6781", "Hà Phương", "Phương Vỹ", "Tuấn Long", "Hnguyen",
    "Hồ Thị Kiều Oanh", "077***9988", "Kiều My", "Lê Đăng Huy", "Lê Anh Lương", "Mỹ Tâm",
    "Như Lê", "038***2468", "Quý Đạtt", "Quynh Trm", "Duy Nart", "ProPlayer_99",
    "Thành Rambo", "094***5566", "Bảo Nam", "Quốc Bảo", "Tuấn Khỉ", "Mạnh Dũng", "Khánh Sky",
    "Long Tứ", "070***1122", "Thanh Tùng", "Cường Vũ", "088***3344", "Gia Khánh"
];

// Các hành động đa dạng hơn, kích thích FOMO
const actions = [
    "🛒 vừa chốt đơn qua Zalo",
    "⚡ đã chuyển khoản cọc thành công",
    "💸 vừa thanh toán qua Momo",
    "🔥 đã múc ngay Nick VIP",
    "🤝 vừa giao dịch qua Trung Gian",
    "💳 đã mua thành công qua ATM",
    "💎 vừa hốt kèo thơm",
    "🚀 vừa chốt acc ngon",
    "💰 đã thanh toán 100%",
    "👑 đã hốt ngay Nick X-Suit",
    "📩 vừa chốt đơn qua Fanpage",
    "🎯 vừa giao dịch thành công"
];

// Giá tiền đa dạng hơn, có các mức giá lẻ cho thực tế
const prices = [
    "500k", "800k", "1m", "1m2", "1m3", "1m5", "1m8", "2m", "2m2", "2m5", "2m8",
    "3m", "3m5", "3m8", "4m", "4m1", "4m3", "4m5", "4m6", "5m", "5m5", "6m",
    "6m1", "6m5", "7m", "7m3", "7m5", "7m8", "8m", "9m", "9m5", "10m", "11m",
    "12m", "13m", "15m", "18m", "22m", "25m", "42m", "65m", "110m", "145m", "160m", "195m"
];

// Thời gian
const times = [
    "Vài giây trước", "Vừa xong", "1 phút trước", "2 phút trước", "3 phút trước",
    "5 phút trước", "7 phút trước", "8 phút trước", "10 phút trước",
    "12 phút trước", "15 phút trước", "18 phút trước", "20 phút trước"
];

export default function LiveSalesToast() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSale, setCurrentSale] = useState<any>(null);
    const [activeAccs, setActiveAccs] = useState<Set<string>>(new Set());

    // 1. Quét kho dữ liệu để lấy danh sách CÁC MÃ ACC ĐANG CÓ TRÊN WEB
    useEffect(() => {
        const fetchActiveAccs = async () => {
            const { data } = await supabase.from("pubg_accounts").select("ma_acc");
            if (data) {
                // Lưu tất cả mã acc đang có vào một tập hợp (Set)
                const accSet = new Set(data.map(item => String(item.ma_acc)));
                setActiveAccs(accSet);
            }
        };
        fetchActiveAccs();
    }, []);

    // 2. Vòng lặp chim mồi (Mỗi 15 giây)
    useEffect(() => {
        const showInterval = setInterval(() => {
            // THUẬT TOÁN NÉ TRÙNG LẶP: Sinh mã acc ngẫu nhiên 4 chữ số (1000 - 9999)
            let randomAcc = "";
            do {
                randomAcc = Math.floor(1000 + Math.random() * 9000).toString();
            } while (activeAccs.has(randomAcc)); // Nếu vô tình trùng mã đang có trên web -> Quay lại sinh mã khác

            // Trộn data ngẫu nhiên
            const name = names[Math.floor(Math.random() * names.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const price = prices[Math.floor(Math.random() * prices.length)];
            const time = times[Math.floor(Math.random() * times.length)];

            setCurrentSale({ name, action, acc: randomAcc, price, time });
            setIsVisible(true);

            // Hiện 4.5 giây rồi tắt (để khách kịp đọc)
            setTimeout(() => {
                setIsVisible(false);
            }, 4500);
        }, 15000);

        return () => clearInterval(showInterval);
    }, [activeAccs]); // Phụ thuộc vào danh sách activeAccs

    if (!currentSale) return null;

    return (
        <div
            className={`fixed z-[100] transition-all duration-500 ease-out transform 
            /* GIAO DIỆN MOBILE: Ở giữa, cách đáy 24 (tránh thanh Contact) */
            bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[350px]
            /* GIAO DIỆN DESKTOP: Góc dưới trái */
            md:bottom-6 md:left-6 md:translate-x-0 md:w-auto
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}
        >
            <div className="bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border border-green-200 dark:border-green-900/50 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(34,197,94,0.1)] flex items-start gap-4 relative overflow-hidden group">

                {/* Ánh sáng chạy ngang ngầm */}
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-[-25deg] animate-[shimmer_2s_infinite]"></div>

                {/* Icon */}
                <div className="bg-green-100 dark:bg-green-500/20 p-2.5 rounded-full text-green-600 dark:text-green-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5 animate-pulse" />
                </div>

                {/* Nội dung */}
                <div className="text-sm pr-4">
                    <p className="text-gray-600 dark:text-zinc-400 font-medium">
                        Khách <span className="font-extrabold text-gray-900 dark:text-white">{currentSale.name}</span> {currentSale.action}
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-zinc-200 mt-0.5">
                        Acc mã <span className="text-[#00a8ff] font-bold">#{currentSale.acc}</span> • Giá <span className="text-[#ff3838] font-bold">{currentSale.price}</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 font-medium italic">
                        {currentSale.time}
                    </p>
                </div>

                {/* Nút tắt sớm */}
                <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors">
                    <X className="w-4 h-4" />
                </button>

            </div>
        </div>
    );
}