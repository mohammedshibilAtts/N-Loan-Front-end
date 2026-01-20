import { apiService } from "../../services/apiService";

export const cashFlowApi = {
    getCashFlowReport: (data: any) =>
        apiService.post("/reports/cashFlowReport", data),
    exportCashFlowReport: (data: any) =>
        apiService.postDownload("/reports/exportCashFlowReport", data),
};
