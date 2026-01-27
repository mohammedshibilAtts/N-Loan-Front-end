import { apiService } from "../../../services/apiService";

const BASE_URL = "/metal-rate";

export const metalRateApi = {
  getMetalRate: (data: any) => apiService.post(BASE_URL, data),
  getRateByPurity:(branchId:string,purityId:string,puirtyNo:Number)=> apiService.get(`${BASE_URL}/${branchId}/${purityId}/${puirtyNo}`),
  updateRate: (data: any[]) => apiService.put(BASE_URL, data),
};
