import { apiService } from "../../../services/apiService";

const BASE_URL = "/metal";

export const metalApi = {
  getAll: () => apiService.get(BASE_URL),
  table: (data:any) => apiService.post(`${BASE_URL}/table`,data),

  getById: (id: string) =>
    apiService.get(`${BASE_URL}/${id}`),

  create: (data: any) =>
    apiService.post(BASE_URL, data),

  update: (id: string, data: any) =>
    apiService.put(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiService.delete(`${BASE_URL}/${id}`),
};
