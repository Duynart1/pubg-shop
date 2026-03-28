import React from 'react';

export default function Loading() {
    // Tạo một mảng 8 phần tử ảo để map ra 8 khung xương (skeleton cards)
    const skeletonCards = Array(8).fill(null);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
            {/* Tiêu đề Search/Header Skeleton xịn xò (nếu cần) */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 w-full sm:w-96 bg-gray-200 rounded-full animate-pulse shadow-sm"></div>
            </div>

            {/* Grid hiển thị Khung xương tỏa sáng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skeletonCards.map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/* Khung ảnh cover (chuẩn tỷ lệ aspect-video giống hệt card thật) */}
                        <div className="w-full aspect-video bg-slate-200 animate-pulse"></div>

                        {/* Khung nội dung */}
                        <div className="p-4 flex-1 flex flex-col space-y-4">
                            {/* Cụm Mã Acc & Tag */}
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-5 w-1/4 bg-slate-200 rounded-full animate-pulse"></div>
                            </div>

                            {/* Tên Acc / Vũ khí */}
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
                            </div>

                            {/* Dải phân cách */}
                            <div className="h-px w-full bg-slate-100 my-2"></div>

                            {/* Khu vực Giá & Nút múc ngay */}
                            <div className="flex justify-between items-center mt-auto pt-2">
                                <div className="h-8 w-2/5 bg-slate-300 rounded animate-pulse"></div>
                                <div className="h-10 w-1/3 bg-blue-100 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}