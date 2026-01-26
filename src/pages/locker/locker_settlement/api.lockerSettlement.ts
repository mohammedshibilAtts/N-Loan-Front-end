import { apiService } from "../../../services/apiService";

const BASE_URL = "/locker";

export const settlementApi = {
  add: (data: any) => apiService.put(`${BASE_URL}/settlement`, data),
  table: (data: any) =>
    apiService.put(`${BASE_URL}/locker/settlement/table`, data),
};
