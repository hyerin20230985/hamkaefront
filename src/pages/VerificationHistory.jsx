import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext.jsx';
import { markerAPI } from '../lib/markerAPI';
import { getImageUrl } from '../lib/apiClient';
import { getAddressFromCoords } from '../lib/mapUtils.js';
import Navbar from '../components/Navbar';

const VerificationHistory = () => {
    const navigate = useNavigate();
    const { token, username } = useAuth();
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 상세보기 및 주소 변환 상태
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");

    // 페이지네이션 상태
    const [page, setPage] = useState(1);
    const itemsPerPage = 4; // 한 페이지에 4개씩 표시

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        loadVerificationHistory();
    }, [token, navigate]);

    const loadVerificationHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await markerAPI.getMyVerifications();
            const verificationsData = response?.data || response || [];
            
            setVerifications(verificationsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            
        } catch (err) {
            console.error('인증내역 로드 실패:', err);
            setError('인증내역을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 상세보기 클릭 핸들러
    const handleClickItem = async (item) => {
        setSelectedItem(item);
        setSelectedAddress("주소를 가져오는 중...");
        try {
            const addr = await getAddressFromCoords(item.lat, item.lng);
            setSelectedAddress(addr);
        } catch (err) {
            console.error("주소 변환 실패:", err);
            setSelectedAddress("주소를 불러올 수 없습니다.");
        }
    };

    const handleBack = () => setSelectedItem(null);

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 페이지네이션 로직
    const totalPages = Math.ceil(verifications.length / itemsPerPage);
    const paginatedHistory = verifications.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#73C03F] mx-auto mb-4"></div>
                    <p className="text-gray-600">인증내역을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={loadVerificationHistory} 
                        className="bg-[#73C03F] text-white px-4 py-2 rounded-lg hover:bg-[#5a9a2f] transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    // [상세보기 화면]
    if (selectedItem) {
        return (
            <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto bg-[#73C03F]">
                <div className="flex-none relative px-6 pt-6 pb-6 text-white">
                    <button onClick={handleBack} className="absolute left-4 top-1 font-bold text-2xl text-white">&lt;</button>
                    <span className="absolute left-10 top-2 text-white font-bold text-xl">인증내역</span>
                    <div className="mt-6 text-white font-bold text-lg">{formatDate(selectedItem.createdAt)}</div>
                    <div className="mt-2 flex items-center gap-2">
                        <img src="/ReportHistory1.png" alt="location icon" className="w-4 h-4" />
                        <span className="text-white text-base">{selectedAddress}</span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto bg-white rounded-t-[28px] px-4 py-6 flex flex-col">
                    <label className="text-[#73C03F] font-semibold mb-2 text-base">내용</label>
                    <textarea
                        className="border-2 border-[#73C03F] rounded-lg p-2 text-sm resize-none mb-4 h-32"
                        value={selectedItem.description || ""}
                        readOnly
                    />
                    <div className={`overflow-auto ${selectedItem.photos.length > 1 ? 'grid grid-cols-2 gap-2' : 'flex justify-center'}`}>
                        {selectedItem.photos.map((photo) => (
                            <div 
                                key={photo.id} 
                                className={`aspect-square ${selectedItem.photos.length === 1 ? 'w-2/3' : 'w-full'}`}
                            >
                                <img
                                    src={getImageUrl(photo.imagePath)}
                                    alt={`photo-${photo.id}`}
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

    // [목록 화면]
    return (
        <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto bg-[#73C03F]">
            <div className="flex-none relative px-6 pt-6 pb-6 text-white h-[140px]">
                {/* ✅ [수정] 헤더에 부제 추가 */}
                <div className="absolute top-6 left-6">
                    <div className="text-[28px] font-extrabold">{username}님</div>
                    <p className="text-sm opacity-90 mt-1">내가 청소 완료한 구역들</p>
                </div>
                <img src="/logo.svg" alt="logo" className="absolute top-6 right-6 w-20 h-20" />
            </div>

            <div className="flex-none bg-white text-center py-3 font-semibold text-[#73C03F] text-sm border-b rounded-t-[20px]">
                인증내역
            </div>

            <div className="flex-1 overflow-auto bg-white px-6 pt-4 pb-4">
                {paginatedHistory.length === 0 ? (
                    <div className="text-center text-gray-500 pt-10">인증 내역이 없습니다.</div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">총 {verifications.length}개의 인증 내역</p>
                        {paginatedHistory.map((verification) => (
                            <div
                                key={verification.id}
                                className="bg-[#73C03F] text-white px-3 py-3 rounded-xl mb-3 cursor-pointer"
                                onClick={() => handleClickItem(verification)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-medium">{formatDate(verification.createdAt)}</p>
                                            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">청소완료</span>
                                        </div>
                                        {/* <div className="text-left">
                                            <div className="text-xs font-semibold text-green-200">+100P 포인트 적립</div>
                                        </div> */}
                                    </div>
                                    <span className="text-xl font-bold">{">"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {totalPages > 1 && (
                <div className="flex-none bg-white pb-6 px-6">
                    <div className="flex justify-center items-center space-x-2">
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
                                className={`w-2.5 h-2.5 rounded-full ${page === i + 1 ? "bg-[#73C03F]" : "bg-gray-300"}`}
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
            )}
            <Navbar />
        </div>
    );
};

export default VerificationHistory;
