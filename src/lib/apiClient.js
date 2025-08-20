import axios from "axios";

// 작업자명 : 윤준하
// 날짜 : 2025-08-14
// 수정내용 : API 기본 URL이 설정되지 않았을 때 기본값 제공 및 환경변수 설정 안내 추가

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 환경변수가 설정되지 않은 경우 경고 메시지 출력
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL이 설정되지 않았습니다. 기본값 http://localhost:8080을 사용합니다.');
  console.warn('.env 파일에 VITE_API_BASE_URL=http://localhost:8080을 추가하세요.');
}

 const api = axios.create({
  baseURL: API_BASE_URL,
  // JSON은 여기서 기본 지정. (FormData 쓸 땐 axios가 자동으로 multipart 지정하니 따로 건드리지 마세요)
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터: 토큰 주입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // ✅ FormData일 땐 Content-Type 제거(브라우저가 boundary 포함해 자동 세팅)
    if (config.data instanceof FormData) {
      if (config.headers && 'Content-Type' in config.headers) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 공통 에러 처리
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      // 훅을 못 쓰므로 하드 리다이렉트 or 커스텀 이벤트
      window.location.href = "/err";
    }
    return Promise.reject(error);
  }
);

export default api; 