"use client";

import { useEffect, useState } from "react";
import { UserCircle, ArrowUp, Eye, Copy, Pencil, Trash2, Crown } from "lucide-react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // ⚠️ ĐÃ CHỐT EMAIL CHÍNH THỨC CỦA BOSS LÀM ADMIN
  const bossAdminEmail = "duynart3101@gmail.com"; 
  const isAdmin = user && user.email === bossAdminEmail; 

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from("pubg_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setAccounts(data);
      if (error) console.error("Lỗi hút dữ liệu:", error);
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchAccounts();
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, maAcc: string) => {
    if (!isAdmin) return alert("❌ Chỉ Admin mới được Xóa!");
    
    if (confirm(`⚠️ Boss Thế Anh Pubg ơi, Boss chắc chắn muốn XÓA VĨNH VIỄN acc mã số #${maAcc} này chứ?`)) {
      const { error } = await supabase.from("pubg_accounts").delete().eq("id", id);
      if (error) {
        alert("❌ Xóa thất bại: " + error.message);
      } else {
        alert("✅ Đã xóa Acc thành công!");
        setAccounts(accounts.filter(acc => acc.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl tracking-tight">
            <Crown className="w-8 h-8 fill-blue-600" /> THẾ ANH PUBG
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">🛡️ ADMIN</span>}
            <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-700">
              <UserCircle className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Danh sách Acc Bán</h1>
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {accounts.length}
            </span>
          </div>
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md">
              Thêm Acc Mới
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              
              <div className="relative w-full group overflow-hidden bg-gray-100">
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin?edit=${acc.id}`} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white shadow transition">
                          <Pencil className="w-4 h-4 text-gray-800" />
                      </Link>
                      <button onClick={() => handleDelete(acc.id, acc.ma_acc)} className="p-2 bg-red-50/90 backdrop-blur-sm rounded-lg hover:bg-red-100 shadow transition">
                          <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                  </div>
                )}

                <img 
                  src={acc.anh_bia || "https://via.placeholder.com/500x300?text=No+Image"} 
                  alt={acc.ma_acc} 
                  className="w-full h-auto object-cover opacity-95 group-hover:opacity-100 transition-opacity block"
                />
                
                {acc.noi_bat && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow">
                    🔥 NỔI BẬT
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm truncate">Mã: {acc.ma_acc}</span>
                    <button className="flex items-center gap-1 text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>🕒 {new Date(acc.created_at).toLocaleDateString("vi-VN")}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {acc.luot_xem || 0}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <div>
                    <span className="text-gray-500 text-sm">Giá: </span>
                    <span className="text-red-500 font-bold text-lg">
                      {acc.gia_ban ? (acc.gia_ban / 1000000).toFixed(0) : 0}m
                    </span>
                  </div>
                  
                  <Link 
                    href={`/acc/${acc.ma_acc}`}
                    className="text-xs font-bold text-gray-700 bg-gray-100 px-4 py-2.5 rounded hover:bg-gray-200 transition-colors"
                  >
                    CHI TIẾT
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <button onClick={scrollToTop} className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors">
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}