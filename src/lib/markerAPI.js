import api from "./apiClient";

export const markerAPI = {
  list: () => api.get("/markers").then(r => r.data),
  get:  (id) => api.get(`/markers/${id}`).then(r => r.data),
  create: ({ lat, lng, description }) =>
    api.post("/markers", { lat, lng, description }).then(r => r.data),
  remove: (id) => api.delete(`/markers/${id}`).then(r => r.data),
};
