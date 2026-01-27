import { apiService } from "./apiService";

export const marketRateApi = {
  getAll: () => apiService.get("common/marketrate"),
};
export const calculationTypes = {
  getAll: () => apiService.get("common/calculationtypes"),
};


export const countryApi = {
  getAll: () => apiService.get("/common/country"),
};

export const stateApi = {
  getAll:()=>apiService.get(`/common/state/`),
  getByCountry: (countryId: string) =>
    apiService.get(`/common/state/${countryId}`),
};

export const cityApi = {
  getByState: (stateId: string) =>
    apiService.get(`/common/city/${stateId}`),
};

export const paymentModeApi = {
  getAll: () =>
    apiService.get(`/common/payment-mode`),
};

export const paymentProviderApi = {
  getByPaymentMode: (modeId:string) =>
     apiService.get(`/common/payment-provider/${modeId}`),
};

export const genderApi = {
    getAll: () => apiService.get("common/gender"),
};

export const martialStatus = {
    getAll: () => apiService.get("common/martialstatus"),
};

export const closedTypes = {
    getAll: () => apiService.get("common/closed"),
};

