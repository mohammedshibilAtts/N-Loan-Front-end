import { useState } from "react";
import { cashFlowApi } from "./cashFlow.api";
import { Toast } from "../../components/toast/toast";
import dayjs from "dayjs";

export function useCashFlow() {
    const [reportsData, setReportsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchCashFlowReport = async (params: any) => {
        try {
            setLoading(true);
            const res = await cashFlowApi.getCashFlowReport(params);
            if (res?.status === 200) {
                setReportsData(res.data.data || []);
                setTotalCount(res.data.totalCount || 0);
            } else {
                setReportsData([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to fetch cash flow report",
                type: "error",
            });
            setReportsData([]);
            setTotalCount(0); // Reset count on error
        } finally {
            setLoading(false);
        }
    };

    const exportCashFlowExcel = async (params: any) => {
        try {
            const res = await cashFlowApi.exportCashFlowReport(params);
            if (res) {
                const blob = new Blob([res], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `CashFlowReport_${dayjs().format("YYYY-MM-DD")}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to export excel",
                type: "error",
            });
        }
    };

    return {
        reportsData,
        loading,
        totalCount,
        fetchCashFlowReport,
        exportCashFlowExcel,
    };
}
