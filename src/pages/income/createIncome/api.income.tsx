// src/pages/income/api.income.ts
import { apiService } from "../../../services/apiService";

export const incomeApi = {
    getAll: () => apiService.get("income/"),
    table: (data: any) => apiService.post("income/table", data),
    getById: (id: string) => apiService.get(`income/${id}`),
    create: (data: any) => apiService.post("income", data),
    update: (id: string, data: any) => apiService.put(`income/${id}`, data),
    delete: (id: string) => apiService.delete(`income/${id}`),
    patch: (id: string) => apiService.patch(`income/${id}`),
};
