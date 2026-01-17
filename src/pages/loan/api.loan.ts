import { apiService } from "../../services/apiService";

export const loanApi = {
  getAll: () => apiService.get("/loans"),
  table: (data:any) => apiService.post("/loans/table",data),
  getById: (id: string) => apiService.get(`/loans/${id}`),
  create: (data: any) => apiService.postFile("/loans", data),
//   update: (id: string, data: any) => apiService.put(`/loans/${id}`, data),
//   delete: (id: string) => apiService.delete(`/loans/${id}`),
};
