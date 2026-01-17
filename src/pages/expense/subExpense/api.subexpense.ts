// src/pages/expense/subExpense/api.subExpense.ts
import { apiService } from "../../../services/apiService";

export const subExpenseApi = {
  getAll: () => apiService.get("subexpense"),
  table: (data:any) => apiService.post("subexpense/table",data),
  getById: (id: string) => apiService.get(`subexpense/${id}`),
  getByExpenseId: (id: string) => apiService.get(`subexpense/expense/${id}`),
  create: (data: any) => apiService.post("subexpense", data),
  update: (id: string, data: any) => apiService.put(`subexpense/${id}`, data),
  delete: (id: string) => apiService.delete(`subexpense/${id}`),
  patch: (id: string) => apiService.patch(`subexpense/${id}`),
};
