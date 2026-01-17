// src/pages/masters/locality/localityhooks.ts
import { useState } from "react";
import { localityApi } from "./api.locality";
import { Toast } from "../../../components/toast/toast";

export function useLocality() {
  const [localities, setLocalities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<any>(null);

  /* -------- FETCH ALL -------- */
  const fetchLocalities = async () => {
    try {
      setLoading(true);
      const res = await localityApi.getAll();
      setLocalities(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load localities",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------- FETCH BY ID -------- */
  const fetchLocalityById = async (id: string) => {
    try {
      setLoading(true);
      const res = await localityApi.getById(id);
      setSelectedLocality(res.data);
      return res.data;
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load locality",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------- CREATE -------- */
  const createLocality = async (data: any) => {
    const res = await localityApi.create(data);
    Toast.show({ message: res?.message, type: "success" });
    fetchLocalities();
  };

  /* -------- UPDATE -------- */
  const updateLocality = async (id: string, data: any) => {
    const res = await localityApi.update(id, data);
    Toast.show({ message: res?.message, type: "success" });
    fetchLocalities();
  };

  /* -------- DELETE -------- */
  const deleteLocality = async (id: string) => {
    const res = await localityApi.delete(id);
    Toast.show({ message: res?.message, type: "success" });
    fetchLocalities();
  };


   const fetchTable = async (params?: any) => {
      try {
        setLoading(true);
        const res = await localityApi.table(params);
        setLocalities(res?.data?.data || []);
        return res?.data?.total || 0;
      } finally {
        setLoading(false);
      }
    };


  return {
    localities,
    loading,
    selectedLocality,
    setSelectedLocality,
    fetchLocalities,
    fetchLocalityById,
    createLocality,
    updateLocality,
    deleteLocality,
    fetchTable
  };
}
