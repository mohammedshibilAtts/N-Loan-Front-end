import { useState } from "react";
import { metalApi } from "./api.metal";
import { Toast } from "../../../components/toast/toast";

export function useMetal() {
  const [metals, setMetals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
    
  const fetchMetals = async () => {
    try {
      setLoading(true);
      const res = await metalApi.getAll();
      setMetals(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load metals",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMetal = async (data: any) => {
    try {
      const res = await metalApi.create(data);
      Toast.show({
        message: res?.message,
        type: "success",
      });
      fetchMetals();
    } catch (err: any) {
        console.log(err)
      Toast.show({
        message: err?.message,
        type: "error",
      });
      throw err;
    }
  };

  const updateMetal = async (id: string, data: any) => {
    try {
      const res = await metalApi.update(id, data);
      Toast.show({
        message: res?.message,
        type: "success",
      });
      fetchMetals();
    } catch (err: any) {
      Toast.show({
        message: err?.message,
        type: "error",
      });
      throw err;
    }
  };

  const deleteMetal = async (id: string) => {
    try {
      const res = await metalApi.delete(id);
      Toast.show({
        message: res?.message,
        type: "success",
      });
      fetchMetals();
    } catch (err: any) {
      Toast.show({
        message: err?.message,
        type: "error",
      });
      throw err;
    }
  };


  
    const fetchMetalTable = async (params: any) => {
    try {
      setLoading(true);
      const res = await metalApi.table(params);
      setMetals(res?.data?.data || []);
      return res?.data?.total || 0;
    } finally {
      setLoading(false);
    }
  };


  

  return {
    metals,
    loading,
    fetchMetals,
    createMetal,
    updateMetal,
    deleteMetal,
    fetchMetalTable
  };
}
