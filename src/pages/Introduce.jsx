import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Introduce = () => {
    const navigate = useNavigate();

    const pages = [
        {
            title: 'GUIDE 1',
            content: (
                <div className="flex flex-col items-center">
                    <p className="text-lg font-bold mb-4">참여는 쉽게, 행동은 보이게</p>
                    <img
                        src="/introduce1.png"
                        alt="소개1"
                        className="max-w-xs mb-4"
                    />
                </div>
            ),
        },
        {
            title: 'GUIDE 2',
            content: (
                <div className="flex flex-col items-center text-center">
                    <img
                        src="/introduce2.png"
                        alt="소개2"
                        className="max-w-xs mb-4"
                    />
                    <div className="text-base leading-7">
                        <div>안양시 거리의 쓰레기 문제,</div>
                        <div>이제 함께 해결해요!</div>
                    </div>
                    <div className="text-base font-bold leading-7 text-[#73C03F] whitespace-pre-line">
                        누구나 쉽게 제보하고,
                        <br />
                        직접 행동하면 보상이 따라옵니다.
                    </div>
                    <div className="text-base leading-7">
                        <div>플랫폼 안에서 퀘스트처럼 미션을 수행하고,</div>
                        <div>내 주변 거리 환경을 깨끗하게 바꾸는 즐거움을 경험해보세요.</div>
                    </div>
                    <div className="text-base font-bold leading-7 text-[#73C03F]">
                        작은 실천이 모여 큰 변화를 만듭니다!
                    </div>
                </div>
            ),
        },
        {
            title: 'GUIDE 3',
            content: (
                <div className="flex flex-col items-center text-center">
                    <img
                        src="/introduce3.png"
                        alt="소개3"
                        className="max-w-xs mb-4"
                    />
                    <p className="text-xl font-semibold mb-2 text-[#73C03F]">
                        포인트는 이렇게 사용해요!
                    </p>
                    <p className="text-sm leading-relaxed">
                        쓰레기 청소나 제보 활동을 하면 포인트가 쌓여요.<br />
                        모은 포인트는 상품권으로 교환할 수 있어요.
                    </p>
                </div>
            ),
        },
        {
            title: 'GUIDE 4',
            content: (
                <div className="flex flex-col items-center text-center">
                    <img
                        src="/introduce4.png"
                        alt="소개4"
                        className="max-w-xs mb-4"
                    />
                    <ul className="list-none font-semibold text-lg text-left space-y-1">
                        <li>✅제보는 간단하게</li>
                        <li>✅청소는 인증으로</li>
                        <li>✅포인트는 보상으로</li>
                    </ul>
                </div>
            ),
        },
        {
            title: 'GUIDE 5',
            content: (
                <div className="flex flex-col items-center text-center">
                    <img
                        src="/introduce5.png"
                        alt="소개5"
                        className="max-w-xs mb-4"
                    />
                    <p className="font-semibold text-lg">지금 바로 함께줍줍 하러 가볼까요?</p>
                </div>
            ),
        },
    ];

    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            navigate('/map');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
            {/* GUIDE 제목 */}
            <h3 className="mb-2 text-sm font-normal text-[#73C03F]">
                {pages[currentPage].title}
            </h3>

            {/* 페이지 인디케이터 */}
            <div className="flex mb-5">
                {pages.map((_, index) => (
                    <span
                        key={index}
                        className={`w-2 h-2 rounded-full mx-[3px] ${index === currentPage ? 'bg-[#73C03F]' : 'bg-[#D9D9D9]'}`}
                    ></span>
                ))}
            </div>

            {/* 페이지 내용 */}
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                {pages[currentPage].content}
            </div>

            {/* 버튼 */}
            <button
                onClick={handleNext}
                className="bg-[#73C03F] hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg w-4/5 max-w-xs mt-6"
            >
                {currentPage === pages.length - 1 ? '완료' : '다음'}
            </button>
        </div>
    );
};

export default Introduce;
