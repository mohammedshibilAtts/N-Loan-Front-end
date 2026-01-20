import { useState } from "react";
import { incomeExpensesApi } from "./incomeExpenses.api";
import { Toast } from "../../components/toast/toast";

export function useIncomeExpenses() {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchIncomeExpenseReport = async (params: any) => {
        try {
            setLoading(true);
            const res = await incomeExpensesApi.getIncomeExpenseReport(params);
            if (res?.status === 200) {
                setReportData(res.data || null);
            } else {
                setReportData(null);
            }
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to fetch income & expense report",
                type: "error",
            });
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        reportData,
        loading,
        fetchIncomeExpenseReport,
    };
}
