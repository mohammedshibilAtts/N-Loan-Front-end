import { apiService } from "../services/apiService";

const BASE_URL = "/reports";

export const reportApi = {
  getOverDueReport: (data:[]) =>
    apiService.get(`${BASE_URL}/overdueReport/`,data),

};
