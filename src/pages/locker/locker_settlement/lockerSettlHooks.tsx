import { useState } from "react";
import { settlementApi } from "./api.lockerSettlement";
import { Toast } from "../../../components/toast/toast";

export function useLockerSettlement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- TABLE / LIST ----------
  const table = async (params: any) => {
    try {
      setLoading(true);
      const res = await settlementApi.table(params);
      setData(res.data?.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to get data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------- CREATE TRANSFER ----------
  const add = async (payload: any) => {
    try {
      setLoading(true);
      const res = await settlementApi.add(payload);

      Toast.show({
        message: res?.message || "Locker transferred successfully",
        type: "success",
      });

      return true;
    } catch (error: any) {
      Toast.show({
        message: error?.message || "Failed to transfer the locker",
        type: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    table,
    add,   // 👈 expose add
  };
}
