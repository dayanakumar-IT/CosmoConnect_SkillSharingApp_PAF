import api from './index';

export const competitionApi = {
  getAll: () => api.get('/v1/competitions'),
  getById: (id) => api.get(`/v1/competitions/${id}`),
  create: (formData) => api.post('/v1/competitions/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id, formData) => api.put(`/v1/competitions/edit/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  delete: (id) => api.delete(`/v1/competitions/delete/${id}`)
};

export default competitionApi; 