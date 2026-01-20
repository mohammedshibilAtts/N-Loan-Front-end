import { apiService } from "./apiService";

export const reportsApi = {
    incomeExpenseReport: (data: any) =>
        apiService.post("/incomeExpenseReport", data),

    paymentModeReport: (data: any) => apiService.post("/paymentModeReport", data),
    exportPaymentModeReport: (data: any) =>
        apiService.postDownload("/exportPaymentModeReport", data),

    stockLedgerReport: (data: any) => apiService.post("/stockLedgerReport", data),
    exportStockLedgerReport: (data: any) =>
        apiService.postDownload("/exportStockLedgerReport", data),

    cashFlowReport: (data: any) => apiService.post("/cashFlowReport", data),
    exportCashFlowReport: (data: any) =>
        apiService.postDownload("/exportCashFlowReport", data),

    paymentReport: (data: any) => apiService.post("/paymentReport", data),
    exportPaymentReport: (data: any) =>
        apiService.postDownload("/exportPaymentReport", data),
};
