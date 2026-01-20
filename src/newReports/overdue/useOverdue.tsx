import { useState } from "react";
import { overdueApi } from "./overdue.api";
import { Toast } from "../../components/toast/toast";

export function useOverdue() {
    const [reportsData, setReportsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchOverdueReports = async (params: any) => {
        try {
            setLoading(true);
            const res = await overdueApi.overdueReport(params);
            if (res?.data?.success) {
                setReportsData(res.data.data || []);
                setTotalCount(res.data.pagination?.totalRecords || res.data.totalCount || 0);
            } else {
                setReportsData([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            Toast.show({ message: err.message || "Failed to fetch reports", type: "error" });
            setReportsData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const exportOverdueReport = async (params: any) => {
        try {
            const res: any = await overdueApi.exportOverdueReport(params);
            const blob = new Blob([res], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "OverDueReport.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            Toast.show({ message: err.message || "Failed to export report", type: "error" });
        }
    };

    return {
        reportsData,
        loading,
        totalCount,
        fetchOverdueReports,
        exportOverdueReport,
    };
}
