import React from 'react';
import { useNavigate } from "react-router-dom";
import { authAPI } from '../lib/authAPI';
import { useState } from "react";

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await authAPI.login(formData.username, formData.password);
      
      // 토큰과 사용자명을 로컬 스토리지에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('username', formData.username);
      
      // 로그인 성공 콜백 호출
      onLoginSuccess(formData.username);
    } catch (error) {
      if (error.response?.data) {
        setError(error.response.data);
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

    return (
        <div>
            <div className='relative min-h-screen bg-[#73C03F]'>
                <div className='absolute bottom-30 inset-0 flex items-center justify-center pointer-events-none'>
                    <img src='/hamkae.png' alt='logo' className='w-40'/>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <div
                    className="mx-auto w-full max-w-sm bg-white rounded-t-[28px] shadow-[0_-10px_30px_rgba(0,0,0,0.15)]
                                px-5 pt-6 pb-8"
                    style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
                    >
                        <form onSubmit={handleSubmit}>
                        {/* 아이디 */}
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요."
                            className="auth-title mt-6 w-full bg-transparent text-gray-800 placeholder-[#73C03F]
                                    border-b-2 border-[#9bd07e] focus:border-[#73C03F] outline-none py-3"
                            value={formData.username}
                            onChange={handleChange}
                            name="username"
                        />

                        {/* 비밀번호 */}
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호를 입력해주세요."
                            className="mb-4 mt-4 w-full bg-transparent text-gray-800 placeholder-[#73C03F]
                                    border-b-2 border-[#9bd07e] focus:border-[#73C03F] outline-none py-3"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {/* 버튼 */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                            className="py-3 rounded-full bg-[#73C03F] text-white font-bold
                            transition-all duration-200
                            hover:bg-[#64AC37] hover:shadow-md
                            active:scale-95
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#73C03F]
                            focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            type="submit"
                            disabled={loading}
                            >
                            {loading ? '로그인 중...' : '로그인'}
                            </button>
                            <button
                            className="py-3 rounded-full bg-[#A2D07A] text-white font-bold 
                            transition-all duration-200
                            hover:bg-[#89C25A] hover:shadow-md
                            active:scale-95
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A2D07A]
                            focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            type="button"
                            onClick={() => navigate("/Register")}
                            >
                            회원가입
                            </button>  
                            </div>
                        </form>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;