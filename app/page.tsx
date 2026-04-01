'use client';

import { useEffect, useState } from "react";
import { UserCircle, Eye, Copy, Clock, Search, MessageCircle, Crown, Flame, ArrowUp, ArrowDownUp, Check, ChevronsUpDown, Info, ShoppingCart, Key, Shield, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

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

export default function Home() {
  const [accounts, setAccounts] = useState<PubgAccount[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [priceFilter, setPriceFilter] = useState("all");
  const [sortType, setSortType] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [tradeMode, setTradeMode] = useState<"buy" | "rent">("buy");

  const bossAdminEmail = "duynart3101@gmail.com";
  const isAdmin = user && user.email === bossAdminEmail;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const fetchAccounts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("pubg_accounts").select("*").order("created_at", { ascending: false });
      if (!error) setAccounts(data || []);
      setLoading(false);
    };
    fetchAccounts();

    const handleScroll = () => {
      if (window.scrollY > 200) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  let filteredAccounts = accounts.filter(acc => {
    const matchSearch = (acc.ma_acc && acc.ma_acc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (acc.tieu_de && acc.tieu_de.toLowerCase().includes(searchTerm.toLowerCase()));

    // Lọc theo chế độ Mua / Thuê
    if (tradeMode === "rent" && !acc.cho_thue) return false;

    // Luôn lấy giá trị thực (giá bán) làm mốc lọc để không bị ảo
    const priceM = acc.gia_ban ? acc.gia_ban / 1000000 : 0;
    let matchPrice = true;
    if (priceFilter === "under5") matchPrice = priceM < 5;
    else if (priceFilter === "5-10") matchPrice = priceM >= 5 && priceM <= 10;
    else if (priceFilter === "10-20") matchPrice = priceM > 10 && priceM <= 20;
    else if (priceFilter === "20-40") matchPrice = priceM > 20 && priceM <= 40;
    else if (priceFilter === "40-60") matchPrice = priceM > 40 && priceM <= 60;
    else if (priceFilter === "over60") matchPrice = priceM > 60;

    return matchSearch && matchPrice;
  });

  if (sortType === "newest") {
    filteredAccounts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortType === "price-asc") {
    filteredAccounts.sort((a, b) => (a.gia_ban || 0) - (b.gia_ban || 0));
  } else if (sortType === "price-desc") {
    filteredAccounts.sort((a, b) => (b.gia_ban || 0) - (a.gia_ban || 0));
  }

  const handleCopyMa = (e: React.MouseEvent, maAcc: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(maAcc);
  };

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
      if (timeElapsed < duration) requestAnimationFrame(animation);
      else window.scrollTo(0, 0);
    };
    requestAnimationFrame(animation);
  };

  if (loading) {
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
            <img src="/pubg-team.png" alt="PUBG Hologram" className="w-[280px] md:w-[420px] h-auto object-contain drop-shadow-[0_0_20px_rgba(0,168,255,0.7)]" onError={(e) => { e.currentTarget.src = 'https://i.imgur.com/L13UfE2.png' }} />
          </div>
          <div className="relative flex items-center justify-center perspective-[800px] z-20 -mt-6 md:-mt-8">
            <div className="absolute w-[280px] md:w-[400px] h-[60px] md:h-[80px] border-[2px] border-[#00a8ff] rounded-[50%] animate-[spin_5s_linear_infinite] shadow-[0_0_20px_rgba(0,168,255,0.6)]" style={{ transform: 'rotateX(75deg)' }}></div>
            <div className="absolute w-[220px] md:w-[300px] h-[40px] md:h-[50px] border-2 border-dashed border-[#00d8ff] rounded-[50%] animate-[spin_3s_linear_infinite_reverse]" style={{ transform: 'rotateX(75deg)' }}></div>
            <div className="absolute w-24 h-6 bg-white/50 rounded-[50%] blur-[12px] animate-pulse shadow-[0_0_30px_rgba(0,168,255,1)]"></div>
          </div>
          <div className="relative z-30 flex flex-col items-center gap-4 mt-12 md:mt-16">
            <h2 className="text-lg md:text-xl font-bold tracking-widest text-[#00d8ff] animate-pulse drop-shadow-[0_0_10px_rgba(0,216,255,0.8)] uppercase">Đang tải dữ liệu...</h2>
            <div className="w-56 md:w-64 h-1 bg-gray-800 rounded-full overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,1)] relative">
              <div className="absolute top-0 left-0 h-full w-full bg-[#00a8ff] animate-pulse shadow-[0_0_15px_rgba(0,168,255,1)]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filterButtons = [
    { id: "all", label: "Tất cả" },
    { id: "under5", label: "Dưới 5m" },
    { id: "5-10", label: "5m - 10m" },
    { id: "10-20", label: "10m - 20m" },
    { id: "20-40", label: "20m - 40m" },
    { id: "40-60", label: "40m - 60m" },
    { id: "over60", label: "Trên 60m" },
  ];

  const sortOptions = [
    { id: "newest", label: "Mới đăng", icon: Flame },
    { id: "price-asc", label: "Giá Thấp -> Cao", icon: ArrowDownUp },
    { id: "price-desc", label: "Giá Cao -> Thấp", icon: ArrowDownUp },
  ];

  const currentSort = sortOptions.find(opt => opt.id === sortType) || sortOptions[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0c] pb-20 transition-colors duration-500 relative">
      <div className="bg-white dark:bg-[#121214] shadow-sm sticky top-0 z-30 border-b border-gray-100 dark:border-zinc-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-7 h-7 text-[#00a8ff] group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-2xl tracking-tighter text-gray-900 dark:text-white">The Van PUBG</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-[#00a8ff] hover:bg-blue-200 dark:hover:bg-blue-500/30 rounded-full font-bold text-sm transition-all shadow-sm">
                <Shield className="w-4 h-4" /> ADMIN
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-full font-bold text-sm transition-all shadow-sm" title="Đăng xuất">
                <LogOut className="w-4 h-4" /> THOÁT
              </button>
            ) : (
              <Link href="/login" title="Đăng nhập">
                <UserCircle className="w-8 h-8 text-gray-400 dark:text-zinc-500 hover:text-[#00a8ff] dark:hover:text-[#00a8ff] transition-colors cursor-pointer" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="relative w-full py-6 rounded-2xl bg-[#00a8ff] text-white flex flex-col items-center justify-center shadow-lg hover:shadow-[0_10px_30px_rgba(0,168,255,0.4)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group overflow-hidden" onClick={() => window.open('https://zalo.me/0398938686', '_blank')}>
          <div className="absolute top-0 left-[-150%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
          <div className="flex items-center gap-2 mb-1 z-10"><MessageCircle className="w-6 h-6 group-hover:animate-bounce" /><h3 className="text-xl font-bold">Hỗ trợ giao dịch 24/7 qua Zalo</h3></div>
          <p className="text-sm font-medium text-blue-100 z-10">Uy tín tạo niềm tin - Giao dịch nhanh gọn</p>
        </div>

        <div className="relative w-full max-w-2xl mx-auto">
          <input type="text" placeholder="Tìm kiếm tên acc, mã số, skin..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-6 py-4 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#121214] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 shadow-sm focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] outline-none transition-all duration-300" />
          <button className="absolute top-1/2 right-3 -translate-y-1/2 p-3 rounded-full bg-[#1b64ff] hover:bg-blue-700 text-white transition-colors shadow-lg hover:shadow-xl"><Search className="w-4 h-4" /></button>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,168,255,0.1)] border border-gray-200 dark:border-blue-900/30 transition-all duration-500 z-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 dark:opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-gray-100/90 dark:from-gray-900/95 dark:via-[#0a0a0c]/90 dark:to-gray-900/95 backdrop-blur-xl"></div>

          <div className="relative p-5 md:p-6 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide drop-shadow-sm">Danh sách Acc</h2>
                  <span className="flex items-center justify-center px-2.5 h-7 bg-[#00a8ff] text-white rounded-full text-xs font-bold shadow-[0_0_10px_rgba(0,168,255,0.4)]">{filteredAccounts.length}</span>
                </div>

                <div className="relative ml-0 lg:ml-2 z-50">
                  <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/40 backdrop-blur-md border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 rounded-lg text-sm font-semibold hover:border-[#00a8ff] dark:hover:border-[#00a8ff] transition-all">
                    <currentSort.icon className="w-4 h-4 text-[#00a8ff]" />
                    <span>Sắp xếp: <span className="text-[#00a8ff]">{currentSort.label}</span></span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                      <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#121214] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col py-2">
                          {sortOptions.map((opt) => (
                            <button key={opt.id} onClick={() => { setSortType(opt.id); setIsSortOpen(false); }} className={`px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${sortType === opt.id ? 'bg-blue-50 dark:bg-blue-500/10 text-[#00a8ff] font-bold border-l-4 border-[#00a8ff]' : 'text-gray-700 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-l-4 border-transparent'}`}>
                              <opt.icon className="w-4 h-4" /> <span>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* THANH TRƯỢT CHỌN MUA/THUÊ ACC */}
              <div className="flex bg-gray-200/80 dark:bg-zinc-800/80 p-1.5 rounded-xl relative w-full lg:w-72 shadow-inner border border-gray-300/50 dark:border-zinc-700/50">
                <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-[#1e1e20] rounded-lg shadow-md transition-all duration-300 ease-out ${tradeMode === 'rent' ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}></div>
                <button onClick={() => setTradeMode('buy')} className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold z-10 transition-colors ${tradeMode === 'buy' ? 'text-[#00a8ff]' : 'text-gray-600 dark:text-zinc-400'}`}>
                  <ShoppingCart className="w-4 h-4" /> Mua Acc
                </button>
                <button onClick={() => setTradeMode('rent')} className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold z-10 transition-colors ${tradeMode === 'rent' ? 'text-[#00a8ff]' : 'text-gray-600 dark:text-zinc-400'}`}>
                  <Key className="w-4 h-4" /> Thuê Acc
                </button>
              </div>

            </div>

            <div className="w-full relative pt-2 border-t border-gray-200/50 dark:border-zinc-800/50">
              <div className="flex items-center gap-3 overflow-x-auto py-4 px-6 -mx-6 scrollbar-hide">
                {filterButtons.map((btn) => {
                  const isActive = priceFilter === btn.id;
                  return (
                    <button key={btn.id} onClick={() => setPriceFilter(btn.id)} className={`flex-shrink-0 relative px-6 py-2.5 rounded-xl text-sm font-bold border whitespace-nowrap transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-[#008cff] to-[#00a8ff] border-transparent text-white shadow-[0_8px_20px_-6px_rgba(0,168,255,0.8)] scale-105' : 'bg-white/50 dark:bg-black/30 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:border-[#00a8ff] dark:hover:border-[#00a8ff] hover:-translate-y-0.5'}`}>
                      {btn.label}
                      {isActive && <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#ff3838] rounded-full flex items-center justify-center border-2 border-white dark:border-[#121214] shadow-sm z-10"><Check className="w-3 h-3 text-white" strokeWidth={4} /></div>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((acc) => {
              // LUÔN HIỂN THỊ GIÁ TRỊ THỰC LÀ GIÁ BÁN Ở NGOÀI
              const priceDisplay = acc.gia_ban ? `${Number((acc.gia_ban / 1000000).toFixed(2))}m` : "Liên hệ";

              return (
                <Link href={`/acc/${acc.ma_acc}`} key={acc.id} className="group">
                  <div className="bg-white dark:bg-[#121214] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-none border border-transparent dark:border-zinc-800 overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(0,168,255,0.15)] transition-all duration-300">
                    <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors duration-500 flex items-center justify-center">
                      {acc.anh_bia ? (
                        <img src={acc.anh_bia} alt={`Mã: ${acc.ma_acc}`} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full aspect-video flex items-center justify-center text-gray-400 dark:text-zinc-700"><Eye className="w-10 h-10" /></div>
                      )}
                      {acc.noi_bat && (
                        <div className="absolute top-0 left-0 bg-[#ff3838] text-white px-3 py-1 text-xs font-bold rounded-br-lg shadow-sm flex items-center gap-1.5 z-10">
                          <Flame className="w-4 h-4 text-yellow-300 animate-pulse" /> NỔI BẬT
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="font-bold text-[15px] text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-500">
                        Mã: {acc.ma_acc}
                        <button onClick={(e) => handleCopyMa(e, acc.ma_acc)} className="flex items-center gap-1 text-[#00a8ff] bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-gray-500 dark:text-zinc-400 text-[13px] font-medium transition-colors duration-500">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(acc.created_at).toLocaleDateString('vi-VN')}</div>
                        <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {acc.luot_xem || 0} views</div>
                      </div>
                      <div className="h-px w-full bg-gray-100 dark:bg-zinc-800 transition-colors duration-500"></div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500 dark:text-zinc-400 text-sm font-medium transition-colors duration-500">
                          Giá trị Acc: <span className="text-[#ff3838] font-extrabold text-xl ml-1">{priceDisplay}</span>
                        </div>
                        <div className="bg-[#f0f2f5] dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 px-4 py-1.5 rounded-md text-xs font-bold transition-colors duration-500 group-hover:bg-[#00a8ff] group-hover:text-white dark:group-hover:bg-[#00a8ff] shadow-sm">CHI TIẾT</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="w-full py-20 text-center text-gray-500 dark:text-zinc-500 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md rounded-2xl transition-colors duration-500 border border-dashed border-gray-300 dark:border-zinc-700">
              <Info className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-zinc-600" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-200">Không tìm thấy tài khoản!</h3>
              Radar không quét được tài khoản nào phù hợp với bộ lọc này.
            </div>
          )}
        </div>
      </div>

      <button onClick={scrollToTop} className={`fixed bottom-6 right-6 p-4 bg-[#00a8ff] hover:bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(0,168,255,0.4)] backdrop-blur-sm transition-all duration-500 z-50 group ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
}