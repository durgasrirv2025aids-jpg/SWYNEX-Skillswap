import api, { normalizeApiResponse } from './api';

const connectionService = {
  getMyConnections: async () => {
    const res = await api.get('/connections');
    return normalizeApiResponse(res);
  },

  getConnectionById: async (id) => {
    const res = await api.get(`/connections/${id}`);
    return normalizeApiResponse(res);
  },

  removeConnection: async (id) => {
    const res = await api.delete(`/connections/${id}`);
    return normalizeApiResponse(res);
  },
};

export default connectionService;

