// src/pages/masters/item/api.item.ts
import { apiService } from "../../../services/apiService";

export const itemApi = {
  getAll: (query?:any) => apiService.get("item",query),
  table: (data: any) => apiService.post("item/table", data),
  create: (data: any) => apiService.post("item", data),
  update: (id: string, data: any) => apiService.put(`item/${id}`, data),
  delete: (id: string) => apiService.delete(`item/${id}`),
  getById: (id: string) => apiService.get(`item/${id}`),
  patch: (id: string) => apiService.patch(`item/${id}`)
};
