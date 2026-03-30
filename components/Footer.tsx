// components/Footer.tsx
import Link from "next/link";
import { Crown, Phone, Mail, ShieldCheck, Facebook, Youtube, Clock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[#121214] border-t border-gray-200 dark:border-zinc-800 transition-colors duration-500 pt-16 pb-8 mt-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Dàn thông tin 3 cột */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

                    {/* Cột 1: Về chúng tôi */}
                    <div className="space-y-5">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <Crown className="w-8 h-8 text-[#00a8ff] group-hover:scale-110 transition-transform" />
                            <span className="font-extrabold text-2xl tracking-tighter text-gray-900 dark:text-white">The Van PUBG</span>
                        </Link>
                        <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed pr-4">
                            Hệ thống giao dịch tài khoản PUBG Mobile uy tín, tự động và an toàn số 1 Việt Nam. Chúng tôi cam kết mang lại trải nghiệm tuyệt vời nhất cho cộng đồng game thủ.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-[#00a8ff] hover:bg-blue-600 hover:text-white dark:hover:bg-[#00a8ff] transition-all shadow-sm">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-all shadow-sm">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Cột 2: Thông tin liên hệ */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Liên Hệ Hỗ Trợ</h3>
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-zinc-400 font-medium">
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-[#00a8ff]"><Phone className="w-4 h-4" /></div>
                                <span>Zalo/Hotline: <strong className="text-[#ff3838] text-base ml-1">0398.93.86.86</strong></span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-[#00a8ff]"><Mail className="w-4 h-4" /></div>
                                <span>duynart3101@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-[#00a8ff]"><Clock className="w-4 h-4" /></div>
                                <span>Thời gian làm việc: <strong className="text-gray-800 dark:text-zinc-200">24/7</strong></span>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Liên kết & Chính sách */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Chính Sách & Quy Định</h3>
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-zinc-400 font-medium">
                            <li>
                                <Link href="#" className="hover:text-[#00a8ff] flex items-center gap-2 transition-colors">
                                    <ShieldCheck className="w-4 h-4 text-green-500" /> Điều khoản dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#00a8ff] flex items-center gap-2 transition-colors">
                                    <ShieldCheck className="w-4 h-4 text-green-500" /> Chính sách bảo hành Acc
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#00a8ff] flex items-center gap-2 transition-colors">
                                    <ShieldCheck className="w-4 h-4 text-green-500" /> Hướng dẫn mua hàng an toàn
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Dòng bản quyền cuối cùng */}
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-500">
                        © 2026 Bản quyền thuộc về The Van PUBG. Cấm sao chép dưới mọi hình thức nếu không có sự chấp thuận bằng văn bản.
                    </p>
                    <div className="text-sm font-bold text-gray-400 dark:text-zinc-600 flex items-center gap-1.5">
                        Uy Tín <span className="text-[#00a8ff]">◆</span> Chất Lượng <span className="text-[#00a8ff]">◆</span> Tốc Độ
                    </div>
                </div>

            </div>
        </footer>
    );
}