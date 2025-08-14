import api from "./apiClient";

export const authAPI = {
  register: async (name, username, password) => {
    const { data } = await api.post('/auth/register', { name, username, password });
    return data; // { success, message, data: { user_id } }
  },
  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    // 명세: data: { token, user: {...} }
    return data;
  },
};
