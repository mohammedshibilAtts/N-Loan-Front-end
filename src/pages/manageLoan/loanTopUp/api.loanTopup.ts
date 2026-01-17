import { apiService } from "../../../services/apiService";

export const topUpApi = {
  create: (data: any) => apiService.post("/loanTopup", data),
  table: (data: any) => apiService.post("/table", data),
};
