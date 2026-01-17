import { useState } from "react";
import { reportApi } from "./api.report";
import { Toast } from "../components/toast/toast";

export function useLockerTransfer() {
  const [loading, setLoading] = useState(false);
  const [overDueData, setoverDueData] = useState<any[]>([]);

  const getOverDueReport = async (data: any) => {
    try {
      setLoading(true);
      const res = await reportApi.getOverDueReport(data);
      setoverDueData(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to get item details",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };



  return {
    loading,
    getOverDueReport,
    overDueData,
  };
}
