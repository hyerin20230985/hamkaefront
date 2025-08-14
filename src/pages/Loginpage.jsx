import React from 'react';
import { useState, useEffect } from "react";
import Login from '../components/Login';

const Loginpage = () => {
    const [currentView, setCurrentView] = useState('login'); 
  const [username, setUsername] = useState('');

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    
    if (token && savedUsername) {
      setUsername(savedUsername);
      setCurrentView('Mappage');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setUsername(user);
    setCurrentView('Mappage');
  };

  const handleLogout = () => {
    setUsername('');
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  }

  // 현재 뷰에 따라 컴포넌트 렌더링
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login 
            onSwitchToRegister={switchToRegister}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'register':
        return (
          <Register 
            onSwitchToLogin={switchToLogin}
          />
        );
        case 'Mappage':
        return (
          <Mappage 
            username={username}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <Login 
            onSwitchToRegister={switchToRegister}
            onLoginSuccess={handleLoginSuccess}
          />
        );
    }
  };

    return (
        <div>
            {renderCurrentView()}
        </div>
    );
};

export default Loginpage;