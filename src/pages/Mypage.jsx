import React, { useState, useEffect } from 'react'; // [포인트관련] useEffect 추가
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ axios 사용

const MyPage = ({ username }) => {
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const [password, setPassword] = useState("");

    // ✅ 서버 통신 상태/에러 메시지
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // [포인트관련] 누적 포인트 상태
    const [totalPoints, setTotalPoints] = useState(0);
    // [포인트관련] 포인트 로딩/에러 상태(마이페이지 최초 진입 시 합계 조회)
    const [pointsLoading, setPointsLoading] = useState(false);
    const [pointsError, setPointsError] = useState("");

    // [포인트관련] 합계 포인트 불러오기
    useEffect(() => {
        const fetchTotalPoints = async () => {
            try {
                setPointsLoading(true);
                setPointsError("");
                const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // 환경변수
                const token = localStorage.getItem("token");

                // 토큰 없으면(개발 중) 0으로 표시하고 종료
                if (!token) {
                    setTotalPoints(0);
                    return;
                }

                const res = await axios.get(`${API_URL}/api/points/total`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
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

    /**
     *  로그아웃 확정(검증 후 로그아웃) 핸들러
     * 1) 비밀번호 미입력 시 가드
     * 2) axios로 서버에 username/password 전송
     * 3) 성공: 토큰/유저정보 제거 후 /login 이동
     * 4) 실패: 서버 메시지 또는 상태코드 기반 에러 출력
     */
    const handleLogoutConfirm = async () => {
        if (loading) return;                 // 중복 요청 방지
        setError("");                        // 이전 에러 초기화

        if (!password) {                     // 클라이언트 측 간단 검증
            setError("비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            //  API 엔드포인트 (환경변수 우선)
            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
            const token = localStorage.getItem("token");

            // 서버로 검증 요청
            // - 예시 엔드포인트: POST /api/logout
            // - 서버는 { success: boolean, message?: string } 형태로 응답한다고 가정
            const res = await axios.post(
                `${API_URL}/api/logout`,
                { username, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}), // JWT 사용 시
                    },
                    // withCredentials: true, // 쿠키 인증을 쓰는 경우 주석 해제
                    timeout: 10000, // 네트워크 지연 대비 타임아웃(10초)
                }
            );

            // 성공/실패 분기
            if (res.data?.success) {
                // 서버가 검증을 통과했다고 응답
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                navigate("/login"); // 로그인 페이지로 이동
            } else {
                // 서버가 실패를 명시(HTTP 200이더라도 payload가 실패일 수 있음)
                setError(res.data?.message || "로그아웃에 실패했습니다.");
            }
        } catch (err) {
            //  네트워크 오류 or 서버에서 4xx/5xx 반환
            const msg =
                err?.response?.data?.message ||                 // 서버가 보낸 메시지 우선
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
        <div className="App mx-auto min-h-screen font-sans max-w-[375px]" style={{ backgroundColor: '#73C03F' }}>
            {showLogout ? (
                // 로그아웃 화면
                <div className="min-h-screen flex flex-col">
                    {/* 상단 영역 */}
                    <div className="relative px-6 pt-6 pb-14 text-white min-h-[120px]">
                        {/* 사용자명 */}
                        <h1 className="absolute top-6 left-6 flex items-center gap-1">
                            <span className="text-[28px] font-extrabold tracking-tight">
                                {username || "사용자"}
                            </span>
                            <span className="text-[14px] font-normal">님</span>
                        </h1>

                        {/* 알림 아이콘 */}
                        <Link to="/notifications" className="absolute top-6 right-6 w-6 h-6">
                            <img
                                src="/arrow.png"
                                alt="알림"
                                className="w-full h-full object-contain"
                            />
                        </Link>

                        {/* 캐릭터 이미지 */}
                        <img
                            src="/logo.svg"
                            alt="캐릭터"
                            className="absolute bottom-0 right-6 w-20 h-20"
                        />
                    </div>

                    {/* 로그아웃 입력 영역 */}
                    <div className="bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-12 shadow-md flex flex-col items-center">
                        {/* 제목 */}
                        <p className="text-[#73C03F] font-semibold text-base mb-6 w-full text-left">로그아웃</p>

                        {/* 아이디 입력 (읽기 전용) */}
                        <input
                            type="text"
                            value={username || ""}
                            readOnly
                            className="w-full border border-[#73C03F] rounded-lg px-4 py-3 mb-4 text-[#73C03F] font-medium focus:outline-none"
                        />

                        {/* 비밀번호 입력 */}
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                // ⏎ Enter로도 전송 가능 (접근성/편의)
                                if (e.key === "Enter") handleLogoutConfirm();
                            }}
                            className="w-full border border-[#73C03F] rounded-lg px-4 py-3 mb-2 text-gray-700 focus:outline-none placeholder:text-[#73C03F]"
                        />

                        {/* 에러 메시지 영역 (검증 실패/서버 오류 등) */}
                        {error && <p className="w-full text-red-500 text-sm mb-4">{error}</p>}

                        {/* 버튼 그룹 */}
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => {
                                    // '이전' 누르면 로그아웃 뷰 닫고 필드/에러 초기화
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
                </div>
            ) : (
                // ✅ 기존 마이페이지 화면
                <>
                    {/* 상단 영역 */}
                    <div className="relative px-6 pt-6 pb-14 text-white min-h-[120px]">
                        <h1 className="absolute top-6 left-6 flex items-center gap-1">
                            <span className="text-[28px] font-extrabold tracking-tight">
                                {username || "사용자"}
                            </span>
                            <span className="text-[14px] font-normal">님</span>
                        </h1>

                        <Link to="/notifications" className="absolute top-6 right-6 w-6 h-6">
                            <img src="/arrow.png" alt="알림" className="w-full h-full object-contain" />
                        </Link>

                        <img src="/logo.svg" alt="캐릭터" className="absolute bottom-0 right-6 w-20 h-20" />
                    </div>

                    {/* 메인 컨텐츠 */}
                    <div className="bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-12 shadow-md">
                        {/* 보유 포인트 */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-[#73C03F] mb-2">보유 포인트</p>

                            {/* [포인트관련] 합계 표시: 로딩/에러/값 */}
                            {pointsLoading ? (
                                <p className="text-base text-gray-500">불러오는 중...</p>
                            ) : pointsError ? (
                                <p className="text-sm text-red-500">{pointsError}</p>
                            ) : (
                                <p className="text-4xl font-extrabold text-[#73C03F] leading-none">
                                    {/* [포인트관련] 서버값으로 렌더 */}
                                    {totalPoints} <span className="text-sm font-medium text-[#73C03F] align-top">point</span>
                                </p>
                            )}

                            <hr className="border-[#73C03F] border my-6" />
                        </div>

                        {/* 버튼 그룹 */}
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

                        {/* 기타 메뉴 */}
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/point-exchange")}
                                className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium text-base text-left px-4 flex justify-between items-center"
                            >
                                {/* [포인트관련] 전환 페이지 이동 */}
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

                            {/* 로그아웃 클릭 시 → 로그아웃 화면으로 전환 */}
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
        </div>
    );
};

export default MyPage;