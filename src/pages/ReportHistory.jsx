import React, { useState, useEffect } from "react";

const dummyData = [
    {
        id: 1,
        date: "2025.08.30 PM 21:30",
        location: "경기도 안양시 만안구 성결대학로 53",
        content: "",
        images: [
            "../../public/sample/tresh-1.jpg",
            "../../public/sample/tresh-1.jpg"
        ],
    },
    {
        id: 2,
        date: "2025.08.29 PM 20:15",
        location: "서울특별시 강남구 테헤란로 123",
        content: "쓰레기 무단투기",
        images: [
            "../../public/sample/tresh-1.jpg",
        ],
    },
    // 더미 데이터 계속 추가 가능
];

const ReportHistory = ({ username }) => { // username을 props로 받기
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(dummyData.length / itemsPerPage);

    const [selectedItem, setSelectedItem] = useState(null);

    const paginatedHistory = dummyData.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleClickItem = (item) => {
        setSelectedItem(item);
    };

    const handleBack = () => {
        setSelectedItem(null);
    };

    if (selectedItem) {
        return (
            <div className="max-w-xs mx-auto min-h-screen bg-[#F5F5F5] font-sans flex flex-col">
                <div className="bg-[#73C03F] text-white rounded-b-3xl relative p-4">
                    <button
                        onClick={handleBack}
                        className="text-white font-bold text-lg absolute left-4 top-4"
                    >
                        &lt; 제보내역
                    </button>
                    <div className="mt-10 text-white text-base font-semibold">{selectedItem.date}</div>
                    <div className="mt-2 flex items-center text-white text-sm">
                        <img
                            src="../../public/ReportHistory1.png"
                            alt="location icon"
                            className="w-4 h-4 mr-1"
                        />
                        {selectedItem.location}
                    </div>
                </div>

                <div className="bg-white rounded-t-3xl p-4 flex-1 flex flex-col">
                    <label className="text-[#73C03F] font-semibold mb-2">내용</label>
                    <textarea
                        className="border border-[#73C03F] rounded-md p-2 text-sm resize-none mb-4"
                        value={selectedItem.content}
                        readOnly
                        rows={4}
                    />
                    <div className="grid grid-cols-2 gap-2 overflow-auto">
                        {selectedItem.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`image-${idx}`}
                                className="w-full rounded-md"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xs mx-auto bg-[#F5F5F5] min-h-screen font-sans flex flex-col">
            <div className="bg-[#73C03F] text-white rounded-b-3xl relative pb-6 pt-4 px-4">
                <img
                    src="/arrow.png"
                    alt="arrow"
                    className="w-5 h-5 absolute top-4 right-4"
                />
                <div className="flex justify-between items-center mt-10">
                    <h2 className="text-xl font-bold ml-1">
                        안녕하세요 {username}님! {/* username을 출력 */}
                    </h2>
                    <img
                        src="../../public/logo.svg"
                        alt="logo"
                        className="w-16 h-16"
                    />
                </div>
            </div>

            <div className="bg-white text-center py-3 font-semibold text-[#73C03F] text-sm border-b">
                제보내역
            </div>

            <div className="bg-white px-4 flex-1 pt-3 overflow-auto">
                {paginatedHistory.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center bg-[#73C03F] text-white px-4 py-3 rounded-lg mb-3 cursor-pointer"
                        onClick={() => handleClickItem(item)}
                    >
                        <span className="text-sm font-medium">{item.date}</span>
                        <img
                            src="../../public/arrow.png"
                            alt="arrow"
                            className="w-4 h-4"
                        />
                    </div>
                ))}
            </div>

            <div className="bg-white">
                <div className="flex justify-center items-center space-x-2 pb-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className={`text-[#73C03F] text-xl ${page === 1 ? "opacity-30 cursor-default" : "cursor-pointer"}`}
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
                        className={`text-[#73C03F] text-xl ${page === totalPages ? "opacity-30 cursor-default" : "cursor-pointer"}`}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportHistory;
