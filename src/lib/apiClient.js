import axios from "axios";

// 작업자명 : 윤준하
// 날짜 : 2025-08-14
// 수정내용 : API 기본 URL이 설정되지 않았을 때 기본값 제공 및 환경변수 설정 안내 추가

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hamkae.sku-sku.com'

  // 환경변수가 설정되지 않은 경우 경고 메시지 출력
  if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL이 설정되지 않았습니다. 기본값 https://hamkae.sku-sku.com을 사용합니다.');
    console.warn('.env 파일에 VITE_API_BASE_URL=https://hamkae.sku-sku.com을 추가하세요.');
  }

// 서버 환경에서는 항상 HTTPS 도메인 사용
if (window.location.hostname !== 'localhost') {
  console.log('서버 환경 감지: HTTPS 도메인 사용');
}

export const api = axios.create({
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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// default export도 유지 (기존 코드와의 호환성)
export default api;

// 이미지 URL 생성 헬퍼 함수
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (typeof imagePath !== 'string') return '';
  
  // 이미 절대 URL인 경우 그대로 반환
  if (imagePath.startsWith('http')) return imagePath;
  
  // 백엔드 이미지 경로 처리 (업로드된 이미지)
  if (imagePath.startsWith('/images/')) {
    // nginx를 통해 이미지 접근
    // nginx: location /images/ { alias /root/hamkae/uploads/images/; }
    console.log('업로드된 이미지 경로:', imagePath);
    return `https://hamkae.sku-sku.com${imagePath}`;
  }
  
  // 정적 이미지 파일 (public 폴더의 이미지들)
  if (imagePath.startsWith('/public/')) {
    // /public/ 제거하고 루트에서 접근
    const staticPath = imagePath.replace('/public/', '/');
    console.log('정적 이미지 경로:', staticPath);
    return `https://hamkae.sku-sku.com${staticPath}`;
  }
  
  // 기타 상대 경로인 경우
  return `${API_BASE_URL}${imagePath}`;
};