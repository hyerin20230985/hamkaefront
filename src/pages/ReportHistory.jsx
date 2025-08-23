import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext.jsx';
import { markerAPI } from '../lib/markerAPI';
import { getImageUrl } from '../lib/apiClient';
import { getAddressFromCoords } from '../lib/mapUtils.js'; // ✅ 실제 주소 변환 함수를 import 합니다.
import Navbar from '../components/Navbar';

const ReportHistory = () => {
    const navigate = useNavigate();
    const { token, username } = useAuth();

    // --- 상태 관리
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(""); // ✅ 주소 상태 추가

    // --- 페이지네이션 상태 
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

    // --- 데이터 로딩 
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        loadReportHistory();
    }, [token, navigate]);

    const loadReportHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await markerAPI.getMyReports();
            const reportsData = response?.data || response || [];
            
            // 최신순으로 정렬
            setReports(reportsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            
        } catch (err) {
            console.error('제보내역 로드 실패:', err);
            setError('제보내역을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // --- 핸들러 함수들 ---
    const handleClickItem = async (item) => {
        setSelectedItem(item);
        setSelectedAddress("주소를 가져오는 중..."); // 로딩 문구 표시
        try {
            // ✅ 실제 API를 호출하여 주소를 가져옵니다.
            const addr = await getAddressFromCoords(item.lat, item.lng);
            setSelectedAddress(addr);
        } catch (err) {
            console.error("주소 변환 실패:", err);
            setSelectedAddress("주소를 불러올 수 없습니다.");
        }
    };

    const handleBack = () => setSelectedItem(null);

    // --- 헬퍼 함수 () ---
    const getStatusText = (status) => {
        switch (status) {
            case 'ACTIVE': return '활성';
            case 'CLEANED': return '청소완료';
            case 'REMOVED': return '제거됨';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'text-orange-600 bg-orange-100';
            case 'CLEANED': return 'text-green-600 bg-green-100';
            case 'REMOVED': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

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

    // --- 페이지네이션 로직
    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const paginatedHistory = reports.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // --- 렌더링 로직 ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#73C03F] mx-auto mb-4"></div>
                    <p className="text-gray-600">제보내역을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                {/* ... 에러 UI ... */}
            </div>
        );
    }

    // [상세보기 화면]
    if (selectedItem) {
        return (
            <div className="flex flex-col min-h-screen font-sans max-w-[375px] mx-auto bg-[#73C03F]">
                <div className="flex-none relative px-6 pt-6 pb-6 text-white">
                    <button onClick={handleBack} className="absolute left-4 top-1 font-bold text-2xl text-white">&lt;</button>
                    <span className="absolute left-10 top-2 text-white font-bold text-xl">제보내역</span>
                    <div className="mt-4 text-white font-bold text-lg">{formatDate(selectedItem.createdAt)}</div>
                    <div className="mt-2 flex items-center gap-2">
                        <img src="/ReportHistory1.png" alt="location icon" className="w-4 h-4" />
                        <span className="text-white font-bold text-xl">{selectedAddress}</span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto bg-white rounded-t-[28px] px-4 py-6 flex flex-col">
                    <label className="text-[#73C03F] font-semibold mb-2 text-base">내용</label>
                    <textarea
                        className="border-2 border-[#73C03F] rounded-lg p-2 text-sm resize-none mb-4 h-30"
                        value={selectedItem.description || ""}
                        readOnly
                    />
                    {/* ✅ [수정] 사진 개수에 따라 다른 레이아웃을 적용합니다. */}
                    <div className={`overflow-auto ${selectedItem.photos.length > 1 ? 'grid grid-cols-2 gap-2' : 'flex justify-center'}`}>
                        {selectedItem.photos.map((photo) => (
                            <div 
                                key={photo.id} 
                                // ✅ 사진이 1개일 때만 너비를 75%로 제한하고, 여러 개일 때는 꽉 채웁니다.
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
            {/* ✅ [수정] 헤더 디자인 (로고 및 부제 포함) */}
            <div className="flex-none relative px-6 pt-6 pb-6 text-white h-[140px]">
                <div className="absolute top-6 left-6">
                    <div className="text-[28px] font-extrabold">{username}님</div>
                    <p className="text-sm opacity-90 mt-1">내가 제보한 쓰레기 위치들</p>
                </div>
                <img src="/logo.svg" alt="logo" className="absolute top-6 right-6 w-20 h-20" />
            </div>

            {/* ✅ [수정] 서브헤더 및 본문 구조 */}
            <div className="flex-none bg-white text-center py-3 font-semibold text-[#73C03F] text-sm border-b rounded-t-[20px]">
                제보내역
            </div>
            <div className="flex-1 overflow-auto bg-white px-6 pt-4 pb-12">
                <p className="text-sm text-gray-600 mb-4">총 {reports.length}개의 제보</p>
                
                {paginatedHistory.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center bg-[#73C03F] text-white px-3 py-3 rounded-xl mb-3 cursor-pointer"
                        onClick={() => handleClickItem(item)}
                    >
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium">{formatDate(item.createdAt)}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                                {getStatusText(item.status)}
                            </span>
                        </div>
                        <span className="text-xl">{">"}</span>
                    </div>
                ))}
            </div>

            {/* 하단 페이지네이션 */}
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
                            className={`text-[#73C03F] text-xl ${totalPages === page ? "opacity-30 cursor-default" : "cursor-pointer"}`}
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

export default ReportHistory;
