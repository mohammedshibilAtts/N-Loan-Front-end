import { apiService } from "../../../services/apiService";

export const expenseEntriesApi = {
  getAll: (params?: any) => apiService.get("expense-entries", { params }),
  table: (data: any) => apiService.post("expense-entries/table", data),

  getById: (id: string) => apiService.get(`expense-entries/${id}`),

  create: (data: any) => apiService.post("expense-entries", data),

  update: (id: string, data: any) =>
    apiService.put(`expense-entries/${id}`, data),

  delete: (id: string) => apiService.delete(`expense-entries/${id}`),
};
