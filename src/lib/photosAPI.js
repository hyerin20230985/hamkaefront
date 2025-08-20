import api from "./apiClient";

export const photosAPI = {
  // 특정 사진 조회
  get: (photoId) => api.get(`/photos/${photoId}`).then((r) => r.data),

  // 특정 마커에 속한 사진 목록 조회 (검색 조건 포함)
  listByMarker: (markerId, params) => {
    // params 예시: { type: 'AFTER', status: 'PENDING' }
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/photos/marker/${markerId}?${queryString}`).then((r) => r.data);
  },

  // 청소 후 사진 업로드 (form-data)
  uploadCleanupPhotos: ({ marker_id, images }) => {
    const formData = new FormData();
    formData.append("marker_id", marker_id);
    if (images && images.length > 0) {
      images.forEach((image) => formData.append("images", image));
    }

    return api.post("/photos/upload/cleanup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((r) => r.data);
  },

  // --- AI 검증 관련 API ---
  // 참고: 이 함수들은 별도의 aiVerificationAPI.js 파일로 분리하는 것이 더 좋을 수 있습니다.

  // 수동으로 AI 검증 시작
  verifyMarker: (markerId) =>
    api.post(`/ai-verification/verify/${markerId}`).then((r) => r.data),

  // AI 검증 상태 조회
  getVerificationStatus: (markerId) =>
    api.get(`/ai-verification/status/${markerId}`).then((r) => r.data),

  // AI 검증 서비스 상태 확인
  getHealthStatus: () => 
    api.get(`/ai-verification/health`).then((r) => r.data),
};
