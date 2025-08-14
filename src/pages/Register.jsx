// import React, { useState } from 'react';
// import { authAPI } from '../services/api';

// const Register = ({ onSwitchToLogin }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateForm = () => {
//     if (formData.password !== formData.confirmPassword) {
//       setError('비밀번호가 일치하지 않습니다.');
//       return false;
//     }
    
//     if (formData.password.length < 6) {
//       setError('비밀번호는 최소 6자 이상이어야 합니다.');
//       return false;
//     }
    
//     if (formData.username.length < 3) {
//       setError('아이디는 최소 3자 이상이어야 합니다.');
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setLoading(true);

//     try {
//       const result = await authAPI.register(formData.username, formData.password);
//       setSuccess(result);
      
//       // 폼 초기화
//       setFormData({
//         username: '',
//         password: '',
//         confirmPassword: '',
//       });
      
//       // 3초 후 로그인 페이지로 이동
//       setTimeout(() => {
//         onSwitchToLogin();
//       }, 3000);
      
//     } catch (error) {
//       if (error.response?.data) {
//         setError(error.response.data);
//       } else {
//         setError('회원가입 중 오류가 발생했습니다.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="auth-title">회원가입</h2>
        
//         {error && <div className="error-message">{error}</div>}
//         {success && <div className="success-message">{success}</div>}
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="username" className="form-label">
//               아이디
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               className="form-input"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               placeholder="아이디를 입력하세요 (3자 이상)"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password" className="form-label">
//               비밀번호
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className="form-input"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="비밀번호를 입력하세요 (6자 이상)"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="confirmPassword" className="form-label">
//               비밀번호 확인
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               className="form-input"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               placeholder="비밀번호를 다시 입력하세요"
//             />
//           </div>
          
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? '회원가입 중...' : '회원가입'}
//           </button>
//         </form>
        
//         <div className="auth-switch">
//           이미 계정이 있으신가요?{' '}
//           <a href="#" onClick={onSwitchToLogin}>
//             로그인
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register; 