"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase"; 
import { User, Lock, ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert("❌ Lỗi đăng nhập: " + error.message);
      setLoading(false);
    } else {
      // 🚀 ĐĂNG NHẬP THÀNH CÔNG LÀ BAY THẲNG VỀ TRANG CHỦ, KHÔNG CẦN BẤM OK!
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-blue-600 p-8 text-white text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 fill-white" />
          <h1 className="text-3xl font-extrabold flex items-center gap-2 justify-center tracking-tight">
            Đăng Nhập Admin
          </h1>
          <p className="text-blue-200 mt-2 font-medium">Dành riêng cho Boss Thế Văn Pubg</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" /> Email Admin
            </label>
            <input 
              required 
              type="email" 
              placeholder="VD: admin@example.com" 
              className="w-full border rounded-xl p-3 outline-none transition-all bg-white text-gray-950 font-semibold border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" /> Mật khẩu
            </label>
            <input 
              required 
              type="password" 
              placeholder="••••••••" 
              className="w-full border rounded-xl p-3 outline-none transition-all bg-white text-gray-950 font-semibold border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
          </div>

          <button type="submit" disabled={loading} className={`w-full mt-6 flex justify-center items-center gap-2 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all shadow-md ${ loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]" }`}>
            {loading ? "⏳ Đang đăng nhập..." : <><Lock className="w-6 h-6" /> ĐĂNG NHẬP HỆ THỐNG</>}
          </button>
          
          <div className="text-center pt-6 border-t mt-6">
            <Link href="/" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition justify-center font-medium">
                <ArrowLeft className="w-4 h-4" /> Trở về trang chủ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}