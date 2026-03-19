"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Save, ArrowLeft, ImagePlus, X, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ma_acc: "",
    tieu_de: "",
    gia_ban: "",
    noi_bat: false,
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setDetailFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setDetailPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeDetailImage = (index: number) => {
    setDetailFiles((prev) => prev.filter((_, i) => i !== index));
    setDetailPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImageToStorage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from("pubg_images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("pubg_images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile) {
      alert("⚠️ Boss ơi, quên chọn Ảnh Bìa rồi!");
      return;
    }

    setLoading(true);

    try {
      // 1. Up ảnh bìa
      const coverUrl = await uploadImageToStorage(coverFile);

      // 2. LOGIC MỚI: Sắp xếp ảnh phụ theo tên file (VD: 1.jpg, 2.jpg) trước khi Up
      const sortedDetailFiles = [...detailFiles].sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      });

      // 3. Up 1 loạt ảnh phụ đã được sắp xếp
      const detailUrls = await Promise.all(
        sortedDetailFiles.map((file) => uploadImageToStorage(file))
      );

      // 4. Bơm vào cơ sở dữ liệu
      const { error } = await supabase.from("pubg_accounts").insert([
        {
          ma_acc: formData.ma_acc,
          tieu_de: formData.tieu_de,
          gia_ban: Number(formData.gia_ban),
          anh_bia: coverUrl,
          anh_chi_tiet: detailUrls,
          noi_bat: formData.noi_bat,
          trang_thai: "selling",
        },
      ]);

      if (error) throw error;

      alert("✅ Đăng Acc lên Shop thành công rực rỡ!");
      
      setFormData({ ma_acc: "", tieu_de: "", gia_ban: "", noi_bat: false });
      setCoverFile(null);
      setCoverPreview(null);
      setDetailFiles([]);
      setDetailPreviews([]);

    } catch (error: any) {
      alert("❌ Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🚀 Studio Quản Trị Đăng Acc
          </h1>
          <Link href="/" className="flex items-center gap-1 hover:text-blue-200 transition">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Ô Mã Acc Đậm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã Acc</label>
              <input 
                required 
                type="text" 
                placeholder="VD: 88888" 
                className="w-full border rounded-lg p-3 outline-none transition-all bg-white text-gray-950 font-semibold text-lg border-gray-300 placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                value={formData.ma_acc} 
                onChange={(e) => setFormData({ ...formData, ma_acc: e.target.value })} 
              />
            </div>
            {/* Ô Giá Bán Đậm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá bán (VNĐ)</label>
              <input 
                required 
                type="number" 
                placeholder="VD: 15000000" 
                className="w-full border rounded-lg p-3 outline-none transition-all bg-white text-gray-950 font-semibold text-lg border-gray-300 placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                value={formData.gia_ban} 
                onChange={(e) => setFormData({ ...formData, gia_ban: e.target.value })} 
              />
            </div>
          </div>

          {/* Ô Tiêu Đề Đậm */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề Acc</label>
            <input 
              required 
              type="text" 
              placeholder="VD: Acc Vip có M416 Băng Cốt" 
              className="w-full border rounded-lg p-3 outline-none transition-all bg-white text-gray-950 font-semibold text-lg border-gray-300 placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
              value={formData.tieu_de} 
              onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-800 mb-2">📸 Ảnh Bìa (Bắt buộc)</label>
              <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition overflow-hidden group">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                    <UploadCloud className="w-10 h-10 mb-2" />
                    <p className="text-sm font-semibold text-center px-2">Bấm hoặc Thả ảnh</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                {coverPreview && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-bold">Đổi ảnh khác</div>
                )}
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">🖼️ Ảnh Chi Tiết (Nhiều ảnh)</label>
              <div className="grid grid-cols-3 gap-2">
                {detailPreviews.map((preview, index) => (
                  <div key={index} className="relative h-24 rounded-lg overflow-hidden border">
                    <img src={preview} alt={`Detail ${index}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeDetailImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition text-gray-500 hover:text-blue-500">
                  <ImagePlus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleDetailChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" id="noi_bat" className="w-5 h-5 cursor-pointer accent-red-500" checked={formData.noi_bat} onChange={(e) => setFormData({ ...formData, noi_bat: e.target.checked })} />
            <label htmlFor="noi_bat" className="text-sm font-bold text-red-600 cursor-pointer">🔥 Gắn tem NỔI BẬT cho Acc này</label>
          </div>

          <button type="submit" disabled={loading} className={`w-full mt-6 flex justify-center items-center gap-2 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all shadow-md ${ loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg" }`}>
            {loading ? "🚀 Đang bơm dữ liệu lên trạm vũ trụ..." : <><Save className="w-6 h-6" /> ĐĂNG ACC LÊN SHOP</>}
          </button>
        </form>
      </div>
    </div>
  );
}