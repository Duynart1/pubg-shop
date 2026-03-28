'use client';

import { useEffect, useState, use, useRef, useCallback } from "react";
// THÊM ICON CheckCircle2 VÀO DÒNG IMPORT
import { UserCircle, ArrowUp, Eye, Copy, Pencil, Trash2, Crown, MessageCircle, ArrowLeft, KeySquare, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
// Thư viện Zoom "Trùm Cuối" (Mượt trên cả PC & Mobile)
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// TYPE CHUẨN DATABASE CỦA BOSS THẾ VĂN
interface PubgAccount {
  id: string;
  created_at: string;
  ma_acc: string;
  tieu_de: string;
  trang_thai: string;
  gia_ban: number;
  gia_thue_ngay: number;
  anh_bia: string;
  luot_xem: number;
  noi_bat: boolean;
  tags_do_hiem: string[];
  anh_chi_tiet: string[];
}

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const accountId = resolvedParams.id;
  const router = useRouter();
  const [acc, setAcc] = useState<PubgAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // State Lightbox
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const bossAdminEmail = "duynart3101@gmail.com";
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === bossAdminEmail) {
        setIsAdmin(true);
      }
    };
    checkUser();

    // RADAR TÌM KIẾM GOD-MODE
    const fetchAccountData = async () => {
      setLoading(true);
      const searchTerm = accountId.trim();

      let { data, error } = await supabase.from("pubg_accounts").select("*").eq("ma_acc", searchTerm).single();

      if (error && !isNaN(Number(searchTerm))) {
        const res = await supabase.from("pubg_accounts").select("*").eq("ma_acc", Number(searchTerm)).single();
        data = res.data; error = res.error;
      }

      if (error && searchTerm.length > 20 && searchTerm.includes('-')) {
        const res = await supabase.from("pubg_accounts").select("*").eq("id", searchTerm).single();
        data = res.data; error = res.error;
      }

      if (error || !data) {
        setAcc(null);
      } else {
        setAcc(data);
        if (!isAdmin) {
          await supabase.from("pubg_accounts").update({ luot_xem: (data.luot_xem || 0) + 1 }).eq("id", data.id);
        }
      }
      setLoading(false);
    };

    fetchAccountData();
  }, [accountId, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] w-full">
        <div className="relative flex items-center justify-center mb-8 z-10">
          <div className="absolute w-28 h-28 border-4 border-[#00a8ff] rounded-full border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '2s' }}></div>
          <div className="absolute w-20 h-20 border-4 border-red-500 rounded-full border-l-transparent border-r-transparent animate-spin shadow-[0_0_15px_rgba(239,68,68,0.5)]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="w-10 h-10 text-[#00a8ff] animate-pulse flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-[#00a8ff] via-white to-[#00a8ff] text-transparent bg-clip-text animate-pulse">
          Đang quét Acc...
        </h2>
      </div>
    );
  }

  if (!acc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500 text-xl font-bold bg-[#0a0a0c] w-full pb-20 px-4 text-center">
        <KeySquare className="w-16 h-16 mb-6 text-red-500" />
        X Không tìm thấy Tài khoản này!
        <p className="mt-2 text-zinc-500 text-sm font-medium">Vui lòng kiểm tra lại mã hoặc ID, hoặc quay lại Trang Chủ Boss ơi! 🎯</p>
        <Link href="/" className="mt-8 px-6 py-3 bg-[#00a8ff] text-white rounded-lg font-semibold hover:bg-[#0097e6] transition-colors">
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  const priceInMillions = acc.gia_ban ? (acc.gia_ban / 1000000).toFixed(0) : 0;

  // Gộp tất cả ảnh
  const allImages = [acc.anh_bia, ...(acc.anh_chi_tiet || [])].filter(Boolean);

  const handleMucNgay = () => {
    const textToCopy = `Tôi muốn mua mã số ${acc.ma_acc} giá ${priceInMillions}m - Xem thêm tại: ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      window.open('https://zalo.me/0398938686', '_blank');
    }).catch(err => {
      console.error('Không thể copy: ', err);
      window.open('https://zalo.me/0398938686', '_blank');
    });
  };

  const handleCopyMa = () => {
    navigator.clipboard.writeText(acc.ma_acc);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* HEADER */}
      <div className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#00a8ff] transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Về Trang Chủ
          </Link>
          <div className="font-bold text-lg text-gray-800">Mã: {acc.ma_acc}</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6">

        {/* KHỐI THÔNG TIN TOP */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">{acc.tieu_de || `Mã Số: ${acc.ma_acc}`}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
                  Mã: {acc.ma_acc}
                  <button onClick={handleCopyMa} className="hover:text-blue-900"><Copy className="w-3.5 h-3.5" /></button>
                </span>
                {acc.noi_bat && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-100">
                    🔥 Nổi Bật
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Eye className="w-4 h-4" /> {acc.luot_xem || 0} views
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500 mb-1 font-medium">Giá Bán:</p>
              <div className="text-4xl font-bold text-red-500 tracking-tight">{priceInMillions}<span className="text-3xl">m</span></div>
            </div>
          </div>

          <button
            onClick={handleMucNgay}
            className="mt-6 w-full py-4 rounded-xl text-white font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#00a8ff] via-[#0097e6] to-[#00a8ff] bg-[length:200%_auto] animate-[shimmer_2s_linear_infinite]"
          >
            <MessageCircle className="w-6 h-6 animate-pulse" />
            Múc Ngay (Qua Zalo)
          </button>

          {/* THAY THẾ DÒNG CHÚ THÍCH CŨ BẰNG ĐOẠN CODE UY TÍN NÀY (Có tích xanh, chữ xanh) */}
          <div className="flex items-center justify-center gap-2 mt-2 text-green-600 font-medium text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Giao dịch tự động hoặc trung gian uy tín 100%</span>
          </div>

        </div>

        {/* ẢNH BÌA TO */}
        {acc.anh_bia && (
          <div
            className="w-full rounded-2xl overflow-hidden shadow-md cursor-pointer border border-gray-100 bg-white"
            onClick={() => { setZoomImage(acc.anh_bia); setCurrentImageIndex(0); }}
          >
            <img src={acc.anh_bia} alt="Cover" className="w-full h-auto object-contain" />
          </div>
        )}

        {/* DÀN ẢNH CHI TIẾT */}
        {acc.anh_chi_tiet && acc.anh_chi_tiet.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-1 bg-[#00a8ff] rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">Ảnh Chi Tiết ({acc.anh_chi_tiet.length})</h2>
            </div>

            <div className="space-y-6">
              {acc.anh_chi_tiet.map((img, index) => (
                <div
                  key={index}
                  className="w-full rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
                  onClick={() => { setZoomImage(img); setCurrentImageIndex(index + 1); }}
                >
                  <img src={img} alt={`Detail ${index + 1}`} className="w-full h-auto object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- LIGHTBOX KÍNH LÚP CINEMATIC PRO MAX (Zoom tới x10) --- */}
      {zoomImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center">

          {/* Header Lightbox */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[110] bg-gradient-to-b from-black/60 to-transparent">
            <div className="text-white font-medium bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md text-sm">
              Ảnh {currentImageIndex + 1} / {allImages.length}
            </div>
            <button
              onClick={() => setZoomImage(null)}
              className="text-white bg-white/10 hover:bg-red-500 px-4 py-1.5 rounded-full font-bold backdrop-blur-md transition-colors text-sm"
            >
              Đóng (X)
            </button>
          </div>

          {/* TRÙM CUỐI ZOOM PAN PINCH (Zoom tới x10) */}
          <div className="w-[100vw] h-[100vh] flex items-center justify-center overflow-hidden">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={10} // Phóng to X10 soi lỗ chân lông
              centerOnInit={true}
              wheel={{ step: 0.15 }} // Lăn chuột mượt
              doubleClick={{ step: 2 }} // Nháy đúp phóng to 2x
            >
              {({ resetTransform }) => (
                <>
                  {/* Nút Reset Zoom */}
                  <button
                    onClick={() => resetTransform()}
                    className="absolute top-20 right-4 text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-colors z-[110]"
                  >
                    Reset Zoom
                  </button>

                  <TransformComponent wrapperClass="!w-screen !h-screen" contentClass="!w-screen !h-screen flex items-center justify-center">
                    <img
                      src={zoomImage}
                      alt="Zoomed"
                      className="max-w-[100vw] max-h-[100vh] object-contain cursor-grab active:cursor-grabbing select-none"
                    />
                  </TransformComponent>

                  {/* Nút điều hướng */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-[110]">
                      <button
                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors disabled:opacity-30 font-bold"
                        disabled={currentImageIndex === 0}
                        onClick={() => {
                          resetTransform();
                          setCurrentImageIndex(prev => prev - 1);
                          setZoomImage(allImages[currentImageIndex - 1]);
                        }}
                      >
                        ← Ảnh trước
                      </button>
                      <button
                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors disabled:opacity-30 font-bold"
                        disabled={currentImageIndex === allImages.length - 1}
                        onClick={() => {
                          resetTransform();
                          setCurrentImageIndex(prev => prev + 1);
                          setZoomImage(allImages[currentImageIndex + 1]);
                        }}
                      >
                        Ảnh tiếp →
                      </button>
                    </div>
                  )}
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}

      {/* NÚT LÊN ĐẦU TRANG */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-4 bg-gray-900/80 hover:bg-[#00a8ff] text-white rounded-full shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 z-40 group"
      >
        <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
      </button>

    </div>
  );
}