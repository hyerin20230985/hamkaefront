import api from "./apiClient";

export const markerAPI = {
  // 마커 목록 조회 (검색 조건 포함)
  list: (params) => {
    // params 예시: { status: 'ACTIVE', page: 0, size: 20 }
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/markers?${queryString}`).then((r) => r.data);
  },

  // 특정 마커 조회
  get: (id) => api.get(`/markers/${id}`).then((r) => r.data),

  // 특정 사용자가 작성한 마커 목록 조회
  listByUser: (userId) => api.get(`/markers/user/${userId}`).then((r) => r.data),

  // 마커 생성 (form-data 형식)
  create: ({ lat, lng, description, images }) => {
    const formData = new FormData();
    formData.append("lat", lat);
    formData.append("lng", lng);
    formData.append("description", description);
    if (images && images.length > 0) {
      images.forEach((image) => formData.append("images", image));
    }

    return api.post("/markers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((r) => r.data);
  },

  // 마커 삭제
  remove: (id) => api.delete(`/markers/${id}`).then((r) => r.data),
};
