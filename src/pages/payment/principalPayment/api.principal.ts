import { apiService } from "../../../services/apiService";

export const principalApi = {

  // Submit the principal adjustment
  create: (data: any) => apiService.post("/principalAmountAdj", data),
  table: (data: any) => apiService.post("/principalAmountAdj/table", data),
};
