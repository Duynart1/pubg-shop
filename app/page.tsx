"use client";

import { useEffect, useState } from "react";
import { UserCircle, ArrowUp, Eye, Copy } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([]);

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from("pubg_accounts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAccounts(data);
    if (error) console.error("Lỗi hút dữ liệu:", error);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <span className="text-2xl">💙</span> TRỌNG 2K8
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <UserCircle className="w-7 h-7 text-gray-600" />
          </button>
        </div>
      </header>

      {/* DANH SÁCH ACC */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Danh sách Acc Bán</h1>
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {accounts.length}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gray-800 group cursor-pointer">
                <img 
                  src={acc.anh_bia || "https://via.placeholder.com/500x300?text=No+Image"} 
                  alt={acc.ma_acc} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                {acc.noi_bat && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    🔥 NỔI BẬT
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">Mã: {acc.ma_acc}</span>
                    <button className="flex items-center gap-1 text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>🕒 {new Date(acc.created_at).toLocaleDateString("vi-VN")}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {acc.luot_xem || 0}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500 text-sm">Giá: </span>
                    <span className="text-red-500 font-bold text-lg">
                      {acc.gia_ban ? (acc.gia_ban / 1000000).toFixed(0) : 0}m
                    </span>
                  </div>
                  <button className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200">
                    CHI TIẾT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <button onClick={scrollToTop} className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg">
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}