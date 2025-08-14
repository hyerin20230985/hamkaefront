import React from 'react';
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MAX_LEN = 800;
const MAX_FILES = 4;

const Reportpage = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState(Array(MAX_FILES).fill(null));
    const [submitting, setSubmitting] = useState(false);
    
    const previews = useMemo(
        () =>files.map(f => (f ? URL.createObjectURL(f) : null)),
        [files]
    );
    useEffect(() => () => previews.forEach(u => u && URL.revokeObjectURL(u)), [previews]);

    const handleFileChange = (idx, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/^image\/|^video\//.test(file.type)) {
            alert("이미지/동영상만 업로드 가능합니다.");
            e.target.value = "";
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            alert("파일 용량은 50MB 이하만 가능합니다.");
            e.target.value = "";
            return;
        }
        setFiles(prev => {
            const next = [...prev];
            next[idx] = file;
            return next;
        });
    };

    const removeFile = (idx) => {
        setFiles(prev => {
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
        setSubmitting(true);
        try {
            // 실제 API 연동 예시 (FormData)
            const fd = new FormData();
            fd.append("content", content.trim());
            files.forEach((f, i) => f && fd.append("files", f, f.name || `file_${i}`));

            // TODO: 여기에 실제 엔드포인트로 전송
            // await fetch("/api/reports", { method: "POST", body: fd });
            console.log("[REPORT] submit", { content, files });
            alert("제보가 접수되었습니다! 검토 후 포인트가 지급됩니다.");
            // 초기화
            setContent("");
            setFiles(Array(MAX_FILES).fill(null));
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
                <button onClick={() => navigate("/")}>
                    <img src='/navigate-before.png' className='w-10 mt-5 ml-2'/>
                </button>
                <span className='font-bold mt-7 mr-2'>쓰레기 제보하기</span>
                <img src='/tresh.png' className='w-10 h-10 mt-4'/>
            </div>

            <div className='mt-10 p-2'>
                <p className='ml-2 mb-2'>현재위치</p>
                <div className='flex mb-5'>
                    <img src='/marker.png' className='ml-2 w-3 h-4 mr-2 mt-2'/>
                    <span className='font-bold text-2xl px-2 mr-2'>경기도 안양시 만안구 성결대학교 53</span>
                </div>
            </div>

            <div className='bg-white text-[#73C03F] rounded-t-3xl'>

                <form onSubmit={onSubmit} className='p-5'>
                    <span className='text-sm'>제보 내용</span>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, MAX_LEN))}
                        placeholder='상황/위치/특이사항 등을 적어주세요.'
                        className='mt-2 w-full h-40 rounded-xl border-solid border-2 border-[##73C03F] p-3 outline-none focus:ring-1 shadow'
                    />
                    <div className='mt-1 text-sm text-grey-500 text-right'>
                        {content.length}/{MAX_LEN}
                    </div>

                    {/* 파일업로드 */}
                    <div>
                        <div>
                            <span>사진 선택 ({filledCount/MAX_FILES})</span>
                        </div>
                        <div className='grid grid-cols-4 gap-3 mt-2'>
                            {files.map((file, idx) => {
                                const preview = previews[idx];
                                const isVideo = file?.type?.startsWith("video/");
                                return (
                                    <div key={idx} className='relative'>
                                        <label className='block aspect-square rounded-xl cursor-pointer overflow-hidden
                                            ring-1 ring-gray-200 bg-[#CFE8B9]/70 hover:bg-[#CFE8B9]/90
                                            grid place-items-center' title={file ? file.name : "사진/동영상"}
                                        >
                                            {/* 숨김 input */}
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(idx, e)}
                                                capture="environment"
                                            />
                                            {/* 프리뷰 or 플레이스홀더 */}
                                            {file ? (
                                                isVideo ? (
                                                <video
                                                    src={preview}
                                                    muted
                                                    loop
                                                    playsInline
                                                    className="w-full h-full object-cover"
                                                />
                                                ) : (
                                                <img
                                                    src={preview}
                                                    alt={`preview-${idx}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                )
                                            ) : (
                                                <div className="flex flex-col items-center text-[11px] text-white">
                                                    <img src='/camera.png' className='w-7'/>
                                                    사진/동영상
                                                </div>
                                            )}
                                        </label>

                                        {/* 삭제 버튼 */}
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
                        disabled={submitting}
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