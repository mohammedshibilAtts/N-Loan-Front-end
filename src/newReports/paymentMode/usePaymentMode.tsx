import { useState } from "react";
import { paymentModeApi } from "./paymentMode.api";
import { Toast } from "../../components/toast/toast";
import dayjs from "dayjs";

export function usePaymentMode() {
    const [paymentModeData, setPaymentModeData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchPaymentModeReport = async (params: any) => {
        try {
            setLoading(true);
            const res = await paymentModeApi.getPaymentModeReport(params);
            if (res?.status === 200) {
                setPaymentModeData(res.data.data || []);
                setTotalCount(res.data.pagination?.totalRecords || res.data.totalCount || 0);
            } else {
                setPaymentModeData([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to fetch payment mode report",
                type: "error",
            });
            setPaymentModeData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const exportPaymentModeExcel = async (params: any) => {
        try {
            const res = await paymentModeApi.exportPaymentModeReport(params);
            if (res) {
                const blob = new Blob([res], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `PaymentModeReport_${dayjs().format("YYYY-MM-DD")}.xlsx`;
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
        paymentModeData,
        loading,
        totalCount,
        fetchPaymentModeReport,
        exportPaymentModeExcel,
    };
}
