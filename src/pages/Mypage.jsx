import React, { useState, useEffect } from 'react'; // [포인트관련] useEffect 추가
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios'; // ✅ axios 사용

const MyPage = ({ username }) => {
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [totalPoints, setTotalPoints] = useState(0);
    const [pointsLoading, setPointsLoading] = useState(false);
    const [pointsError, setPointsError] = useState("");

    useEffect(() => {
        const fetchTotalPoints = async () => {
            try {
                setPointsLoading(true);
                setPointsError("");
                const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
                const token = localStorage.getItem("token");

                if (!token) {
                    setTotalPoints(0);
                    return;
                }

                const res = await axios.get(`${API_URL}/api/points/total`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                });

                if (res.data?.success) {
                    setTotalPoints(res.data.total ?? 0);
                } else {
                    setPointsError(res.data?.message || "포인트 정보를 불러오지 못했습니다.");
                }
            } catch (err) {
                setPointsError(
                    err?.response?.data?.message ||
                    "포인트 정보를 불러오는 중 오류가 발생했습니다."
                );
            } finally {
                setPointsLoading(false);
            }
        };

        fetchTotalPoints();
    }, []);

    const handleLogoutConfirm = async () => {
        if (loading) return;
        setError("");

        if (!password) {
            setError("비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${API_URL}/api/logout`,
                { username, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    timeout: 10000,
                }
            );

            if (res.data?.success) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                navigate("/login");
            } else {
                setError(res.data?.message || "로그아웃에 실패했습니다.");
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                (err?.response?.status === 401
                    ? "비밀번호가 일치하지 않습니다."
                    : err?.response?.status === 400
                    ? "요청 형식이 올바르지 않습니다."
                    : "네트워크 또는 서버 오류가 발생했습니다.");
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto" style={{ backgroundColor: '#73C03F' }}>
            {showLogout ? (
                <>
                    {/* Header */}
                    <div className="flex-none relative px-6 pt-6 pb-14 text-white h-[120px]">
                        <h1 className="absolute top-6 left-6 flex items-center gap-1">
                            <span className="text-[28px] font-extrabold tracking-tight">
                                {username || "사용자"}
                            </span>
                            <span className="text-[14px] font-normal">님</span>
                        </h1>

                        <img
                            src="../../public/logo.svg"
                            alt="캐릭터"
                            className="absolute bottom-0 right-6 w-20 h-20"
                        />
                    </div>

                    {/* 콘텐츠 영역 */}
                    <div className="flex-1 overflow-auto bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-12 shadow-md flex flex-col items-center">
                        <p className="text-[#73C03F] font-semibold text-base mb-6 w-full text-left">로그아웃</p>

                        <input
                            type="text"
                            value={username || ""}
                            readOnly
                            className="w-full border border-[#73C03F] rounded-lg px-4 py-3 mb-4 text-[#73C03F] font-medium focus:outline-none"
                        />

                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleLogoutConfirm();
                            }}
                            className="w-full border border-[#73C03F] rounded-lg px-4 py-3 mb-2 text-gray-700 focus:outline-none placeholder:text-[#73C03F]"
                        />

                        {error && <p className="w-full text-red-500 text-sm mb-4">{error}</p>}

                        <div className="flex gap-4 w-full mt-auto">
                            <button
                                onClick={() => {
                                    setShowLogout(false);
                                    setPassword("");
                                    setError("");
                                }}
                                className="flex-1 bg-[#73C03F] text-white rounded-lg py-3 font-semibold"
                                disabled={loading}
                            >
                                이전
                            </button>
                            <button
                                onClick={handleLogoutConfirm}
                                className={`flex-1 bg-[#73C03F] text-white rounded-lg py-3 font-semibold ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "처리중..." : "로그아웃"}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Header */}
                    <div className="flex-none relative px-6 pt-6 pb-14 text-white h-[120px]">
                        <h1 className="absolute top-6 left-6 flex items-center gap-1">
                            <span className="text-[28px] font-extrabold tracking-tight">
                                {username || "사용자"}
                            </span>
                            <span className="text-[14px] font-normal">님</span>
                        </h1>

                        <img src="../../public/logo.svg" alt="캐릭터" className="absolute bottom-0 right-6 w-20 h-20" />
                    </div>

                    {/* 콘텐츠 영역 */}
                    <div className="flex-1 overflow-auto bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-12 shadow-md flex flex-col">
                        <div className="mb-6">
                            <p className="text-sm font-medium text-[#73C03F] mb-2">보유 포인트</p>

                            {pointsLoading ? (
                                <p className="text-base text-gray-500">불러오는 중...</p>
                            ) : pointsError ? (
                                <p className="text-sm text-red-500">{pointsError}</p>
                            ) : (
                                <p className="text-4xl font-extrabold text-[#73C03F] leading-none">
                                    {totalPoints} <span className="text-sm font-medium text-[#73C03F] align-top">point</span>
                                </p>
                            )}

                            <hr className="border-[#73C03F] border my-6" />
                        </div>

                        <div className="flex gap-4 mb-8">
                            <button
                                type="button"
                                onClick={() => navigate("/report-history")}
                                className="flex-1 bg-[#73C03F] text-white rounded-xl py-5 font-semibold text-base flex flex-col items-center justify-center"
                                style={{ minHeight: '72px' }}
                            >
                                <span>제보 내역</span>
                                <span className="text-lg mt-1 underline">1건</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/verification-history")}
                                className="flex-1 bg-[#73C03F] text-white rounded-xl py-5 font-semibold text-base flex flex-col items-center justify-center"
                                style={{ minHeight: '72px' }}
                            >
                                <span>인증 내역</span>
                                <span className="text-lg mt-1 underline">4건</span>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/point-exchange")}
                                className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium text-base text-left px-4 flex justify-between items-center"
                            >
                                <span>포인트 전환</span>
                                <span className="text-xl">{'>'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/inquiry")}
                                className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium text-base text-left px-4 flex justify-between items-center"
                            >
                                <span>1:1 문의</span>
                                <span className="text-xl">{'>'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowLogout(true)}
                                className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium text-base text-left px-4 flex justify-between items-center"
                            >
                                <span>로그아웃</span>
                                <span className="text-xl">{'>'}</span>
                            </button>
                        </div>
                    </div>
                </> 
            )}
        <Navbar/>
        </div>
    );
};

export default MyPage;
