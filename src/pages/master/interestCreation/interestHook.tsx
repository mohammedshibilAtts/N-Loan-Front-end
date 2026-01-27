import { useEffect, useState } from "react";
import { interestApi } from "./api.interest";
import { Toast } from "../../../components/toast/toast";

export function useInterest() {
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const res = await interestApi.getAll();
      setInterests(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const createInterest = async (data: any) => {
    try {
      await interestApi.create(data);
      Toast.show({ message: "Interest created", type: "success" });
      fetchInterests();
      return true
    } catch (error: any) {
      Toast.show({ message: error.message, type: "error" });
      return false
    }
  };

  const updateInterest = async (id: string, data: any) => {
    try {
      await interestApi.update(id, data);
      Toast.show({ message: "Interest updated", type: "success" });
      fetchInterests();
      return true
    } catch (error: any) {
      Toast.show({ message: error.message, type: "error" });
      return false
    }
  };

  const deleteInterest = async (id: string) => {
    await interestApi.delete(id);
    Toast.show({ message: "Interest deleted", type: "success" });
    fetchInterests();
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  return {
    interests,
    loading,
    fetchInterests,
    createInterest,
    updateInterest,
    deleteInterest,
  };
}
