import { useState } from "react";
import { toast } from "react-toastify";
import { paymentApi } from "./api.payment";
import { loanAccountApi } from "../manageLoan/customer/api.loanAccount";

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [relationships, setRelationships] = useState<any[]>([]);
    const [paymentBasisList, setPaymentBasisList] = useState<any[]>([]);
    const [dueData, setDueData] = useState<{
        isDue: number | boolean;
        amount: number;
        fineAmount?: number;
        payableAmount?: number;
    }>({ isDue: 0, amount: 0, payableAmount: 0 });

    /* ---------- LOAN DETAILS ---------- */
    const [loanAccountData, setLoanAccountData] = useState<any>(null);
    const [itemData, setItemData] = useState<any[]>([]);

    /* ---------- PAYMENT MODES & PROVIDERS ---------- */
    const [paymentModes, setPaymentModes] = useState<any[]>([]);
    const [paymentProviders, setPaymentProviders] = useState<any[]>([]);


    const fetchRelationships = async () => {
        try {
            const res = await paymentApi.getRelationships();
            if (res?.success) {
                setRelationships(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch relationships", error);
        }
    };

    const fetchPaymentModes = async () => {
        try {
            const res = await paymentApi.getPaymentModes();
            if (res?.success) {
                setPaymentModes(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch payment modes", error);
        }
    };

    const fetchPaymentProviders = async (modeId: string) => {
        try {
            const res = await paymentApi.getPaymentProviders(modeId);
            if (res?.success) {
                setPaymentProviders(res.data);
            } else {
                setPaymentProviders([]);
            }
        } catch (error) {
            console.error("Failed to fetch payment providers", error);
            setPaymentProviders([]);
        }
    };

    const fetchPaymentBasis = async () => {
        try {
            const res = await paymentApi.getPaymentBasis();
            if (res?.success && res.data.length > 0) {
                setPaymentBasisList(res.data);
            } else {
                // Fallback if API returns empty
                setPaymentBasisList([
                    { no: 1, mode: "Interest" },
                    { no: 2, mode: "Overdue Interest" },
                    { no: 3, mode: "Aditional Charges" },
                    { no: 4, mode: "Principal Amount" },
                    { no: 5, mode: "Pre Closing" },
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch payment basis", error);
            // Fallback on error
            setPaymentBasisList([
                { no: 1, mode: "Interest" },
                { no: 2, mode: "Overdue Interest" },
                { no: 3, mode: "Aditional Charges" },
                { no: 4, mode: "Principal Amount" },
                { no: 5, mode: "Pre Closing" },
            ]);
        }
    };

    const fetchDue = async (loanAccountId: string, paymentBasis: string) => {
        if (!loanAccountId || !paymentBasis) return;
        try {
            setLoading(true);
            const res = await paymentApi.getDue({ loanAccountId, paymentBasis });
            if (res?.success) {
                setDueData(res.data);
            } else {
                setDueData({ isDue: 0, amount: 0, payableAmount: 0 });
            }
        } catch (error: any) {
            console.error("Failed to fetch due amount", error);
            toast.error(error?.message || "Failed to fetch due amount");
            setDueData({ isDue: 0, amount: 0, payableAmount: 0 });
        } finally {
            setLoading(false);
        }
    };

    const createPayment = async (data: any) => {
        try {
            setLoading(true);
            const res = await paymentApi.create(data);
            if (res?.success) {
                toast.success("Payment successfully completed");
                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Failed to create payment", error);
            toast.error(error?.message || "Failed to create payment");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchLoanDetails = async (id: string) => {
        try {
            setLoading(true);
            const res = await loanAccountApi.getById(id);
            if (res?.data) {
                setLoanAccountData(res.data.loanData);
                setItemData(res.data.items.item || []);
            }
        } catch (error: any) {
            console.error("Failed to fetch loan details", error);
            toast.error(error?.message || "Failed to fetch loan details");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        relationships,
        paymentBasisList,
        dueData,
        loanAccountData,
        itemData,
        fetchRelationships,
        fetchPaymentBasis,
        fetchDue,
        createPayment,
        setDueData,
        fetchLoanDetails,
        setLoanAccountData,
        setItemData,
        paymentModes,
        paymentProviders,
        fetchPaymentModes,
        fetchPaymentProviders
    };
};
