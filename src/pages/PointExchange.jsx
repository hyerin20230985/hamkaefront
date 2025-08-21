import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const dummyPointHistory = [
    { id: 1, date: "2025.08.12", exchanged: "2000point", balance: "6000point" },
    { id: 2, date: "2025.08.11", exchanged: "2000point", balance: "8000point" },
    { id: 3, date: "2025.08.08", exchanged: "2000point", balance: "10000point" },
    { id: 4, date: "2025.08.07", exchanged: "1000point", balance: "12000point" },
    { id: 5, date: "2025.08.05", exchanged: "2000point", balance: "10000point" },
    { id: 6, date: "2025.08.01", exchanged: "2000point", balance: "12000point" },
    { id: 7, date: "2025.07.30", exchanged: "1500point", balance: "10000point" },
    { id: 8, date: "2025.07.28", exchanged: "3000point", balance: "11500point" },
    { id: 9, date: "2025.07.25", exchanged: "2000point", balance: "14500point" },
    { id: 10, date: "2025.07.20", exchanged: "2500point", balance: "16500point" },
    { id: 11, date: "2025.07.18", exchanged: "1000point", balance: "19000point" },
    { id: 12, date: "2025.07.15", exchanged: "2000point", balance: "20000point" },
    { id: 13, date: "2025.07.10", exchanged: "3000point", balance: "22000point" },
    { id: 14, date: "2025.07.05", exchanged: "1500point", balance: "25000point" },
    { id: 15, date: "2025.07.01", exchanged: "2000point", balance: "26500point" },
];
const PointExchange = ({ username = "홍길동" }) => {
    const navigate = useNavigate(); // 네비게이터 훅
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(dummyPointHistory.length / itemsPerPage);

    const paginatedHistory = dummyPointHistory.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div className="max-w-xs mx-auto bg-white min-h-screen font-sans flex flex-col">
            {/* ===== 상단 헤더(녹색, 상단 라운드 X) ===== */}
            <div className="bg-[#73C03F] text-white relative pt-1.5 pb-1.5 px-1.5">
                {/* 뒤로가기 아이콘 */}
                <img
                    src="../../public/arrow.png"
                    alt="뒤로가기"
                    className="w-6 h-6 absolute top-4 left-4"
                    onClick={() => navigate("/mypage")}  // Mypage로 이동
                />
                {/*이름 */}
                <div className="flex items-center justify-end mt-8 pr-4">
                    <div className="text-xl font-semibold">{username} 님</div>
                </div>
                {/* 흰색 포인트 박스 */}
                <div className="bg-white text-[#73C03F] rounded-t-[20px] mt-4 py-6 px-5 flex flex-col items-center">
                    {/* 로고 (흰색 박스 상단 중앙 고정) */}
                    <img
                        src="../../public/logo.svg"
                        alt="profile"
                        className="w-16 h-16 absolute top-10 left-12"
                    />
                    <div className="w-full flex justify-around font-bold mb-4">
                        <div className="text-center">
                            <div className="text-sm">보유 포인트</div>
                            <div className="text-4xl">3000P</div>
                        </div>
                        <div className="flex items-center text-lg">▶</div>
                        <div className="text-center">
                            <div className="text-sm">전환 포인트</div>
                            <div className="text-4xl">700P</div>
                        </div>
                    </div>

                    <button className="bg-[#73C03F] text-white font-bold rounded-lg px-6 py-2 mt-1 shadow">
                        전환하기
                    </button>
                </div>
            </div>

            {/* ===== 전환 내역 영역 (배경 흰색, 전체 연결) ===== */}
            <div className="flex-1 mt-3">
                {/* 헤더 행 */}
                <div className="grid grid-cols-3 text-[#73C03F] font-semibold text-xs py-3 px-3 text-center border-b border-[#73C03F]">
                    <div>전환 날짜</div>
                    <div>전환포인트</div>
                    <div>잔여포인트</div>
                </div>

                {/* 데이터 행 */}
                {paginatedHistory.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-3 text-center text-sm py-3 px-3 border-b border-[#73C03F]"
                    >
                        <div className="text-[#73C03F]">{item.date}</div>
                        <div className="text-[#73C03F]">{item.exchanged}</div>
                        <div className="text-[#73C03F]">{item.balance}</div>
                    </div>
                ))}
            </div>

            {/* ===== 페이지네이션 ===== */}
            <div className="mt-2">
                <div className="flex justify-center items-center space-x-4 py-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className={`text-[#73C03F] text-lg ${page === 1 ? "opacity-30 cursor-default" : "cursor-pointer"}`}
                    >
                        ◀
                    </button>

                    <span className="text-sm text-[#73C03F] font-semibold">{page}</span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        className={`text-[#73C03F] text-lg ${page === totalPages ? "opacity-30 cursor-default" : "cursor-pointer"}`}
                    >
                        ▶
                    </button>
                </div>
            </div>
        <Navbar/>
        </div>
    );
};

export default PointExchange;
