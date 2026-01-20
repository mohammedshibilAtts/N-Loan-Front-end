import { useState } from "react";
import { loanAccountApi } from "./loanAccount.api";
import { Toast } from "../../components/toast/toast";

export function useLoanAccount() {
    const [loanAccountData, setLoanAccountData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchLoanAccountReports = async (params: any) => {
        try {
            setLoading(true);
            const res = await loanAccountApi.loanAccountReport(params);
            if (res?.data?.success) {
                setLoanAccountData(res.data.data || []);
                setTotalCount(res.data.pagination?.totalRecords || res.data.totalCount || 0);
            } else {
                setLoanAccountData([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to fetch reports",
                type: "error",
            });
            setLoanAccountData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const exportLoanAccountReport = async (params: any) => {
        try {
            const res: any = await loanAccountApi.exportLoanAccountReport(params);
            const blob = new Blob([res], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "LoanAccountReport.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to export report",
                type: "error",
            });
        }
    };

    return {
        loanAccountData,
        loading,
        totalCount,
        fetchLoanAccountReports,
        exportLoanAccountReport,
    };
}
