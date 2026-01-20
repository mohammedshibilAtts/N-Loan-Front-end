// src/pages/income/incomeEntries/api.incomeEntries.ts
import { apiService } from "../../../services/apiService";

export const incomeEntriesApi = {
    getAll: () => apiService.get("incomeentries"),
    table: (data: any) => apiService.post("incomeentries/table", data),
    getById: (id: string) => apiService.get(`incomeentries/${id}`),
    create: (data: any) => apiService.post("incomeentries", data),
    update: (id: string, data: any) => apiService.put(`incomeentries/${id}`, data),
    delete: (id: string) => apiService.delete(`incomeentries/${id}`),
};
