import { apiService } from "../../../services/apiService";

export const interestApi = {
  getAll: () => apiService.get("interest"),
  getById: (id: string) => apiService.get(`interest/${id}`),
  create: (data: any) => apiService.post("interest", data),
  update: (id: string, data: any) => apiService.put(`interest/${id}`, data),
  delete: (id: string) => apiService.delete(`interest/${id}`),
};
