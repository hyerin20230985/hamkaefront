import React, { useState } from "react";
import Navbar from "../components/Navbar";

const dummyData = [
    {
        id: 1,
        date: "2025.08.13 PM 21:30",
        location: "경기도 안양시 만안구 성결대학로 53",
        content: "",
        images: [
            "../../public/sample/tresh-1.jpg",
            "../../public/sample/tresh-1.jpg"
        ],
    },
    {
        id: 2,
        date: "2025.08.29 PM 21:30",
        location: "서울특별시 강남구 테헤란로 123",
        content: "쓰레기 무단투기",
        images: ["../../public/sample/tresh-1.jpg"],
    },
];

const ReportHistory = ({ username }) => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(dummyData.length / itemsPerPage);
    const [selectedItem, setSelectedItem] = useState(null);

    const paginatedHistory = dummyData.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleClickItem = (item) => setSelectedItem(item);
    const handleBack = () => setSelectedItem(null);

    // 선택 항목 화면
    if (selectedItem) {
        return (
            <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto bg-[#73C03F]">
                {/* Header */}
                <div className="flex-none relative px-6 pt-6 pb-6 text-white">
                    <button
                        onClick={handleBack}
                        className="absolute left-4 top-6 font-medium text-base text-white"
                    >
                        &lt;
                    </button>
                    <span className="absolute left-10 top-6 text-white font-bold text-xl">
                        제보내역
                    </span>
                    <div className="mt-12 text-white font-bold text-lg">
                        {selectedItem.date}
                    </div>
                    <div className="mt-2 flex text-white font-bold text-2xl leading-tight">
                        <img
                            src="../../public/ReportHistory1.png"
                            alt="location icon"
                            className="w-4 h-4 mr-1 mt-2"
                        />
                        {selectedItem.location}
                    </div>
                </div>

                {/* 콘텐츠 영역 */}
                <div className="flex-1 overflow-auto bg-white rounded-t-[28px] px-4 py-6 flex flex-col">
                    <label className="text-[#73C03F] font-semibold mb-2 text-base">
                        내용
                    </label>
                    <textarea
                        className="border-2 border-[#73C03F] rounded-lg p-2 text-sm resize-none mb-4 h-40"
                        value={selectedItem.content}
                        readOnly
                    />
                    <div
                        className={`grid gap-2 overflow-auto ${
                            selectedItem.images.length === 1
                                ? "grid-cols-1"
                                : selectedItem.images.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2 sm:grid-cols-3"
                        }`}
                    >
                        {selectedItem.images.map((img, idx) => (
                            <div key={idx} className="w-full aspect-square">
                                <img
                                    src={img}
                                    alt={`image-${idx}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <Navbar />
            </div>
        );
    }

    // 전체 내역 화면
    return (
        <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto bg-[#73C03F]">
            {/* Header */}
            <div className="flex-none relative px-6 pt-6 pb-6 text-white h-[140px]">
                <h1 className="absolute top-6 left-6 text-[28px] font-extrabold">
                    {username || "사용자"}님
                </h1>
                <img
                    src="../../public/logo.svg"
                    alt="logo"
                    className="absolute top-6 right-6 w-20 h-20"
                />
            </div>

            {/* Subheader */}
            <div className="flex-none bg-white text-center py-3 font-semibold text-[#73C03F] text-sm border-b rounded-t-[20px]">
                제보내역
            </div>

            {/* 콘텐츠 영역 */}
            <div className="flex-1 overflow-auto bg-white px-6 pt-4 pb-12">
                {paginatedHistory.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center bg-[#73C03F] text-white px-4 py-4 rounded-xl mb-3 cursor-pointer"
                        onClick={() => handleClickItem(item)}
                    >
                        <span className="text-sm font-medium">{item.date}</span>
                        <span className="text-xl">{">"}</span>
                    </div>
                ))}
            </div>

            {/* Footer / Pagination */}
            <div className="flex-none bg-white pb-6 px-6">
                <div className="flex justify-center items-center space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className={`text-[#73C03F] text-xl ${
                            page === 1 ? "opacity-30 cursor-default" : "cursor-pointer"
                        }`}
                    >
                        ◀
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full ${
                                page === i + 1 ? "bg-[#73C03F]" : "bg-gray-300"
                            }`}
                        ></div>
                    ))}
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        className={`text-[#73C03F] text-xl ${
                            page === totalPages
                                ? "opacity-30 cursor-default"
                                : "cursor-pointer"
                        }`}
                    >
                        ▶
                    </button>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default ReportHistory;
