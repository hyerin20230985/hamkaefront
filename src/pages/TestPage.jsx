import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#73C03F' }}>🧪 테스트 페이지</h1>
      <p>이 페이지가 보인다면 React 라우팅이 정상 작동하고 있습니다!</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        border: '2px solid #73C03F'
      }}>
        <h2>✅ 확인된 사항:</h2>
        <ul>
          <li>React 컴포넌트 렌더링 ✅</li>
          <li>React Router 작동 ✅</li>
          <li>AuthProvider 정상 작동 ✅</li>
          <li>기본 스타일링 ✅</li>
        </ul>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px'
      }}>
        <h3>🔧 다음 단계:</h3>
        <p>이제 메인 페이지로 이동해보세요:</p>
        <a href="/home" style={{ 
          color: '#73C03F', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          🏠 메인 페이지로 이동
        </a>
      </div>
    </div>
  );
};

export default TestPage;
