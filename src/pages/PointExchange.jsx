import React, { useState } from "react";

const dummyPointHistory = [
    { id: 1, date: "2025.08.12", exchanged: "2000point", balance: "6000point" },
    { id: 2, date: "2025.08.11", exchanged: "2000point", balance: "8000point" },
    { id: 3, date: "2025.08.08", exchanged: "2000point", balance: "10000point" },
    { id: 4, date: "2025.08.07", exchanged: "1000point", balance: "12000point" },
    { id: 5, date: "2025.08.05", exchanged: "2000point", balance: "10000point" },
    { id: 6, date: "2025.08.01", exchanged: "2000point", balance: "12000point" },
];

const PointExchange = ({ username = "홍길동" }) => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(dummyPointHistory.length / itemsPerPage);

    const paginatedHistory = dummyPointHistory.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div className="max-w-xs mx-auto bg-[#F5F5F5] min-h-screen font-sans flex flex-col">
            {/* 상단 카드 */}
            <div className="bg-[#73C03F] text-white rounded-b-3xl relative p-6 text-center">
                <img
                    src="../../public/arrow.png"
                    alt="알림 아이콘"
                    className="w-6 h-6 absolute top-4 left-4"
                />
                <div className="flex flex-col items-center">
                    <img
                        src="../../public/logo.svg"
                        alt="profile"
                        className="w-20 h-20 mb-2"
                    />
                    <div className="text-lg font-semibold">{username} 님</div>
                </div>

                {/* 포인트 정보 */}
                <div className="bg-white text-[#73C03F] rounded-2xl mt-4 py-4 flex justify-around font-bold">
                    <div>
                        <div className="text-sm">보유 포인트</div>
                        <div className="text-2xl">3000P</div>
                    </div>
                    <div className="flex items-center">▶</div>
                    <div>
                        <div className="text-sm">전환 포인트</div>
                        <div className="text-2xl">700P</div>
                    </div>
                </div>

                {/* 버튼 */}
                <button className="bg-white text-[#73C03F] font-bold rounded-lg px-6 py-2 mt-3 shadow">
                    전환하기
                </button>
            </div>

            {/* 내역 */}
            <div className="bg-white text-center py-3 font-semibold text-[#73C03F] text-sm border-b">
                전환 내역
            </div>

            <div className="bg-white flex-1 px-4 overflow-auto space-y-3 py-3">
                {paginatedHistory.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-lg shadow-sm p-3 flex justify-between text-sm"
                    >
                        <div>
                            <div className="text-gray-500 text-xs">전환 날짜</div>
                            <div>{item.date}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">전환포인트</div>
                            <div className="text-[#73C03F] font-semibold">
                                {item.exchanged}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">잔여포인트</div>
                            <div>{item.balance}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="bg-white">
                <div className="flex justify-center items-center space-x-2 py-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className={`text-[#73C03F] text-xl ${page === 1 ? "opacity-30 cursor-default" : "cursor-pointer"}`}
                    >
                        ◀
                    </button>

                    <span className="text-sm text-[#73C03F] font-semibold">{page}</span>

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

export default PointExchange;
