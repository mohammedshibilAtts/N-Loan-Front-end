// src/pages/expense/subExpense/useSubExpense.ts
import { useState } from "react";
import { subExpenseApi } from "./api.subexpense";
import { Toast } from "../../../components/toast/toast";

export function useSubExpense() {
  const [subExpenses, setSubExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubExpenses = async () => {
    try {
      setLoading(true);
      const res = await subExpenseApi.getAll();
      setSubExpenses(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load sub expenses",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubExpenseById = async (id: string) => {
    const res = await subExpenseApi.getById(id);
    return res.data;
  };

  const fetchSubExpenseByExpenseId = async (id: string) => {
    const res = await subExpenseApi.getByExpenseId(id);
    setSubExpenses(res.data);
  };

  const createSubExpense = async (data: any) => {
    const res = await subExpenseApi.create(data);
    Toast.show({ message: res.message, type: "success" });
    fetchSubExpenses();
  };

  const updateSubExpense = async (id: string, data: any) => {
    const res = await subExpenseApi.update(id, data);
    Toast.show({ message: res.message, type: "success" });
    fetchSubExpenses();
  };

  const deleteSubExpense = async (id: string) => {
    const res = await subExpenseApi.delete(id);
    Toast.show({ message: res.message, type: "success" });
    fetchSubExpenses();
  };

  const updateSubExpenseStatus = async (id: string) => {
    try {
      const res = await subExpenseApi.patch(id);
      Toast.show({ message: res?.message, type: "success" });

      if (res?.data) {
        setSubExpenses((prev) =>
          prev.map((exp) => (exp._id === id ? res.data : exp))
        );
      }
    } catch (error) {
      Toast.show({ message: "Failed to update status", type: "error" });
      console.error(error);
    }
  };

  const fetchTable = async (params?: any) => {
    try {
      setLoading(true);
      const res = await subExpenseApi.table(params);
      setSubExpenses(res?.data?.data || []);
      return res?.data?.total || 0;
    } finally {
      setLoading(false);
    }
  };

  return {
    subExpenses,
    loading,
    fetchSubExpenseById,
    createSubExpense,
    updateSubExpense,
    deleteSubExpense,
    fetchSubExpenses,
    updateSubExpenseStatus,
    fetchSubExpenseByExpenseId,
    fetchTable,
  };
}
