import { api } from './apiClient';

export const pointHistoryAPI = {
  // 포인트 이력 조회
  getHistories: () => {
    return api.get('/api/point-history').then((r) => r.data);
  },

  // 포인트 통계 조회 (백엔드의 /statistics 엔드포인트 사용)
  getSummary: () => {
    return api.get('/api/point-history/statistics').then((r) => r.data);
  },

  // 타입별 포인트 이력 조회
  getHistoriesByType: (type) => {
    return api.get(`/api/point-history/type/${type}`).then((r) => r.data);
  }
};
