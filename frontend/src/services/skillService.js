import api, { normalizeApiResponse } from './api';

const skillService = {
  // Global skills catalog
  getAllSkills: async (keyword = '', page = 0, size = 20) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    const res = await api.get('/skills', { params });
    return normalizeApiResponse(res);
  },

  // Student skills
  addStudentSkill: async (data) => {
    // data: { skillName, category, skillType ('TEACH' | 'LEARN'), proficiencyLevel }
    const res = await api.post('/student-skills', data);
    return normalizeApiResponse(res);
  },

  getMyStudentSkills: async (type = null) => {
    const params = type ? { type } : {};
    const res = await api.get('/student-skills/me', { params });
    return normalizeApiResponse(res);
  },

  getStudentSkillsByStudentId: async (studentId, type = null) => {
    const params = type ? { type } : {};
    const res = await api.get(`/student-skills/student/${studentId}`, { params });
    return normalizeApiResponse(res);
  },

  updateStudentSkill: async (id, data) => {
    const res = await api.put(`/student-skills/${id}`, data);
    return normalizeApiResponse(res);
  },

  deleteStudentSkill: async (id) => {
    const res = await api.delete(`/student-skills/${id}`);
    return normalizeApiResponse(res);
  },
};

export default skillService;

