import { useState } from "react";
import { toast } from "react-toastify";
import { interestPaymentApi } from "./api.interestPayment";
import { loanAccountApi } from "../../manageLoan/customer/api.loanAccount";

export const useInterestPayment = () => {
    const [loading, setLoading] = useState(false);
    const [relationships, setRelationships] = useState<any[]>([]);
    const [paymentBasisList, setPaymentBasisList] = useState<any[]>([]);
    const [dueData, setDueData] = useState<{
        isDue: number;
        amount: number;
        fineAmount?: number;
    }>({ isDue: 0, amount: 0 });

    const fetchRelationships = async () => {
        try {
            const res = await interestPaymentApi.getRelationships();
            if (res?.data?.success) {
                setRelationships(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch relationships", error);
        }
    };

    const fetchPaymentBasis = async () => {
        try {
            const res = await interestPaymentApi.getPaymentBasis();
            if (res?.data?.success) {
                setPaymentBasisList(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch payment basis", error);
        }
    };

    const fetchDue = async (loanAccountId: string, paymentBasis: string) => {
        if (!loanAccountId || !paymentBasis) return;
        try {
            setLoading(true);
            const res = await interestPaymentApi.getDue({ loanAccountId, paymentBasis });
            if (res?.data?.success) {
                setDueData(res.data.data);
            } else {
                setDueData({ isDue: 0, amount: 0 });
            }
        } catch (error: any) {
            console.error("Failed to fetch due amount", error);
            toast.error(error?.message || "Failed to fetch due amount");
            setDueData({ isDue: 0, amount: 0 });
        } finally {
            setLoading(false);
        }
    };

    const createPayment = async (data: any) => {
        try {
            setLoading(true);
            const res = await interestPaymentApi.create(data);
            if (res?.data?.success) {
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

    /* ---------- LOAN DETAILS ---------- */
    const [loanAccountData, setLoanAccountData] = useState<any>(null);
    const [itemData, setItemData] = useState<any[]>([]);

    const fetchLoanDetails = async (id: string) => {
        try {
            setLoading(true);
            const res = await loanAccountApi.getById(id);
            if (res?.data) {
                setLoanAccountData(res.data.loanData);
                setItemData(res.data.items || []);
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
        setItemData
    };
};
