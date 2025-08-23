import Navbar from '../components/Navbar';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Mainpage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    
    const places = [
        {
            id: 1,
            title: "안양시 만안구 성결대학교 44",
            address: "내 집 앞 쓰레기...",
            imageUrl: "sample/tresh-1.jpg",
            point: 300,
            distance: 8, // m 단위 예시
        },
        {
            id: 2,
            title: "경기도 안양시 동안구 관양동 53",
            address: "골목가 쓰레기 더미",
            imageUrl: "sample/tresh-1.jpg",
            point: 300,
            distance: 25,
        },
        {
            id: 3,
            title: "경기도 안양시 만안구 성결…",
            address: "계단 앞 무단투기",
            imageUrl: "sample/tresh-1.jpg",
            point: 300,
            distance: 5,
        },
    ];

    return (
        <div>
            <div className="bg-white min-h-screen text-[#73C03F]">
                <div className='bg-[#73C03F]'>
                    <div className='flex justify-between '>
                        <p className='font-bold text-xl p-4 mt-4 text-white'>함께줍줍</p>
                        <div className='mr-4 mt-4 ml-auto flex items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => navigate("/mypage")}
                            >
                                <img src='/account_circle.png' alt='회원' className='w-7'/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 상단 헤더 */}
                <div className="relative">
                    <img
                        src="image-2.png"
                        alt="hero"
                        className="w-full object-cover"
                    />
                    <img src='/hamkae-earth.png' alt='hamkae' className='absolute z-50 top-6 right-50 '/>
                    
                    {/* 인사 카드 */}
                    <div className="absolute -bottom-70 w-full flex justify-center">
                        <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg">
                            <div className="border-2 border-[#73C03F] rounded-2xl py-2 text-center font-semibold mt-2">
                                반갑습니다. {username || "사용자"}님
                            </div>

                            <div className="flex justify-between items-center mb-3 mt-5">
                                <h2 className="font-semibold">근처 청소 할만한 곳</h2>
                            </div>

                            {/* 가로 스크롤 카드 */}
                            <div className="flex space-x-4 overflow-x-auto pb-4">
                                {places.map((place) => {
                                    const canClean = place.distance <= 15; // 10~15m 추천
                                    return (
                                        <div
                                            key={place.id}
                                            className="bg-white rounded-2xl shadow-md w-50 flex-shrink-0 flex flex-col"
                                        >
                                            <img
                                                src={place.imageUrl}
                                                alt={place.title}
                                                className="h-25 w-full object-cover rounded-t-2xl"
                                                onError={(e) => { e.currentTarget.src = '/fallback.jpg'; }}
                                            />
                                            <div className="p-3 flex-1">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {place.title}
                                                </h3>
                                                <p className="text-xs font-bold mt-1">
                                                    {place.distance}m 거리
                                                </p>
                                            </div>
                                            <div className="bg-[#C8EEAF] px-3 py-2 rounded-b-2xl flex items-center justify-between">
                                                <span className="font-bold text-sm">{place.point}P</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Mainpage;