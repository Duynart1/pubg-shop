"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase"; 
import { ArrowLeft, Crown, Clock, Eye, Trash2, Pencil, ShieldCheck, ShoppingCart, X, ZoomIn, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [acc, setAcc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // --- 💥 STATE: KÍNH LÚP KÉO THẢ ---
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false); 

  const bossAdminEmail = "duynart3101@gmail.com"; 
  const isAdmin = user && user.email === bossAdminEmail;

  useEffect(() => {
    const fetchAccDetail = async () => {
      const { data, error } = await supabase
        .from("pubg_accounts")
        .select("*")
        .eq("ma_acc", id)
        .single();

      if (data) {
        setAcc(data);
        
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        setUser(currentUser || null);
        
        const currentIsAdmin = currentUser && currentUser.email === bossAdminEmail;

        if (!currentIsAdmin) {
            const currentViews = data.luot_xem || 0;
            await supabase
              .from("pubg_accounts")
              .update({ luot_xem: currentViews + 1 })
              .eq("id", data.id);
            
            setAcc((prev: any) => ({...prev, luot_xem: currentViews + 1}));
        }
      }
      setLoading(false);
    };

    if (id) {
        fetchAccDetail();
    }
  }, [id, user, isAdmin]); 

  const handleDelete = async () => {
    if (!isAdmin) return;
    
    if (confirm(`⚠️ Boss Thế Anh Pubg ơi, Boss chắc chắn muốn XÓA VĨNH VIỄN acc mã số #${acc.ma_acc} này chứ?`)) {
      setLoading(true);
      const { error } = await supabase.from("pubg_accounts").delete().eq("id", acc.id);
      if (error) {
        alert("❌ Xóa thất bại: " + error.message);
        setLoading(false);
      } else {
        alert("✅ Đã xóa Acc thành công!");
        router.push("/");
      }
    }
  };

  const handleBuyNow = async () => {
    const bossZaloNumber = "0398938686"; 
    const formattedPrice = acc.gia_ban.toLocaleString("vi-VN");
    const currentUrl = window.location.href; 
    
    const message = `Chào Admin Thế Anh Pubg, mình muốn mua Acc PUBG này.
Mã số: #${acc.ma_acc}
Giá Bán: ${formattedPrice} VNĐ
Link xem chi tiết: ${currentUrl}`;

    try {
      await navigator.clipboard.writeText(message);
      alert("✅ Đã copy sẵn nội dung tin nhắn!\n\nVào Zalo bạn chỉ cần bấm DÁN (Ctrl + V) vào khung chat là xong nhé!");
      const encodedMessage = encodeURIComponent(message);
      const zaloUrl = `https://zalo.me/${bossZaloNumber}?text=${encodedMessage}`;
      window.open(zaloUrl, '_blank');
    } catch (err) {
      const encodedMessage = encodeURIComponent(message);
      const zaloUrl = `https://zalo.me/${bossZaloNumber}?text=${encodedMessage}`;
      window.open(zaloUrl, '_blank');
    }
  };

  const openLightbox = (imgUrl: string) => {
    setLightboxImg(imgUrl);
    setIsZoomed(false); 
    setPosition({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightboxImg(null);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const onPointerDown = (clientX: number, clientY: number) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setHasDragged(false); 
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const onPointerMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isZoomed) return;
    setHasDragged(true); 
    setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (hasDragged) {
        setHasDragged(false);
        return;
    }
    if (isZoomed) {
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 }); 
    } else {
        setIsZoomed(true);
    }
  };

  // --- LỆNH CUỘN LÊN ĐẦU TRANG ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-500 bg-gray-50">⏳ Đang hút dữ liệu Acc PUBG...</div>;
  }

  if (!acc) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500 bg-gray-50">❌ Không tìm thấy Tài khoản này!</div>;
  }

  const priceInMillions = acc.gia_ban ? (acc.gia_ban / 1000000).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg tracking-tight">
                <Crown className="w-6 h-6 fill-blue-600" /> THẾ ANH PUBG
            </div>
            <div className="flex items-center gap-2.5">
                {isAdmin && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">🛡️ ADMIN</span>}
                <Link href="/" className="flex items-center gap-1.5 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700 text-sm font-semibold border">
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </Link>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 flex flex-col gap-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center w-full relative">
            
            {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <Link href={`/admin?edit=${acc.id}`} className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                        <Pencil className="w-4 h-4 text-gray-800" />
                    </Link>
                    <button onClick={handleDelete} className="p-2 bg-red-50 rounded hover:bg-red-100 transition">
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">BÁN</span>
                {acc.noi_bat && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">🔥 NỔI BẬT</span>}
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    Mã số: {acc.ma_acc} {acc.tieu_de && `${acc.tieu_de}`}
                </h1>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {acc.luot_xem || 0} xem</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(acc.created_at).toLocaleDateString("vi-VN")}</span>
            </div>

            <div className="mt-8 mb-6 flex items-baseline justify-center gap-2">
                <span className="text-gray-600 text-lg">Giá Bán:</span>
                <span className="text-4xl font-bold text-red-500 tracking-tight">
                    {priceInMillions}m
                </span>
            </div>

            <button onClick={handleBuyNow} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg text-lg transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> MỨC NGAY (QUA ZALO)
            </button>
            
            <div className="mt-4 text-green-600 font-medium text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Giao dịch tự động hoặc trung gian uy tín 100%
            </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div 
            onClick={() => openLightbox(acc.anh_bia)}
            className="w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition group relative"
          >
            <img src={acc.anh_bia} alt="Ảnh bìa chính" className="w-full h-auto object-cover block" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </div>
          
          {acc.anh_chi_tiet && acc.anh_chi_tiet.length > 0 && (
              <div className="flex flex-col gap-3">
                {acc.anh_chi_tiet.map((imgUrl: string, index: number) => (
                  <div 
                    key={index} 
                    onClick={() => openLightbox(imgUrl)}
                    className="w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition group relative"
                  >
                    <img src={imgUrl} alt={`Ảnh chi tiết ${index + 1}`} className="w-full h-auto object-cover block" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                  </div>
                ))}
              </div>
          )}
        </div>
      </main>

      {/* --- NÚT CUỘN LÊN ĐẦU TRANG ĐÃ ĐƯỢC THÊM VÀO --- */}
      <button 
        onClick={scrollToTop} 
        className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center overflow-hidden touch-none"
          onClick={closeLightbox}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-6 right-6 z-[10000] text-gray-300 hover:text-white bg-black/50 hover:bg-red-500 rounded-full p-2.5 transition backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>

          {!isZoomed && (
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/90 bg-black/60 px-5 py-2.5 rounded-full text-sm font-semibold pointer-events-none flex items-center gap-2 backdrop-blur-md shadow-xl border border-white/20 z-[10000]">
                <ZoomIn className="w-5 h-5 text-blue-400" /> Bấm để phóng to và kéo thả
             </div>
          )}

          <img 
            src={lightboxImg} 
            alt="Zoom Chi Tiết" 
            draggable="false" 
            onClick={handleImageClick}
            onMouseDown={(e) => onPointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => onPointerMove(e.clientX, e.clientY)}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={(e) => onPointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => onPointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={onPointerUp}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${isZoomed ? 2.5 : 1})`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)' 
            }}
            className={`max-w-[95vw] max-h-[95vh] object-contain shadow-2xl select-none ${
              !isZoomed ? "cursor-zoom-in" : isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          />
        </div>
      )}

    </div>
  );
}