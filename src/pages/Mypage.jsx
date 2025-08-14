import React from 'react';
import { Link } from 'react-router-dom';

const MyPage = () => {
    return (
        <div className="App mx-auto min-h-screen font-sans max-w-[375px]" style={{ backgroundColor: '#73C03F' }}>
            {/* 상단 영역: 상대 위치 기준으로 텍스트는 좌측 상단, 아이콘은 우측 상단 고정 */}
            <div className="relative px-6 pt-6 pb-14 text-white min-h-[120px]">
                {/* 사용자명과 존칭: 좌측 상단 고정 */}
                <h1 className="absolute top-6 left-6 flex items-center gap-1">
                    <span className="text-[28px] font-extrabold tracking-tight">홍길동</span>
                    <span className="text-[14px] font-normal">님</span>
                </h1>

                {/* 알림 아이콘: 우측 상단 고정 */}
                <Link to="/notifications" className="absolute top-6 right-6 w-6 h-6">
                    <img
                        src="../../public/arrow.png"
                        alt="종소리"
                        className="w-full h-full object-contain"
                    />
                </Link>

                {/* 캐릭터 이미지: 절대 위치로 우측 하단에 배치 */}
                <img
                    src="../../public/logo.svg"
                    alt="캐릭터"
                    className="absolute bottom-0 right-6 w-20 h-20"
                />
            </div>

            {/* 메인 컨텐츠 영역 */}
            <div className="bg-white rounded-t-[28px] -mt-10 px-6 pt-8 pb-12 shadow-md">
                {/* 보유 포인트 */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-[#73C03F] mb-2">보유 포인트</p>
                    <p className="text-4xl font-extrabold text-[#73C03F] leading-none">
                        3000 <span className="text-sm font-medium text-[#73C03F] align-top">point</span>
                    </p>
                    <hr className="border-[#73C03F] border my-6" />
                </div>

                {/* 버튼 그룹 */}
                <div className="flex gap-4 mb-8">
                    {[
                        { label: '제보 내역', count: 1 },
                        { label: '인증 내역', count: 4 },
                    ].map(({ label, count }) => (
                        <button
                            key={label}
                            type="button"
                            className="flex-1 bg-[#73C03F] text-white rounded-xl py-5 font-semibold text-base flex flex-col items-center justify-center"
                            style={{ minHeight: '72px' }}
                        >
                            <span>{label}</span>
                            <span className="text-lg mt-1 underline">{count}건</span>
                        </button>
                    ))}
                </div>

                {/* 기타 메뉴 */}
                <div className="flex flex-col gap-3">
                    {[
                        '포인트 전환',
                        '회원정보 수정',
                        '1:1 문의하기',
                        '계정 설정',
                    ].map((menu) => (
                        <button
                            key={menu}
                            type="button"
                            className="w-full bg-[#73C03F] text-white rounded-xl py-4 font-medium text-base text-left px-4 flex justify-between items-center"
                        >
                            <span>{menu}</span>
                            <span className="text-xl">{'>'}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPage;