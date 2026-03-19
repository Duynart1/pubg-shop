"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { ArrowLeft, CheckCircle2, ShieldCheck, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function DetailPage() {
  const params = useParams();
  const id = params.id;
  const [acc, setAcc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // PHÉP THUẬT: STATE QUẢN LÝ ĐỔI ẢNH SOI CHI TIẾT
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccDetail = async () => {
      const { data, error } = await supabase
        .from("pubg_accounts")
        .select("*")
        .eq("ma_acc", id)
        .single();

      if (data) {
        setAcc(data);
        // Lúc mới tải trang, đặt ảnh bìa làm ảnh hiển thị chính
        setMainImage(data.anh_bia);
      }
      setLoading(false);
    };

    fetchAccDetail();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-500">⏳ Đang tải thông tin Acc PUBG...</div>;
  }

  if (!acc) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">❌ Không tìm thấy Tài khoản này!</div>;
  }

  // PHÉP THUẬT: LOGIC CHỐT ĐƠN ZALO SIÊU TỐC
  const handleBuyNow = () => {
    // ⚠️ BOSS ƠI: SỬA SỐ ĐIỆN THOẠI ZALO CỦA BOSS THẾ ANH PUBG VÀO ĐÂY NHÉ (Gõ liền không dấu)
    const bossZaloNumber = "0394084453"; 
    
    const formattedPrice = acc.gia_ban.toLocaleString("vi-VN");
    const currentUrl = window.location.href; // Lấy link web hiện tại
    
    // Mẫu tin nhắn mồi cho khách, Boss có thể sửa chữ trong này tùy ý
    const message = `Chào Admin Thế Anh Pubg, mình muốn mua Acc PUBG này.
Mã số: #${acc.ma_acc}
Giá: ${formattedPrice} VNĐ
Link xem chi tiết: ${currentUrl}`;

    // Mã hóa tin nhắn để đưa lên đường link URL
    const encodedMessage = encodeURIComponent(message);
    const zaloUrl = `https://zalo.me/${bossZaloNumber}?text=${encodedMessage}`;

    // Tự động mở Zalo ở tab mới
    window.open(zaloUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER - ĐÃ ĐỔI TÊN */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <span className="font-bold text-lg text-gray-800">Cửa hàng Thế Anh Pubg - Chi tiết Acc: #{acc.ma_acc}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CỘT TRÁI: HIỂN THỊ DÀN ẢNH SOI CHI TIẾT */}
            <div className="space-y-4">
              {/* Ảnh bìa hiển thị chính, object-contain để hiện nguyên vẹn */}
              <div className="w-full h-72 md:h-[450px] bg-gray-950 rounded-lg overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
                <img 
                  src={mainImage || acc.anh_bia} 
                  alt="Main Display" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Dàn Ảnh Thumbnail (Bấm để đổi ảnh to ở trên) */}
              {acc.anh_chi_tiet && acc.anh_chi_tiet.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-2.5 flex items-center gap-2">📸 Soi ảnh chi tiết ({acc.anh_chi_tiet.length + 1})</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                    
                    {/* Luôn hiện ảnh bìa đầu tiên ở dàn ảnh nhỏ */}
                    <div 
                      onClick={() => setMainImage(acc.anh_bia)} // Bấm vào là đổi ảnh to
                      className={`aspect-video bg-gray-100 rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:border-blue-300 ${mainImage === acc.anh_bia ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}
                    >
                      <img src={acc.anh_bia} alt="Cover Thumb" className="w-full h-full object-cover" />
                    </div>

                    {/* Vòng lặp hiện 1 loạt ảnh phụ */}
                    {acc.anh_chi_tiet.map((imgUrl: string, index: number) => (
                      <div 
                        key={index} 
                        onClick={() => setMainImage(imgUrl)} // Bấm vào ảnh nhỏ là đổi ảnh to
                        // Thêm viền xanh nếu ảnh này đang được chọn
                        className={`aspect-video bg-gray-100 rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:border-blue-300 ${mainImage === imgUrl ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}
                      >
                        <img src={imgUrl} alt={`Chi tiết ${index}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN VÀ NÚT CHỐT ĐƠN ZALO */}
            <div className="flex flex-col pt-2">
              <div className="flex items-center gap-2 mb-3">
                {acc.noi_bat && (
                  <span className="w-max bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">🔥 TÀI KHOẢN NỔI BẬT</span>
                )}
                <span className="w-max bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-green-200">💎 TRẮNG THÔNG TIN</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 leading-snug mb-2.5">
                {acc.tieu_de}
              </h1>
              
              <div className="text-sm text-gray-500 mb-7 flex items-center gap-5 border-b pb-4">
                <span>Mã số: <b className="text-gray-900 text-base">#{acc.ma_acc}</b></span>
                <span>Ngày đăng: <b className="text-gray-900">{new Date(acc.created_at).toLocaleDateString("vi-VN")}</b></span>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-7 shadow-inner">
                <span className="block text-sm text-blue-600 font-medium mb-1.5">Giá bán công khai:</span>
                <span className="text-5xl font-black text-red-600 tracking-tight">
                  {acc.gia_ban.toLocaleString("vi-VN")} <span className="text-3xl text-red-500 font-bold">đ</span>
                </span>
              </div>

              {/* THÔNG TIN BẢO HÀNH - ĐÃ ĐỔI TÊN */}
              <div className="space-y-4 mb-10 bg-white p-4 rounded-lg border">
                <p className="flex items-center gap-2.5 text-gray-800 font-semibold"><CheckCircle2 className="w-5 h-5 text-green-500" /> Tài khoản sạch, cam kết trắng thông tin</p>
                <p className="flex items-center gap-2.5 text-gray-800 font-semibold"><CheckCircle2 className="w-5 h-5 text-green-500" /> Hỗ trợ đổi mật khẩu, liên kết an toàn 100%</p>
                <p className="flex items-center gap-2.5 text-gray-800 font-semibold"><ShieldCheck className="w-5 h-5 text-blue-500" /> Giao dịch trung gian uy tín qua Admin Thế Anh Pubg</p>
              </div>

              {/* NÚT CHỐT ĐƠN ZALO - ĐÃ KÍCH HOẠT */}
              <button 
                onClick={handleBuyNow} // Bấm vào gọi hàm handleBuyNow để mở Zalo
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl text-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98] mt-auto flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-7 h-7" /> LIÊN HỆ MUA NGAY (ZALO)
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}