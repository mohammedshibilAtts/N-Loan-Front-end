import { apiService } from "../../services/apiService";

export const paymentApi = {
    getPaymentReport: (data: any) =>
        apiService.post("/reports/paymentReport", data),
    exportPaymentReport: (data: any) =>
        apiService.postDownload("/reports/exportPaymentReport", data),
    getPaymentModes: () => apiService.get("/common/paymentbasis"),
    getPaymentProviders: () => apiService.get("/common/paymentprovider"),
};
