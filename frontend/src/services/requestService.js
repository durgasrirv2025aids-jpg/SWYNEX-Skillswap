import api, { normalizeApiResponse } from './api';

const requestService = {
  sendRequest: async (receiverId, message = '') => {
    const res = await api.post('/requests', { receiverId, message });
    return normalizeApiResponse(res);
  },

  getSentRequests: async () => {
    const res = await api.get('/requests/sent');
    return normalizeApiResponse(res);
  },

  getReceivedRequests: async () => {
    const res = await api.get('/requests/received');
    return normalizeApiResponse(res);
  },

  getRequestById: async (id) => {
    const res = await api.get(`/requests/${id}`);
    return normalizeApiResponse(res);
  },

  acceptRequest: async (id) => {
    const res = await api.patch(`/requests/${id}/accept`);
    return normalizeApiResponse(res);
  },

  rejectRequest: async (id) => {
    const res = await api.patch(`/requests/${id}/reject`);
    return normalizeApiResponse(res);
  },

  cancelRequest: async (id) => {
    const res = await api.patch(`/requests/${id}/cancel`);
    return normalizeApiResponse(res);
  },
};

export default requestService;

