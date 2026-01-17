// src/pages/masters/locality/api.locality.ts
import { apiService } from "../../../services/apiService";

export const localityApi = {
  getAll: () => apiService.get("locality"),
  table: (data:any) => apiService.post("locality/table",data),
  getById: (id: string) => apiService.get(`locality/${id}`),
  create: (data: any) => apiService.post("locality", data),
  update: (id: string, data: any) => apiService.put(`locality/${id}`, data),
  delete: (id: string) => apiService.delete(`locality/${id}`),
};
