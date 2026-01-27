import { apiService } from "../../../services/apiService";

export const organisationApi = {
  find: () => apiService.get(`organisation`),
  create: (data: any) => apiService.post("organisation", data),
 
};
