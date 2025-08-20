import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { markerAPI } from "../lib/markerAPI";
import { photosAPI } from "../lib/photosAPI";
import { getAddressFromCoords } from "../lib/mapUtils";

const MAX_FILES = 5; // API 제약사항에 맞춰 최대 5장

const Uploadpage = () => {
    const navigate = useNavigate();
    const { markerId } = useParams(); // URL에서 마커 ID 가져오기

    const [marker, setMarker] = useState(null);
    const [address, setAddress] = useState("위치 정보 불러오는 중...");
    const [beforePhotos, setBeforePhotos] = useState([]);
    const [afterPhotos, setAfterPhotos] = useState(Array(MAX_FILES).fill(null));
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // 데이터 로딩 및 주소 변환
    useEffect(() => {
        if (!markerId) {
            setError("잘못된 접근입니다. 마커 ID가 필요합니다.");
            setLoading(false);
            return;
        }
        const fetchMarkerData = async () => {
            try {
                const markerData = await markerAPI.get(markerId);
                setMarker(markerData);
                const before = markerData.photos.filter(p => p.type === 'BEFORE');
                setBeforePhotos(before);

                // 주소 변환
                if (markerData.lat && markerData.lng) {
                    const fetchedAddress = await getAddressFromCoords(markerData.lat, markerData.lng);
                    setAddress(fetchedAddress);
                } else {
                    setAddress("이 제보에는 위치 정보가 없습니다.");
                }

            } catch (err) {
                console.error(err);
                setError("마커 정보를 불러오는 데 실패했습니다.");
                setAddress("위치 정보를 불러올 수 없습니다.");
            }
            setLoading(false);
        };
        fetchMarkerData();
    }, [markerId]);

    const afterPreviews = useMemo(
        () => afterPhotos.map((f) => (f ? URL.createObjectURL(f) : null)),
        [afterPhotos]
    );
    useEffect(() => () => afterPreviews.forEach((u) => u && URL.revokeObjectURL(u)), [afterPreviews]);

    const handleFileChange = (idx, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/^image\//.test(file.type)) {
            alert("이미지만 업로드 가능합니다.");
            return;
        }
        setAfterPhotos((prev) => {
            const next = [...prev];
            next[idx] = file;
            return next;
        });
    };

    const removeFile = (idx) => {
        setAfterPhotos((prev) => {
            const next = [...prev];
            next[idx] = null;
            return next;
        });
    };

    const filledCount = afterPhotos.filter(Boolean).length;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (filledCount === 0) {
            alert("청소 후 사진을 1장 이상 업로드해주세요.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // 1. 청소 후 사진 업로드 -> 성공 시 서버에서 자동으로 AI 검증 시작
            const imageFiles = afterPhotos.filter(Boolean);
            await photosAPI.uploadCleanupPhotos({
                marker_id: markerId,
                images: imageFiles,
            });

            alert("청소 인증 사진이 업로드되었습니다. AI 검증이 자동으로 시작되며, 완료 시 포인트가 지급됩니다.");
            navigate("/map");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "작업 중 오류가 발생했습니다.";
            console.error(err);
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-5">로딩 중...</div>;
    if (error && !marker) return <div className="p-5 text-red-500">오류: {error}</div>;

    return (
        <div className='bg-[#73C03F] text-white min-h-screen'>
            <div className='p-4'>
                <div className='flex items-center'>
                    <button onClick={() => navigate("/map")}>
                        <img src='/navigate-before.png' className='w-10' alt="뒤로가기"/>
                    </button>
                    <h1 className='font-bold text-xl ml-2'>청소 인증 업로드</h1>
                </div>
            </div>

            <div className='bg-white text-black rounded-t-3xl p-5'>
                <div className='mb-5'>
                    <p className='text-sm text-gray-500 mb-1'>위치</p>
                    <div className='flex items-center'>
                        <img src='/marker.png' className='w-4 h-5 mr-2' alt="위치 마커"/>
                        <span className='font-bold text-lg text-gray-800'>
                            {address}
                        </span>
                    </div>
                </div>

                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-3">제보된 사진 (청소 전)</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {beforePhotos.length > 0 ? (
                            beforePhotos.map(photo => (
                                <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                                    <img src={`http://localhost:8080${photo.imagePath}`} alt={`제보사진 ${photo.id}`} className="w-full h-full object-cover" />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">제보된 사진이 없습니다.</p>
                        )}
                    </div>
                </section>

                <hr className="my-6" />

                <form onSubmit={handleSubmit}>
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-3">청소 후 사진 업로드 ({filledCount}/{MAX_FILES})</h2>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {afterPhotos.map((file, idx) => (
                                <div key={idx} className='relative'>
                                    <label className='block aspect-square rounded-xl cursor-pointer overflow-hidden ring-1 ring-gray-200 bg-gray-100 hover:bg-gray-200 grid place-items-center' title={file ? file.name : "사진 추가"}>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(idx, e)} />
                                        {afterPreviews[idx] ? (
                                            <img src={afterPreviews[idx]} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" /></svg>
                                            </div>
                                        )}
                                    </label>
                                    {file && (
                                        <button type='button' onClick={() => removeFile(idx)} className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white shadow grid place-items-center text-xs' aria-label="삭제">✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    <button type="submit" disabled={submitting || filledCount === 0} className="mt-8 w-full py-3 rounded-xl text-white font-bold disabled:opacity-60 bg-[#73C03F] hover:bg-[#64AC37] transition">
                        {submitting ? "제출 중..." : "인증 업로드 및 AI 검증 요청"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Uploadpage;
