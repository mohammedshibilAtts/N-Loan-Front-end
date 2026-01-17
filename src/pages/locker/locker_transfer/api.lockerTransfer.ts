import { apiService } from "../../../services/apiService";

const BASE_URL = "/locker";

export const lockerTransferApi = {
  getByTagNo: (tagId: string, branchId: string) =>
    apiService.get(`${BASE_URL}/item/${tagId}/${branchId}`),

  update: (data: any) => apiService.put(`${BASE_URL}/transfer`, data),
};
