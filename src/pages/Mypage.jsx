// [마이페이지]
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const MyPage = ({ username }) => {
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 포인트, 제보/인증 건수 상태
    const [summary, setSummary] = useState({ currentPoints: 0 });
    const [reportCount, setReportCount] = useState(0);
    const [verificationCount, setVerificationCount] = useState(0);

    const [pointsLoading, setPointsLoading] = useState(false);
    const [pointsError, setPointsError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("token");

    // ✅ 마이페이지 진입 시 사용자 데이터 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                setPointsLoading(true);
                // 보유 포인트 조회
                const summaryRes = await axios.get(`${API_URL}/api/users/points/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (summaryRes.data.success) {
                    setSummary(summaryRes.data.data);
                }

                // 제보 내역 개수 조회
                const reportRes = await axios.get(`${API_URL}/api/markers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (reportRes.data.success) {
                    setReportCount(reportRes.data.data.length);
                }

                // 인증 내역 개수 조회
                const verificationRes = await axios.get(`${API_URL}/api/verifications`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (verificationRes.data.success) {
                    setVerificationCount(verificationRes.data.data.length);
                }
            } catch (err) {
                setPointsError("데이터를 불러오는 중 오류가 발생했습니다.");
                console.error(err);
            } finally {
                setPointsLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    // ✅ 로그아웃
    const handleLogoutConfirm = async () => {
        if (loading) return;
        setError("");

        if (!password) {
            setError("비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${API_URL}/auth/logout`,
                { username, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                navigate("/login");
            } else {
                setError(res.data.message || "로그아웃에 실패했습니다.");
            }
        } catch (err) {
            setError(
                err?.response?.data?.message || "서버 오류로 로그아웃에 실패했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto" style={{ backgroundColor: '#73C03F' }}>
            {showLogout ? (
                <>
                    {/* ===== 로그아웃 화면 ===== */}
                    <div className="flex-none relative px-6 pt-6 pb-14 text-white h-[120px]">
                        <h1 className="absolute top-6 left-6 flex items-center gap-1">
                            <span className="text-[28px] font-extrabold tracking-tight">
                                {username || "사용자"}
                            </span>
                            <span className="text-[14px] font-normal">님</span>
                        </h1>
                        <img src="../../public/logo.svg" alt="캐릭터" className="absolute bottom-0 right-6 w-20 h-20" />
                    </div>

                    <div className="flex-1 overflow-auto bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-12 shadow-md flex flex-col items-center">
                        <p className="text-[#73C03F] font-semibold text-base mb-6 w-full text-left">로그아웃</p>
                        <input type="text" value={username || ""} readOnly className="w-full border border-[#73C03F] rounded-lg px-4 py-3 mb-4 text-[#73C03F] font-medium focus:outline-green-600 focus:outline-2 focus:outline-offset-2" />
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogoutConfirm()}
                            className="w-full border border-[#73C03F] rounded-lg px-4 py-3 mb-2 text-gray-700 placeholder:text-[#73C03F] focus:outline-green-600 focus:outline-2 focus:outline-offset-2"
                        />
                        {error && <p className="w-full text-red-500 text-sm mb-4">{error}</p>}
                        <div className="flex gap-4 w-full mt-10">
                            <button onClick={() => { setShowLogout(false); setPassword(""); setError(""); }} className="flex-1 bg-[#73C03F] text-white rounded-lg py-3 font-semibold ">이전</button>
                            <button onClick={handleLogoutConfirm} disabled={loading} className="flex-1 bg-[#73C03F] text-white rounded-lg py-3 font-semibold">{loading ? "처리중..." : "로그아웃"}</button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* ===== 기본 마이페이지 화면 ===== */}
                    <div className="flex-none relative px-6 pt-6 pb-14 text-white h-[120px]">
                        <h1 className="absolute top-6 left-6 flex items-center gap-1">
                            <span className="text-[28px] font-extrabold tracking-tight">{username || "사용자"}</span>
                            <span className="text-[14px] font-normal">님</span>
                        </h1>
                        <img src="../../public/logo.svg" alt="캐릭터" className="absolute bottom-0 right-6 w-20 h-20" />
                    </div>

                    <div className="flex-1 overflow-auto bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-12 shadow-md flex flex-col">
                        {/* 보유 포인트 */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-[#73C03F] mb-2">보유 포인트</p>
                            {pointsLoading ? (
                                <p className="text-base text-gray-500">불러오는 중...</p>
                            ) : pointsError ? (
                                <p className="text-sm text-red-500">{pointsError}</p>
                            ) : (
                                <p className="text-4xl font-extrabold text-[#73C03F] leading-none">
                                    {summary.currentPoints} <span className="text-sm font-medium align-top">P</span>
                                </p>
                            )}
                            <hr className="border-[#73C03F] border my-6" />
                        </div>

                        {/* 제보/인증 버튼 */}
                        <div className="flex gap-4 mb-8">
                            <button onClick={() => navigate("/report-history")} className="flex-1 bg-[#73C03F] text-white rounded-xl py-5 font-semibold flex flex-col items-center">
                                <span>제보 내역</span>
                                <span className="text-lg mt-1 underline">{reportCount}건</span>
                            </button>
                            <button onClick={() => navigate("/verification-history")} className="flex-1 bg-[#73C03F] text-white rounded-xl py-5 font-semibold flex flex-col items-center">
                                <span>인증 내역</span>
                                <span className="text-lg mt-1 underline">{verificationCount}건</span>
                            </button>
                        </div>

                        {/* 메뉴 버튼 */}
                        <div className="flex flex-col gap-3">
                            <button onClick={() => navigate("/point-exchange")} className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium flex justify-between items-center">
                                <span className="pl-3">포인트 전환</span><span className="text-2xl pr-2">{'>'}</span>
                            </button>
                            <button onClick={() => navigate("/inquiry")} className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium flex justify-between items-center">
                                <span className="pl-3">1:1 문의</span><span className="text-2xl pr-2">{'>'}</span>
                            </button>
                            <button onClick={() => setShowLogout(true)} className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium flex justify-between items-center">
                                <span className="pl-3">로그아웃</span><span className="text-2xl pr-2">{'>'}</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
            <Navbar />
        </div>
    );
};

export default MyPage;
