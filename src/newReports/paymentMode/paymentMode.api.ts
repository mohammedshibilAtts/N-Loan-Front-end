import { apiService } from "../../services/apiService";

export const paymentModeApi = {
    getPaymentModeReport: (data: any) =>
        apiService.post("/reports/paymentModeReport", data),
    exportPaymentModeReport: (data: any) =>
        apiService.postDownload("/reports/exportPaymentModeReport", data),
};
