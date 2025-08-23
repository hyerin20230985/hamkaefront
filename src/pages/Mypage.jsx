// [마이페이지]
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext.jsx';
import { userAPI } from '../lib/userAPI';
import Navbar from '../components/Navbar';

const MyPage = () => {
    const navigate = useNavigate();
    const { token, username, logout } = useAuth();
    
    const [profileData, setProfileData] = useState({
        currentPoints: 0,
        reportCount: 0,
        verificationCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [token, navigate]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // ✅ [수정] 여러 API 대신, 모든 정보가 포함된 프로필 API 하나만 호출하여 효율성을 높입니다.
            const profileRes = await userAPI.getProfile();

            if (profileRes.success) {
                const data = profileRes.data || {};
                
                setProfileData({
                    // API 명세서에 따라 'points'를 currentPoints로 사용합니다.
                    currentPoints: data.points || 0, 
                    // API 명세서에 따라 'reportedMarkersCount'를 reportCount로 사용합니다.
                    reportCount: data.reportedMarkersCount || 0, 
                    // API 명세서에 따라 'uploadedPhotosCount'를 verificationCount로 사용합니다.
                    verificationCount: data.uploadedPhotosCount || 0,
                });
            } else {
                throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
            }

        } catch (err) {
            console.error("데이터 로딩 실패:", err);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center max-w-[375px] mx-auto">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#73C03F] mx-auto mb-4"></div>
                    <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center max-w-[375px] mx-auto">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchData} 
                        className="bg-[#73C03F] text-white px-4 py-2 rounded-lg hover:bg-[#5a9a2f] transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto" style={{ backgroundColor: '#73C03F' }}>
            <div className="flex-none relative px-6 pt-6 pb-14 text-white h-[120px]">
                <h1 className="absolute top-6 left-6 flex items-center gap-1">
                    <span className="text-[28px] font-extrabold tracking-tight">{username}</span>
                    <span className="text-[14px] font-normal">님</span>
                </h1>
                <img src="/logo.svg" alt="캐릭터" className="absolute bottom-0 right-6 w-20 h-20" />
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-24 shadow-md flex flex-col">
                <div>
                    <p className="text-sm font-medium text-[#73C03F] mb-2">보유 포인트</p>
                    <p className="text-4xl font-extrabold text-[#73C03F] leading-none">
                        {profileData.currentPoints.toLocaleString()} <span className="text-sm font-medium align-top">P</span>
                    </p>
                    <hr className="border-[#73C03F] border my-3" />
                </div>

                <div className="flex gap-4 mb-3">
                    <button onClick={() => navigate("/report-history")} className="flex-1 bg-[#73C03F] text-white rounded-xl py-5 font-semibold flex flex-col items-center">
                        <span>제보 내역</span>
                        <span className="text-lg mt-1 underline">{profileData.reportCount}건</span>
                    </button>
                    <button onClick={() => navigate("/verification-history")} className="flex-1 bg-[#73C03F] text-white rounded-xl py-5 font-semibold flex flex-col items-center">
                        <span>인증 내역</span>
                        <span className="text-lg mt-1 underline">{profileData.verificationCount}건</span>
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={() => navigate("/my-pins")} className="w-full bg-[#73C03F] text-white rounded-xl py-3 font-medium flex justify-between items-center">
                        <span className="pl-3">내 핀번호</span><span className="text-2xl pr-2">{'>'}</span>
                    </button>
                    <button onClick={() => navigate("/point-exchange")} className="w-full bg-[#73C03F] text-white rounded-xl py-3 font-medium flex justify-between items-center">
                        <span className="pl-3">포인트 전환</span><span className="text-2xl pr-2">{'>'}</span>
                    </button>
                    <button onClick={handleLogout} className="w-full bg-[#73C03F] text-white rounded-xl py-3 font-medium flex justify-between items-center">
                        <span className="pl-3">로그아웃</span><span className="text-2xl pr-2">{'>'}</span>
                    </button>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default MyPage;
