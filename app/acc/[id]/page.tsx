'use client';

import { useEffect, useState, use } from "react";
import { UserCircle, ArrowUp, Eye, Copy, MessageCircle, ArrowLeft, KeySquare, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
  cho_thue: boolean;
  tags_do_hiem: string[];
  anh_chi_tiet: string[];
}

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const accountId = resolvedParams.id;
  const router = useRouter();
  const [acc, setAcc] = useState<PubgAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const bossAdminEmail = "duynart3101@gmail.com";
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let currentUserIsAdmin = false;

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === bossAdminEmail) {
        setIsAdmin(true);
        currentUserIsAdmin = true;
      }
    };

    const fetchAccountData = async () => {
      setLoading(true);
      await checkUser();

      const searchTerm = accountId.trim();

      let { data, error } = await supabase.from("pubg_accounts").select("*").eq("ma_acc", searchTerm).single();
      if (error && !isNaN(Number(searchTerm))) {
        const res = await supabase.from("pubg_accounts").select("*").eq("ma_acc", Number(searchTerm)).single();
        data = res.data; error = res.error;
      }

      if (error || !data) {
        setAcc(null);
      } else {
        setAcc(data);
        if (!currentUserIsAdmin) {
          await supabase.from("pubg_accounts").update({ luot_xem: (data.luot_xem || 0) + 1 }).eq("id", data.id);
        }
      }
      setLoading(false);
    };
    fetchAccountData();

    const handleScroll = () => {
      if (window.scrollY > 200) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [accountId]);

  const scrollToTop = () => {
    const startPosition = window.scrollY;
    const distance = -startPosition;
    const duration = 600;
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, 0);
      }
    };
    requestAnimationFrame(animation);
  };

  const handleDeleteAcc = async () => {
    if (!acc) return;

    const isConfirm = window.confirm(`CẢNH BÁO BOSS!\nBạn có chắc chắn muốn XÓA VĨNH VIỄN Acc mã: ${acc.ma_acc} không?\nHành động này không thể khôi phục!`);

    if (isConfirm) {
      setIsDeleting(true);
      try {
        const { error } = await supabase.from('pubg_accounts').delete().eq('id', acc.id);
        if (error) throw error;

        alert('Đã xóa Acc thành công! Đang quay về trang chủ...');
        router.push('/');
      } catch (error: any) {
        alert("Lỗi khi xóa: " + error.message);
        setIsDeleting(false);
      }
    }
  };

  if (loading || isDeleting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] w-full transition-colors duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,168,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,168,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-[#00a8ff]/40 rounded-tl-lg backdrop-blur-sm"></div>
        <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-[#00a8ff]/40 rounded-tr-lg backdrop-blur-sm"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-[#00a8ff]/40 rounded-bl-lg backdrop-blur-sm"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-[#00a8ff]/40 rounded-br-lg backdrop-blur-sm"></div>

        <div className="relative flex flex-col items-center justify-center w-full z-10">
          <div className="absolute top-[40%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center -z-10 opacity-70">
            <div className="absolute w-[320px] md:w-[450px] h-[320px] md:h-[450px] border-[2px] border-dashed border-[#00a8ff]/40 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-[240px] md:w-[350px] h-[240px] md:h-[350px] border-[3px] border-l-transparent border-r-transparent border-t-[#00a8ff] border-b-[#ff3838] rounded-full animate-[spin_4s_linear_infinite_reverse] shadow-[0_0_15px_rgba(0,168,255,0.5)]"></div>
            <div className="absolute w-[180px] h-[180px] bg-[#00a8ff]/10 blur-[50px] rounded-full"></div>
          </div>

          <div className="relative z-10 animate-[pulse_4s_ease-in-out_infinite_alternating]">
            <img
              src="/pubg-team.png"
              alt="PUBG Hologram"
              className="w-[280px] md:w-[420px] h-auto object-contain drop-shadow-[0_0_20px_rgba(0,168,255,0.7)]"
              onError={(e) => { e.currentTarget.src = 'https://i.imgur.com/L13UfE2.png' }}
            />
          </div>

          <div className="relative flex items-center justify-center perspective-[800px] z-20 -mt-6 md:-mt-8">
            <div className="absolute w-[280px] md:w-[400px] h-[60px] md:h-[80px] border-[2px] border-[#00a8ff] rounded-[50%] animate-[spin_5s_linear_infinite] shadow-[0_0_20px_rgba(0,168,255,0.6)]" style={{ transform: 'rotateX(75deg)' }}></div>
            <div className="absolute w-[220px] md:w-[300px] h-[40px] md:h-[50px] border-2 border-dashed border-[#00d8ff] rounded-[50%] animate-[spin_3s_linear_infinite_reverse]" style={{ transform: 'rotateX(75deg)' }}></div>
            <div className="absolute w-24 h-6 bg-white/50 rounded-[50%] blur-[12px] animate-pulse shadow-[0_0_30px_rgba(0,168,255,1)]"></div>
          </div>

          <div className="relative z-30 flex flex-col items-center gap-4 mt-12 md:mt-16">
            <h2 className="text-lg md:text-xl font-bold tracking-widest text-[#00d8ff] animate-pulse drop-shadow-[0_0_10px_rgba(0,216,255,0.8)] uppercase">
              {isDeleting ? "Đang bay màu Acc..." : "Đang tải Acc..."}
            </h2>
            <div className="w-56 md:w-64 h-1 bg-gray-800 rounded-full overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,1)] relative">
              <div className="absolute top-0 left-0 h-full w-full bg-[#00a8ff] animate-pulse shadow-[0_0_15px_rgba(0,168,255,1)]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!acc) return null;

  const priceInMillions = acc.gia_ban ? Number((acc.gia_ban / 1000000).toFixed(2)) : 0;
  const allImages = [acc.anh_bia, ...(acc.anh_chi_tiet || [])].filter(Boolean);

  const handleMucNgay = () => {
    navigator.clipboard.writeText(`Mã số ${acc.ma_acc} giá trị ${priceInMillions}m - ${window.location.href}`);
    window.open('https://zalo.me/0398938686', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0c] pb-20 transition-colors duration-500 relative">

      <div className="bg-white dark:bg-[#121214] shadow-sm sticky top-0 z-30 border-b border-gray-100 dark:border-zinc-800 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:text-[#00a8ff]">
            <ArrowLeft className="w-5 h-5" /> Về Trang Chủ
          </Link>
          <div className="font-bold text-lg text-gray-800 dark:text-white">Mã: {acc.ma_acc}</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">

        <div className="bg-white dark:bg-[#121214] rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 transition-colors duration-500 shadow-sm dark:shadow-[0_0_20px_rgba(0,168,255,0.05)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{acc.tieu_de || `Mã Số: ${acc.ma_acc}`}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-[#00a8ff] rounded-full text-sm font-semibold border border-blue-100 dark:border-blue-500/20">
                  Mã: {acc.ma_acc} <button onClick={() => navigator.clipboard.writeText(acc.ma_acc)} className="hover:text-blue-900 dark:hover:text-white"><Copy className="w-3.5 h-3.5" /></button>
                </span>
                {acc.noi_bat && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-full text-sm font-bold border border-red-100 dark:border-red-500/20">
                    🔥 Nổi Bật
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400 text-sm"><Eye className="w-4 h-4" /> {acc.luot_xem || 0} views</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-1 font-medium">Giá trị Acc:</p>
                <div className="text-4xl font-bold text-red-500 tracking-tight">{priceInMillions}<span className="text-3xl">m</span></div>
              </div>

              {/* BỔ SUNG HIỂN THỊ GIÁ THUÊ NẾU ACC NÀY CHO THUÊ */}
              {acc.cho_thue && acc.gia_thue_ngay && (
                <div className="flex flex-col items-end border-t border-gray-100 dark:border-zinc-800 pt-3 w-full">
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-1 font-medium">Giá Thuê:</p>
                  <div className="text-3xl font-bold text-[#00a8ff] tracking-tight">{(acc.gia_thue_ngay / 1000).toFixed(0)}<span className="text-xl text-gray-500 dark:text-zinc-500">k/ngày</span></div>
                </div>
              )}

              {isAdmin && (
                <div className="flex items-center gap-2 mt-2 w-full justify-end border-t border-gray-100 dark:border-zinc-800 pt-3">
                  <Link href={`/admin?edit=${acc.id}`} className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 rounded-lg text-sm font-bold hover:bg-yellow-200 transition-colors">
                    <Pencil className="w-4 h-4" /> Sửa Acc
                  </Link>
                  <button onClick={handleDeleteAcc} className="flex items-center gap-1.5 px-4 py-2 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-500 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </div>
              )}

            </div>
          </div>

          <button onClick={handleMucNgay} className="mt-6 w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#00a8ff] via-[#0097e6] to-[#00a8ff] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <MessageCircle className="w-6 h-6 animate-pulse" /> Múc Ngay (Qua Zalo)
          </button>
          <div className="flex items-center justify-center gap-2 mt-3 text-green-600 dark:text-green-400 font-medium text-xs">
            <CheckCircle2 className="w-4 h-4" /> <span>Giao dịch nhanh chóng, an toàn, trung gian uy tín 100%</span>
          </div>
        </div>

        {acc.anh_bia && (
          <div className="w-full rounded-2xl overflow-hidden cursor-pointer border border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#121214]" onClick={() => { setZoomImage(acc.anh_bia); setCurrentImageIndex(0); }}>
            <img src={acc.anh_bia} alt="Cover" className="w-full h-auto object-contain" />
          </div>
        )}

        {acc.anh_chi_tiet && acc.anh_chi_tiet.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-1 bg-[#00a8ff] rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-500">Ảnh Chi Tiết ({acc.anh_chi_tiet.length})</h2>
            </div>
            <div className="space-y-6">
              {acc.anh_chi_tiet.map((img, index) => (
                <div key={index} className="w-full rounded-2xl overflow-hidden shadow-sm dark:shadow-none cursor-pointer border border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#121214] transition-colors duration-500" onClick={() => { setZoomImage(img); setCurrentImageIndex(index + 1); }}>
                  <img src={img} alt={`Detail ${index + 1}`} className="w-full h-auto object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {zoomImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[110] bg-gradient-to-b from-black/60 to-transparent">
            <div className="text-white font-medium bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md text-sm">Ảnh {currentImageIndex + 1} / {allImages.length}</div>
            <button onClick={() => setZoomImage(null)} className="text-white bg-white/10 hover:bg-red-500 px-4 py-1.5 rounded-full font-bold text-sm">Đóng (X)</button>
          </div>
          <div className="w-[100vw] h-[100vh] flex items-center justify-center overflow-hidden">
            <TransformWrapper initialScale={1} minScale={0.5} maxScale={10} centerOnInit={true} wheel={{ step: 0.15 }} doubleClick={{ step: 2 }}>
              {({ resetTransform }) => (
                <>
                  <button onClick={() => resetTransform()} className="absolute top-20 right-4 text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-colors z-[110]">Reset Zoom</button>
                  <TransformComponent wrapperClass="!w-screen !h-screen" contentClass="!w-screen !h-screen flex items-center justify-center">
                    <img src={zoomImage} alt="Zoomed" className="max-w-[100vw] max-h-[100vh] object-contain cursor-grab active:cursor-grabbing select-none" />
                  </TransformComponent>
                  {allImages.length > 1 && (
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-[110]">
                      <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold" disabled={currentImageIndex === 0} onClick={() => { resetTransform(); setCurrentImageIndex(prev => prev - 1); setZoomImage(allImages[currentImageIndex - 1]); }}>← Ảnh trước</button>
                      <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold" disabled={currentImageIndex === allImages.length - 1} onClick={() => { resetTransform(); setCurrentImageIndex(prev => prev + 1); setZoomImage(allImages[currentImageIndex + 1]); }}>Ảnh tiếp →</button>
                    </div>
                  )}
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}

      <button onClick={scrollToTop} className={`fixed bottom-6 right-6 p-4 bg-[#00a8ff] hover:bg-blue-600 text-white rounded-full shadow-2xl transition-all duration-500 z-50 group ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>

    </div>
  );
}