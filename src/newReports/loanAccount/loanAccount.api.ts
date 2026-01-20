import { apiService } from "../../services/apiService";

export const loanAccountApi = {
    loanAccountReport: (data: any) =>
        apiService.post("/reports/loanAccountReport", data),
    exportLoanAccountReport: (data: any) =>
        apiService.postDownload("/reports/exportLoanAccountReport", data),
};
