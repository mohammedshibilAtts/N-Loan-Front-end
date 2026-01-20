import { useState, useEffect } from "react";
import { paymentApi } from "./payment.api";
import { Toast } from "../../components/toast/toast";
import dayjs from "dayjs";

export function usePayment() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>([]);
    const [paymentProvidersList, setPaymentProvidersList] = useState<any[]>([]);

    const fetchPaymentReport = async (params: any) => {
        try {
            setLoading(true);
            const res = await paymentApi.getPaymentReport(params);
            if (res?.status === 200) {
                setReportData(res.data.data || []);
                setTotalCount(res.data.totalCount || 0);
            } else {
                setReportData([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to fetch payment report",
                type: "error",
            });
            setReportData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentModes = async () => {
        try {
            const res = await paymentApi.getPaymentModes();
            if (res?.success) {
                setPaymentMethodsList(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch payment modes", err);
        }
    };

    const fetchPaymentProviders = async () => {
        try {
            const res = await paymentApi.getPaymentProviders();
            if (res?.success) {
                setPaymentProvidersList(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch payment providers", err);
        }
    };

    const exportPaymentExcel = async (params: any) => {
        try {
            const res = await paymentApi.exportPaymentReport(params);
            if (res) {
                const blob = new Blob([res], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `PaymentReport_${dayjs().format("YYYY-MM-DD")}.xlsx`;
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

    // Initial fetch for modes and providers
    useEffect(() => {
        fetchPaymentModes();
        fetchPaymentProviders();
    }, []);

    return {
        reportData,
        loading,
        totalCount,
        paymentMethodsList,
        paymentProvidersList,
        fetchPaymentReport,
        exportPaymentExcel,
    };
}
