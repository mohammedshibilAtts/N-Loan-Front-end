import { useState, useEffect } from "react";
import { stockLedgerApi } from "./stockLedger.api";
import { Toast } from "../../components/toast/toast";
import dayjs from "dayjs";

export function useStockLedger() {
    const [stockLedgerData, setStockLedgerData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const [metalsList, setMetalsList] = useState<any[]>([]);
    const [puritiesList, setPuritiesList] = useState<any[]>([]);
    const [itemsList, setItemsList] = useState<any[]>([]);

    const fetchStockLedgerReport = async (params: any) => {
        try {
            setLoading(true);
            const res = await stockLedgerApi.getStockLedgerReport(params);
            if (res?.status === 200) {
                setStockLedgerData(res.data.data || []);
                setTotalCount(res.data.pagination?.totalRecords || res.data.totalCount || 0);
            } else {
                setStockLedgerData([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            Toast.show({
                message: err.message || "Failed to fetch stock ledger report",
                type: "error",
            });
            setStockLedgerData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetals = async () => {
        try {
            const res = await stockLedgerApi.getMetals();
            if (res?.success) {
                setMetalsList(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch metals", err);
        }
    };

    const fetchPurities = async () => {
        try {
            const res = await stockLedgerApi.getPurities();
            if (res?.success) {
                setPuritiesList(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch purities", err);
        }
    };

    const fetchItems = async () => {
        try {
            const res = await stockLedgerApi.getItems();
            if (res?.success) {
                setItemsList(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch items", err);
        }
    };

    const exportStockLedgerExcel = async (params: any) => {
        try {
            const res = await stockLedgerApi.exportStockLedgerReport(params);
            if (res) {
                const blob = new Blob([res], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `StockLedgerReport_${dayjs().format("YYYY-MM-DD")}.xlsx`;
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

    // Initial fetch for dropdowns
    useEffect(() => {
        fetchMetals();
        fetchPurities();
        fetchItems();
    }, []);

    return {
        stockLedgerData,
        loading,
        totalCount,
        metalsList,
        puritiesList,
        itemsList,
        fetchStockLedgerReport,
        exportStockLedgerExcel,
    };
}
