import React from 'react'; // React 임포트 추가
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/authContext.jsx'; // AuthProvider 임포트

createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/* 개발 중 유용한 검사를 위해 StrictMode 추가를 권장합니다 */}
    <BrowserRouter>
      <AuthProvider> {/* App 컴포넌트를 AuthProvider로 감싸줍니다 */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);