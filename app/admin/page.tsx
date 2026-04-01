"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Save, ArrowLeft, ImagePlus, X, UploadCloud, GripVertical } from "lucide-react";
import Link from "next/link";

function AdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);

  // THÊM TRƯỜNG DỮ LIỆU CHO THUÊ
  const [formData, setFormData] = useState({
    ma_acc: "",
    tieu_de: "",
    gia_ban: "",
    noi_bat: false,
    cho_thue: false,
    gia_thue_ngay: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [detailPreviews, setDetailPreviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccDetail = async () => {
      if (!editId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("pubg_accounts")
        .select("*")
        .eq("id", editId)
        .single();

      if (data) {
        setFormData({
          ma_acc: data.ma_acc || "",
          tieu_de: data.tieu_de || "",
          gia_ban: String(data.gia_ban) || "",
          noi_bat: data.noi_bat || false,
          cho_thue: data.cho_thue || false,
          gia_thue_ngay: data.gia_thue_ngay ? String(data.gia_thue_ngay) : "",
        });

        setCoverPreview(data.anh_bia);

        if (data.anh_chi_tiet && data.anh_chi_tiet.length > 0) {
          const oldImagesPreviews = data.anh_chi_tiet.map((url: string, index: number) => ({
            id: `old-${index}-${Date.now()}`,
            type: 'old',
            src: url
          }));
          setDetailPreviews(oldImagesPreviews);
        }
      }
      setLoading(false);
    };

    fetchAccDetail();
  }, [editId]);

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
      const newPreviews = filesArray.map((file) => ({
        id: `new-${Date.now()}-${Math.random()}`,
        type: 'new',
        src: URL.createObjectURL(file),
        file: file
      }));
      setDetailPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeDetailImage = (id: string, src: string) => {
    if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    setDetailPreviews((prev) => prev.filter((img) => img.id !== id));
  };

  const [draggedItem, setDraggedItem] = useState<any>(null);

  const onDragStart = (e: React.DragEvent, img: any) => {
    setDraggedItem(img);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add('opacity-50', 'scale-105');
  };

  const onDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    const draggedItemIndex = detailPreviews.findIndex(item => item.id === draggedItem.id);
    if (draggedItemIndex === index) return;

    const newDetailPreviews = [...detailPreviews];
    newDetailPreviews.splice(draggedItemIndex, 1);
    newDetailPreviews.splice(index, 0, draggedItem);
    setDetailPreviews(newDetailPreviews);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    e.currentTarget.classList.remove('opacity-50', 'scale-105');
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
    if (!coverPreview) {
      alert("⚠️ Boss ơi, quên chọn Ảnh Bìa rồi!");
      return;
    }

    setLoading(true);

    try {
      let finalCoverUrl = coverPreview;
      if (coverFile) {
        finalCoverUrl = await uploadImageToStorage(coverFile);
      }

      const sortedDetailUrls = await Promise.all(
        detailPreviews.map(async (img) => {
          if (img.type === 'new' && img.file) return await uploadImageToStorage(img.file);
          else if (img.type === 'old') return img.src;
          return null;
        })
      );

      const finalDetailUrls = sortedDetailUrls.filter(url => url !== null);

      // CẬP NHẬT TRƯỜNG CHO THUÊ VÀO DATABASE
      const commonData = {
        ma_acc: formData.ma_acc,
        tieu_de: formData.tieu_de,
        gia_ban: Number(formData.gia_ban),
        anh_bia: finalCoverUrl,
        anh_chi_tiet: finalDetailUrls,
        noi_bat: formData.noi_bat,
        cho_thue: formData.cho_thue,
        gia_thue_ngay: formData.cho_thue ? Number(formData.gia_thue_ngay) : null,
        trang_thai: "selling",
      };

      let error;
      if (editId) {
        const result = await supabase.from("pubg_accounts").update(commonData).eq("id", editId);
        error = result.error;
      } else {
        const result = await supabase.from("pubg_accounts").insert([commonData]);
        error = result.error;
      }

      if (error) throw error;

      alert(`✅ Boss Thế Văn Pubg ơi, ${editId ? "CẬP NHẬT" : "ĐĂNG"} Acc thành công rực rỡ!`);
      router.push("/");

    } catch (error: any) {
      alert("❌ Boss ơi, có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

        <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            ⚙️ {editId ? `Sửa Acc PUBG ID: ${editId}` : "Studio Quản Trị Đăng Acc Mới"}
          </h1>
          <Link href="/" className="flex items-center gap-1 hover:text-blue-200 transition">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã Acc PUBG</label>
              <input required type="text" placeholder="VD: 88888" className="w-full border rounded-xl p-3 outline-none transition-all bg-white text-gray-950 font-semibold text-lg border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={formData.ma_acc} onChange={(e) => setFormData({ ...formData, ma_acc: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá bán (VNĐ)</label>
              <input required type="number" placeholder="VD: 15000000" className="w-full border rounded-xl p-3 outline-none transition-all bg-white text-gray-950 font-semibold text-lg border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={formData.gia_ban} onChange={(e) => setFormData({ ...formData, gia_ban: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề Acc (Tóm tắt đặc điểm nổi bật)</label>
            <input required type="text" placeholder="VD: Acc Vip có M416 Băng Cốt" className="w-full border rounded-xl p-3 outline-none transition-all bg-white text-gray-950 font-semibold text-lg border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={formData.tieu_de} onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2.5">📸 Ảnh Bìa (Bắt buộc)</label>
              <label className="relative flex flex-col items-center justify-center w-full aspect-video bg-gray-950 rounded-xl cursor-pointer hover:bg-gray-800 hover:border-blue-500 border-2 border-dashed border-gray-300 transition overflow-hidden group">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                    <UploadCloud className="w-10 h-10 mb-2" />
                    <p className="text-sm font-semibold text-center px-2">Bấm hoặc Thả ảnh vào</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                {coverPreview && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-bold">Đổi ảnh khác</div>
                )}
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">🖼️ Ảnh chi tiết ({detailPreviews.length}) (Kéo thả để đổi vị trí 👇)</label>
              <div className="grid grid-cols-2 gap-3.5">
                {detailPreviews.map((img, index) => (
                  <div key={img.id} className="relative aspect-video rounded-xl bg-gray-50 overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all cursor-grab group" draggable="true" onDragStart={(e) => onDragStart(e, img)} onDragEnter={(e) => onDragEnter(e, index)} onDragOver={onDragOver} onDragEnd={onDragEnd}>
                    <img src={img.src} alt={`Detail ${index}`} className="w-full h-full object-contain" />
                    <div className="absolute top-1.5 left-1.5 bg-white/70 backdrop-blur-sm p-1 rounded-md text-gray-700 opacity-60 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3 h-3" />
                    </div>
                    <button type="button" onClick={() => removeDetailImage(img.id, img.src)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition">
                      <X className="w-3 h-3" />
                    </button>
                    {img.type === 'old' && (
                      <span className="absolute bottom-1 right-1 bg-gray-100 text-gray-600 text-[8px] px-1.5 py-0.5 rounded font-bold">ẢNH CŨ</span>
                    )}
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition text-gray-500 hover:text-blue-500 group">
                  <ImagePlus className="w-8 h-8 mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-semibold">Thêm ảnh phụ</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleDetailChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="noi_bat" className="w-5 h-5 cursor-pointer accent-red-500" checked={formData.noi_bat} onChange={(e) => setFormData({ ...formData, noi_bat: e.target.checked })} />
              <label htmlFor="noi_bat" className="text-sm font-bold text-red-600 cursor-pointer">🔥 Gắn tem NỔI BẬT cho Acc này</label>
            </div>

            {/* KHU VỰC CHỌN CHO THUÊ ACC */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cho_thue" className="w-5 h-5 cursor-pointer accent-blue-600" checked={formData.cho_thue} onChange={(e) => setFormData({ ...formData, cho_thue: e.target.checked })} />
                <label htmlFor="cho_thue" className="text-sm font-bold text-blue-700 cursor-pointer">🔑 Cho phép THUÊ Acc này</label>
              </div>

              {formData.cho_thue && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-1.5">Giá thuê 1 ngày (VNĐ)</label>
                  <input required={formData.cho_thue} type="number" placeholder="VD: 50000" className="w-full border rounded-xl p-3 outline-none transition-all bg-white text-gray-950 font-semibold text-lg border-blue-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={formData.gia_thue_ngay} onChange={(e) => setFormData({ ...formData, gia_thue_ngay: e.target.value })} />
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full mt-6 flex justify-center items-center gap-2 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all shadow-md active:scale-[0.98] ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"}`}>
            {loading ? "🚀 Đang bơm dữ liệu lên trạm vũ trụ..." : <><Save className="w-6 h-6" /> {editId ? "CẬP NHẬT ACC PUBG" : "ĐĂNG ACC LÊN SHOP"}</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPageContent />
    </Suspense>
  )
}