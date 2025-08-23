import { api } from './apiClient';

export const userAPI = {
  // 사용자 프로필 조회 (포인트 통계 포함)
  getProfile: () => {
    console.log('사용자 프로필 조회 요청');
    return api.get('/api/users/profile').then((r) => {
      console.log('사용자 프로필 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('사용자 프로필 조회 실패:', error);
      throw error;
    });
  },

  // 포인트 현황 조회
  getPointsSummary: () => {
    console.log('포인트 현황 조회 요청');
    return api.get('/api/users/points/summary').then((r) => {
      console.log('포인트 현황 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('포인트 현황 조회 실패:', error);
      throw error;
    });
  },

  // 사용자 활동 요약 조회
  getActivitySummary: () => {
    console.log('사용자 활동 요약 조회 요청');
    return api.get('/api/users/activity/summary').then((r) => {
      console.log('사용자 활동 요약 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('사용자 활동 요약 조회 실패:', error);
      throw error;
    });
  },

  // 사용자 정보 업데이트
  updateProfile: (data) => {
    console.log('사용자 정보 업데이트 요청:', data);
    return api.put('/api/users/profile', data).then((r) => {
      console.log('사용자 정보 업데이트 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('사용자 정보 업데이트 실패:', error);
      throw error;
    });
  },

  // 비밀번호 변경
  changePassword: (data) => {
    console.log('비밀번호 변경 요청');
    return api.put('/api/users/password', data).then((r) => {
      console.log('비밀번호 변경 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('비밀번호 변경 실패:', error);
      throw error;
    });
  },

  // 테스트용 포인트 조정 (GET 방식)
  setPointsForTesting: (points) => {
    console.log('테스트용 포인트 조정 요청:', points);
    return api.get(`/api/users/points/admin-set?points=${points}`).then((r) => {
      console.log('포인트 조정 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('포인트 조정 실패:', error);
      throw error;
    });
  },

  // 내 핀번호 목록 조회
  getMyPins: () => {
    console.log('내 핀번호 목록 조회 요청');
    return api.get('/api/reward-pins').then((r) => {
      console.log('핀번호 목록 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('핀번호 목록 조회 실패:', error);
      throw error;
    });
  },

  // 사용 가능한 핀번호 조회
  getAvailablePins: () => {
    console.log('사용 가능한 핀번호 조회 요청');
    return api.get('/api/reward-pins/available').then((r) => {
      console.log('사용 가능한 핀번호 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('사용 가능한 핀번호 조회 실패:', error);
      throw error;
    });
  },

  // 사용된 핀번호 조회
  getUsedPins: () => {
    console.log('사용된 핀번호 조회 요청');
    return api.get('/api/reward-pins/used').then((r) => {
      console.log('사용된 핀번호 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('사용된 핀번호 조회 실패:', error);
      throw error;
    });
  },

  // 특정 핀번호의 전체 정보 조회 (핀번호 사용 시)
  getPinInfo: (pinNumber) => {
    console.log('핀번호 정보 조회 요청:', pinNumber);
    return api.get(`/api/reward-pins/info/${pinNumber}`).then((r) => {
      console.log('핀번호 정보 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('핀번호 정보 조회 실패:', error);
      throw error;
    });
  },

  // 특정 핀번호의 전체 정보 조회 (보안용)
  getFullPinInfo: (pinId) => {
    console.log('핀번호 전체 정보 조회 요청:', pinId);
    return api.get(`/api/reward-pins/${pinId}/full`).then((r) => {
      console.log('핀번호 전체 정보 응답:', r.data);
      return r.data;
    }).catch((error) => {
      console.error('핀번호 전체 정보 조회 실패:', error);
      throw error;
    });
  }
};
