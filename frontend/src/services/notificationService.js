import api, { normalizeApiResponse } from './api';

const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return normalizeApiResponse(res);
  },

  getUnreadNotifications: async () => {
    const res = await api.get('/notifications/unread');
    return normalizeApiResponse(res);
  },

  markAsRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return normalizeApiResponse(res);
  },

  markAllAsRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return normalizeApiResponse(res);
  },
};

export default notificationService;
