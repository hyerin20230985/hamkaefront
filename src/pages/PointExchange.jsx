// [포인트 전환]
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/authContext.jsx";
import { pointsAPI } from "../lib/pointsAPI";
import Navbar from "../components/Navbar";

const PointExchange = () => {
    const navigate = useNavigate();
    const { username, token } = useAuth(); // useAuth 훅으로 사용자 정보 가져오기

    // 로딩 및 에러 상태를 추가하여 사용자 경험 개선
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [pointHistory, setPointHistory] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({ currentPoints: 0, availablePoints: 0 });

    // 서버로부터 데이터를 가져오는 함수
    const fetchData = async () => {
        setLoading(true); 
        setError(null);
        try {
            // 포인트 현황과 이력을 동시에 요청하여 로딩 시간을 단축
            const [summaryRes, historyRes] = await Promise.all([
                pointsAPI.summary(),
                pointsAPI.history()
            ]);

            if (summaryRes.success && historyRes.success) {
                const summaryData = summaryRes.data || summaryRes;
                const historyData = historyRes.data || historyRes || [];
                
                setSummary(summaryData);
                setPointHistory(historyData);
                setTotalPages(Math.ceil(historyData.length / itemsPerPage));
            } else {
                throw new Error("데이터를 가져오는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("포인트 데이터 불러오기 실패:", err);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트가 처음 로드될 때 데이터를 불러옴
    useEffect(() => {
        if (token) {
            fetchData();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    // 현재 페이지에 맞는 내역만 잘라내기
    const paginatedHistory = pointHistory.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // ✅ [수정] 포인트와 상품권 종류를 인자로 받도록 수정
    const handleExchange = async (pointsToUse, rewardType) => {
        if (summary.availablePoints < pointsToUse) {
            alert(`전환 가능한 포인트가 ${pointsToUse.toLocaleString()}P 이상이어야 합니다.`);
            return;
        }

        if (!window.confirm(`${pointsToUse.toLocaleString()}P를 상품권으로 전환하시겠습니까?`)) {
            return;
        }

        try {
            const res = await pointsAPI.redeem({ pointsUsed: pointsToUse, rewardType: rewardType });
            
            if (res.success) {
                alert("상품권 교환 완료! 핀번호가 발급되었습니다.");
                await fetchData(); 
            } else {
                alert(res.message || "교환에 실패했습니다.");
            }
        } catch (err) {
            console.error("상품권 교환 실패:", err);
            alert(err.response?.data?.message || "상품권 교환 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen">{error}</div>;
    }

    return (
        <div className="w-[375px] mx-auto bg-white min-h-screen font-sans flex flex-col">
            {/* ===== 상단 헤더 ===== */}
            <div className="bg-[#73C03F] text-white relative pt-2 pb-2 px-2">
                <img
                    src="/arrow.png"
                    alt="뒤로가기"
                    className="w-6 h-6 absolute top-4 left-4 cursor-pointer"
                    onClick={() => navigate("/mypage")}
                />
                <div className="flex items-center justify-end mt-2 pr-4">
                    <div className="text-xl font-semibold">{username} 님</div>
                </div>
                <div className="bg-white text-[#73C03F] rounded-t-[20px] mt-2 pt-5 pb-2 px-4 flex flex-col items-center">
                    <img
                        src="/logo.svg"
                        alt="profile"
                        className="w-16 h-16 absolute top-2 left-12"
                    />
                    <div className="w-full flex justify-around font-bold mb-2">
                        <div className="text-center">
                            <div className="text-sm">보유 포인트</div>
                            <div className="text-4xl">{summary.currentPoints.toLocaleString()}P</div>
                        </div>
                        <div className="flex items-center text-lg">▶</div>
                        <div className="text-center">
                            <div className="text-sm">전환 가능</div>
                            <div className="text-4xl">{summary.availablePoints.toLocaleString()}P</div>
                        </div>
                    </div>

                    {/* ✅ [수정] 전환 버튼을 여러 개로 분리 */}
                    <div className="w-full flex flex-col items-center gap-2">
                        <button
                            onClick={() => handleExchange(5000, "FIVE_THOUSAND")}
                            disabled={summary.availablePoints < 5000}
                            className="w-full bg-[#73C03F] text-white font-bold rounded-lg px-4 py-2 shadow active:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            5,000P 전환하기
                        </button>
                        <button
                            onClick={() => handleExchange(10000, "TEN_THOUSAND")}
                            disabled={summary.availablePoints < 10000}
                            className="w-full bg-[#73C03F] text-white font-bold rounded-lg px-4 py-2 shadow active:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            10,000P 전환하기
                        </button>
                        <button
                            onClick={() => handleExchange(30000, "THIRTY_THOUSAND")}
                            disabled={summary.availablePoints < 30000}
                            className="w-full bg-[#73C03F] text-white font-bold rounded-lg px-4 py-2 shadow active:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            30,000P 전환하기
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== 전환 내역 영역 ===== */}
            <div className="flex-1 mt-2">
                <div className="grid grid-cols-3 text-[#73C03F] font-semibold text-xs py-2 px-1 text-center border-b border-[#73C03F]">
                    <div>전환날짜</div>
                    <div>전환포인트</div>
                    <div>구분</div>
                </div>

                {paginatedHistory.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-3 text-center text-sm py-2 px-2 border-b border-gray-200"
                    >
                        <div className="text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`font-semibold ${item.points > 0 ? "text-blue-600" : "text-red-600"}`}>
                            {item.points.toLocaleString()}P
                        </div>
                        <div className="text-gray-500">{item.description}</div>
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
                    <span className="text-sm text-[#73C03F] font-semibold">{page} / {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        className={`text-[#73C03F] text-lg ${page === totalPages ? "opacity-30 cursor-default" : "cursor-pointer"}`}
                    >
                        ▶
                    </button>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default PointExchange;
