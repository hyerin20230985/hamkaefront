import React, {useState, useEffect} from 'react';

const Loginpage = () => {
    const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [username, setUsername] = useState('');

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    
    if (token && savedUsername) {
      setUsername(savedUsername);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setUsername(user);
    setCurrentView('dashboard');
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
      case 'dashboard':
        return (
          <Dashboard 
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