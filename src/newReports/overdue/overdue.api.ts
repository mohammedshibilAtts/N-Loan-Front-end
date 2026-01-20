import { apiService } from "../../services/apiService";

export const overdueApi = {
    overdueReport: (data: any) => apiService.post("/reports/overdueReport", data),
    exportOverdueReport: (data: any) =>
        apiService.postDownload("/reports/exportOverdueReport", data),
};
