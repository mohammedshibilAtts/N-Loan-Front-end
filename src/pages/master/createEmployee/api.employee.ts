import { apiService } from "../../../services/apiService";

export const employeeApi = {
  getAll: () => apiService.get("/employee"),
  table: (data:any) => apiService.post("/employee/table",data),

  getById: (id: string) => apiService.get(`/employee/${id}`),

  create: (data: any) => apiService.post("/employee", data),

  update: (id: string, data: any) => apiService.put(`/employee/${id}`, data),

  delete: (id: string) => apiService.delete(`/employee/${id}`),
};
