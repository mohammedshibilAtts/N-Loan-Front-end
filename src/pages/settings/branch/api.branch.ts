import { apiService } from "../../../services/apiService";

export const branchApi = {
  getAll: () => apiService.get("branch"),
  getById: (id: string) => apiService.get(`branch/${id}`),
  create: (data: any) => apiService.post("branch", data),
  update: (id: string, data: any) => apiService.put(`branch/${id}`, data),
  delete: (id: string) => apiService.delete(`branch/${id}`),
};
