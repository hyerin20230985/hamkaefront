import api from "./apiClient";

export const photosAPI = {
  upload: ({ marker_id, type, file }) => {
    const fd = new FormData();
    fd.append("marker_id", String(marker_id));
    fd.append("type", type);                // 'report' | 'before' | 'after'
    fd.append("image", file);
    return api.post("/photos/upload", fd).then(r => r.data);
  },

  verify: (photoId) =>
    api.post(`/photos/${photoId}/verify`).then(r => r.data),

  listByMarker: (markerId) =>
    api.get(`/photos/marker/${markerId}`).then(r => r.data),
};
