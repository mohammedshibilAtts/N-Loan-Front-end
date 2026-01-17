// src/pages/expense/api.expense.ts
import { apiService } from "../../../services/apiService";

export const expenseApi = {
  getAll: () => apiService.get("expense"),
  table: (data:any) => apiService.post("expense/table",data),
  getById: (id: string) => apiService.get(`expense/${id}`),
  create: (data: any) => apiService.post("expense", data),
  update: (id: string, data: any) => apiService.put(`expense/${id}`, data),
  delete: (id: string) => apiService.delete(`expense/${id}`),
  patch: (id: string) => apiService.patch(`expense/${id}`),
};
