import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { markerAPI } from "../lib/markerAPI"; // markerAPI import 추가
import { getAddressFromCoords } from "../lib/mapUtils"; // getAddressFromCoords import 추가

const MAX_LEN = 800;
const MAX_FILES = 4;

const Reportpage = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState(Array(MAX_FILES).fill(null));
    const [submitting, setSubmitting] = useState(false);
    const [location, setLocation] = useState(null); // 위치 정보 상태 추가
    const [address, setAddress] = useState("위치 정보를 가져오는 중..."); // 주소 상태 추가
    const [locationError, setLocationError] = useState(""); // 위치 정보 오류 상태 추가

    // 인증 가드: 토큰 없으면 로그인으로
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    // 컴포넌트 마운트 시 현재 위치 가져오기 및 주소 변환
    useEffect(() => {
        const fetchLocationAndAddress = async (lat, lng) => {
            setLocation({ lat, lng });
            try {
                const fetchedAddress = await getAddressFromCoords(lat, lng);
                setAddress(fetchedAddress);
                setLocationError("");
            } catch (error) {
                console.error(error);
                setAddress("주소를 불러오는 데 실패했습니다.");
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchLocationAndAddress(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation error:", error);
                    setLocationError("현재 위치를 가져올 수 없습니다. 기본 위치로 제보됩니다.");
                    // 기본 위치 설정 (성결대학교)
                    fetchLocationAndAddress(37.379, 126.929);
                }
            );
        } else {
            setLocationError("이 브라우저는 위치 서비스를 지원하지 않습니다. 기본 위치로 제보됩니다.");
            fetchLocationAndAddress(37.379, 126.929);
        }
    }, []);

    const previews = useMemo(
        () => files.map((f) => (f ? URL.createObjectURL(f) : null)),
        [files]
    );
    useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews]);

    const handleFileChange = (idx, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/^image\//.test(file.type)) { // 동영상 제외, 이미지 전용으로 변경
            alert("이미지만 업로드 가능합니다.");
            e.target.value = "";
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // API 제약사항에 맞춰 10MB로 수정
            alert("파일 용량은 10MB 이하만 가능합니다.");
            e.target.value = "";
            return;
        }
        setFiles((prev) => {
            const next = [...prev];
            next[idx] = file;
            return next;
        });
    };

    const removeFile = (idx) => {
        setFiles((prev) => {
            const next = [...prev];
            next[idx] = null;
            return next;
        });
    };
    const filledCount = files.filter(Boolean).length;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert("제보 내용을 입력해주세요.");
            return;
        }
        if (!location) {
            alert("위치 정보가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        setSubmitting(true);
        try {
            const imageFiles = files.filter(Boolean); // null이 아닌 파일만 필터링

            const reportData = {
                lat: String(location.lat),
                lng: String(location.lng),
                description: content.trim(),
                images: imageFiles,
            };
            console.log("제보 데이터:", reportData);

            const response = await markerAPI.create(reportData);
            console.log("백엔드 응답 전체:", response);
            
            const payload = response?.data || response;
            console.log("응답 payload:", payload);
            
            const created = payload?.data || payload;
            console.log("생성된 마커 데이터:", created);
            
            alert("제보가 접수되었습니다! 검토 후 포인트가 지급됩니다.");
            
            // 신규 마커 정보를 맵 페이지로 전달
            // 백엔드 응답에는 marker_id만 있고, lat/lng/description은 원본 reportData에서 가져와야 함
            const markerToPass = {
                id: created?.marker_id, // 백엔드 응답의 marker_id 사용
                lat: Number(reportData.lat), // 원본 reportData에서 lat 사용
                lng: Number(reportData.lng), // 원본 reportData에서 lng 사용
                description: reportData.description, // 원본 reportData에서 description 사용
                status: 'ACTIVE', // 새로 생성된 마커는 ACTIVE 상태
                photos: created?.uploaded_images || [] // 백엔드 응답의 uploaded_images 사용
            };
            console.log("맵으로 전달할 마커 데이터:", markerToPass);
            
            navigate("/map", { state: { newMarker: markerToPass } });
        } catch (err) {
            console.error(err);
            alert("제보 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='bg-[#73C03F] text-white'>
            <div className='flex'>
                <button onClick={() => navigate("/map")}>
                    <img src='/navigate-before.png' className='w-10 mt-5 ml-2'/>
                </button>
                <span className='font-bold mt-7 mr-2'>쓰레기 제보하기</span>
                <img src='/tresh.png' className='w-10 h-10 mt-4'/>
            </div>

            <div className='mt-10 p-2'>
                <p className='ml-2 mb-2'>현재위치</p>
                <div className='flex mb-5 items-center'>
                    <img src='/marker.png' className='ml-2 w-3 h-4 mr-2'/>
                    <span className='font-bold text-xl px-2 mr-2'>
                        {address}
                    </span>
                </div>
                {locationError && <p className='text-yellow-300 text-sm ml-3'>{locationError}</p>}
            </div>

            <div className='bg-white text-[#73C03F] rounded-t-3xl'>
                <form onSubmit={onSubmit} className='p-5'>
                    <span className='text-sm'>제보 내용</span>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, MAX_LEN))}
                        placeholder='상황/위치/특이사항 등을 적어주세요.'
                                                className='mt-2 w-full h-40 rounded-xl border-solid border-2 border-[#73C03F] p-3 outline-none focus:ring-1 shadow text-black'
                    />
                    <div className='mt-1 text-sm text-gray-500 text-right'>
                        {content.length}/{MAX_LEN}
                    </div>

                    {/* 파일업로드 */}
                    <div>
                        <div>
                            <span>사진 선택 ({filledCount}/{MAX_FILES})</span>
                        </div>
                        <div className='grid grid-cols-4 gap-3 mt-2'>
                            {files.map((file, idx) => {
                                const preview = previews[idx];
                                return (
                                    <div key={idx} className='relative'>
                                        <label className='block aspect-square rounded-xl cursor-pointer overflow-hidden
                                            ring-1 ring-gray-200 bg-[#CFE8B9]/70 hover:bg-[#CFE8B9]/90
                                            grid place-items-center' title={file ? file.name : "사진"}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*" // 이미지 전용
                                                className="hidden"
                                                onChange={(e) => handleFileChange(idx, e)}
                                                capture="environment"
                                            />
                                            {file ? (
                                                <img
                                                    src={preview}
                                                    alt={`preview-${idx}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center text-[11px] text-white">
                                                    <img src='/camera.png' className='w-7'/>
                                                    사진
                                                </div>
                                            )}
                                        </label>
                                        {file && (
                                            <button 
                                                type='button'
                                                onClick={() => removeFile(idx)}
                                                className='absolute -top-2 -right-2 w-6 h-6 rounded-full
                                   bg-white text-gray-700 shadow grid place-items-center text-xs'
                                                aria-label="삭제"
                                                title="삭제"
                                            >
                                            ✕
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* 제출버튼 */}
                    <button
                        type="submit"
                        disabled={submitting || !location}
                        className="mt-6 w-full py-3 rounded-xl text-white font-bold disabled:opacity-60 bg-[#73C03F]"
                    >
                        {submitting ? "제출 중..." : "제보하기"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reportpage;
