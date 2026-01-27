import { useState } from "react";
import { toast } from "react-toastify";
import { principalApi } from "./api.principal";
import { loanAccountApi } from "../../manageLoan/customer/api.loanAccount";

export const usePrincipalAdjustment = () => {
    const [loading, setLoading] = useState(false);
    const [loanAccountData, setLoanAccountData] = useState<any>(null);
    const [itemData, setItemData] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);

   
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

    const createAdjustment = async (data: any) => {
        try {
            setLoading(true);
            const res = await principalApi.create(data);
            if (res?.success) {
                toast.success("Principal amount updated successfully");
                return true;
            } else {
                toast.error("Failed to update principal amount");
                return false;
            }
        } catch (error: any) {
            console.error("Failed to update principal amount", error);
            toast.error(error?.message || "Failed to update principal amount");
            return false;
        } finally {
            setLoading(false);
        }
    };

      const fetchTable = async (params?: any) => {
        try {
          setLoading(true);
          const res = await principalApi.table(params);
          setData(res?.data?.data || []);
          return res?.data?.total || 0;
        } finally {
          setLoading(false);
        }
      };



    return {
        loading,
        loanAccountData,
        itemData,
        fetchLoanDetails,
        createAdjustment,
        setLoanAccountData,
        setItemData,
        fetchTable,
        data
    };
};
