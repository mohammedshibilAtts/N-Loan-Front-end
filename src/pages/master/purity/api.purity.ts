// src/pages/masters/purity/api.purity.ts
import { apiService } from "../../../services/apiService";

export const purityApi = {
  getAll: () => apiService.get("purity"),
  table: (data?:any) => apiService.post("purity/table",data),
  create: (data: any) => apiService.post("purity", data),
  update: (id: string, data: any) => apiService.put(`purity/${id}`, data),
  delete: (id: string) => apiService.delete(`purity/${id}`),
  getByMetal: (id: string) => apiService.get(`purity/metal/${id}`),
};
