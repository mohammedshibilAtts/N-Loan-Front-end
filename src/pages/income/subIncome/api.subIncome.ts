// src/pages/income/subIncome/api.subIncome.ts
import { apiService } from "../../../services/apiService";

export const subIncomeApi = {
    getAll: () => apiService.get("subIncome"),
    table: (data: any) => apiService.post("subIncome/table", data),
    getById: (id: string) => apiService.get(`subIncome/${id}`),
    getByIncomeId: (id: string) => apiService.get(`subIncome/income/${id}`),
    create: (data: any) => apiService.post("subIncome", data),
    update: (id: string, data: any) => apiService.put(`subIncome/${id}`, data),
    delete: (id: string) => apiService.delete(`subIncome/${id}`),
    patch: (id: string) => apiService.patch(`subIncome/${id}`),
};
