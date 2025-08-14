import api from "./apiClient";

export const pointsAPI = {
  summary: () => api.get("/points").then(r => r.data),
  history: () => api.get("/points/history").then(r => r.data),
  redeem:  ({ points, reward_type }) =>
    api.post("/rewards", { points, reward_type }).then(r => r.data),
  rewards: () => api.get("/rewards").then(r => r.data),
};
