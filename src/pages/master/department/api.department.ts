// src/pages/masters/department/api.department.ts
import { apiService } from "../../../services/apiService";

export const departmentApi = {
  getAll: () => apiService.get("department"),
  table: (data:any) => apiService.post("department/table",data),
  create: (data: any) => apiService.post("department", data),
  update: (id: string, data: any) => apiService.put(`department/${id}`, data),
  delete: (id: string) => apiService.delete(`department/${id}`),
  patch: (id: string) => apiService.patch(`department/${id}`),
};
