// src/modules/locker/api.locker.ts
import { apiService } from "../../../services/apiService";

export interface Locker {
  _id: string;
  lockerName: string;
  licenseNo: string;
  mobile: string;
  branchId: string;
  address: string;
  pincode: string;
  countryId: string;
  stateId: string;
  cityId: string;
  thirdParty: boolean;
}

export interface LockerPayload {
  lockerName: string;
  licenseNo: string;
  mobile: string;
  branchId: string;
  address: string;
  pincode: string;
  countryId: string;
  stateId: string;
  cityId: string;
  thirdParty: boolean;
}

export const lockerApi = {
  getAll: () => apiService.get("locker"),
  getById: (id: string) => apiService.get(`locker/${id}`),
  create: (data: LockerPayload) => apiService.post("locker", data),
  update: (id: string, data: LockerPayload) =>
    apiService.put(`locker/${id}`, data),
  delete: (id: string) => apiService.delete(`locker/${id}`),
};
