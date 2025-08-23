import React, { createContext, useContext, useState, useEffect } from 'react';

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 컨텍스트 사용을 위한 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 인증 프로바이더 컴포넌트
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const [loading, setLoading] = useState(false);

  // 토큰이 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // 사용자명이 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  // 로그인 함수
  const login = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  // 로그아웃 함수
  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  // 토큰 갱신 함수
  const updateToken = (newToken) => {
    setToken(newToken);
  };

  // 사용자명 갱신 함수
  const updateUsername = (newUsername) => {
    setUsername(newUsername);
  };

  const value = {
    token,
    username,
    loading,
    setLoading,
    login,
    logout,
    updateToken,
    updateUsername,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
