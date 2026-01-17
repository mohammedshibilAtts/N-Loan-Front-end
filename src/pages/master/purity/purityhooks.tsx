// src/pages/masters/purity/usePurity.ts
import { useState } from "react";
import { purityApi } from "./api.purity";
import { Toast } from "../../../components/toast/toast";

export function usePurity() {
  const [purities, setPurities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPurities = async () => {
    try {
      setLoading(true);
      const res = await purityApi.getAll();
      setPurities(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load purities",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPurity = async (data: any) => {
    const res = await purityApi.create(data);
    Toast.show({ message: res?.message, type: "success" });
    fetchPurities();
  };

  const updatePurity = async (id: string, data: any) => {
    const res = await purityApi.update(id, data);
    Toast.show({ message: res?.message, type: "success" });
    fetchPurities();
  };

  const deletePurity = async (id: string) => {
    const res = await purityApi.delete(id);
    Toast.show({ message: res?.message, type: "success" });
    fetchPurities();
  };

 
  const fetchPuritiesByMetal = async (metalId: string) => {
    const res = await purityApi.getByMetal(metalId);
    setPurities(res.data || []);
  };

    const fetchPuritiesTable = async (params: any) => {
    try {
      setLoading(true);
      const res = await purityApi.table(params);
      setPurities(res?.data?.data || []);
      return res?.data?.total || 0;
    } finally {
      setLoading(false);
    }
  };

  return {
    purities,
    loading,
    fetchPurities,
    createPurity,
    updatePurity,
    deletePurity,
    fetchPuritiesByMetal,
    fetchPuritiesTable
  };
}
