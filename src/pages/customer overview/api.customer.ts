import { apiService } from "../../services/apiService";

export const customerApi = {
  getAll: (params?: any) => apiService.get("/customers", { params }),
  getById: (id: string) => apiService.get(`/customers/${id}`),
  search: (data: any) => apiService.post("/customers/search",data),
  create: (data: any) => apiService.postFile("/customers", data),
  table: (data: any) => apiService.post("/customers/table", data),
  update: (id: string, data: any) => apiService.put(`/customers/${id}`, data),
  delete: (id: string) => apiService.delete(`/customers/${id}`),
};
