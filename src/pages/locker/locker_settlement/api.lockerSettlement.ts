import { apiService } from "../../../services/apiService";

const BASE_URL = "/locker";

export const settlementApi = {
  add: (data: any) => apiService.post(`${BASE_URL}/settlement`, data),
  table: (data: any) =>
    apiService.post(`${BASE_URL}/settlement/table`, data),
};
