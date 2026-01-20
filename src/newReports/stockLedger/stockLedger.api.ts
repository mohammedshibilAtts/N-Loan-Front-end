import { apiService } from "../../services/apiService";

export const stockLedgerApi = {
    getStockLedgerReport: (data: any) =>
        apiService.post("/reports/stockLedgerReport", data),
    exportStockLedgerReport: (data: any) =>
        apiService.postDownload("/reports/exportStockLedgerReport", data),
    getMetals: () => apiService.get("/metal"),
    getPurities: () => apiService.get("/purity"),
    getItems: () => apiService.get("/item"),
};
