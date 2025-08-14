import React from 'react';
import Maps from '../components/Maps';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Mappage = ({ username }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className='text-white'>
            <div className='bg-[#73C03F]'>
                <div className='flex justify-between mb-4'>
                    <p className='font-bold text-xl p-4 mt-4'>함께줍줍</p>
                    <div className='mr-4 mt-4 ml-auto flex items-center gap-2'>
                        <img src='/account_circle.png' alt='회원' className='w-7'/>
                        <span className='text-sm'>안녕하세요 {username}님!</span> 
                    </div>
                </div>
                <div className='rounded-t-2xl overflow-hidden shadow'>
                <Maps/>

                {/* 플러스버튼 */}
                <button
                        type='button'
                        aria-label='제보하기'
                        onClick={() => setOpen(v => !v)}
                        className='absolute z-50 bottom-6 right-5 md:right-55 lg:right-150 w-12 place-items-center
               hover:scale-105 active:scale-95 transition'>
                <img src='/plusBtn.svg' alt='btn'></img>
               </button>

                {/* 말풍선 */}
               <div className={`absolute z-50 right-6 bottom-23 md:right-55 lg:right-150
               transition ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
                    <button
                        type='button'
                        onClick={() => {setOpen(false); navigate("/report"); }}
                        className='relative flex items-center gap-3 bg-white text-[#73C03F] border-2 border-[#73C03F] px-4 py-3'>
                            쓰레기 제보하기
                            <img src='/angleCket.png' className='w-5'/>
                    </button>
               </div>
            </div>
            </div>
        </div>
    );
};

export default Mappage;