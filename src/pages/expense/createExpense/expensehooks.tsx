// src/pages/expense/useExpense.ts
import { useState } from "react";
import { expenseApi } from "./api.expense";
import { Toast } from "../../../components/toast/toast";

export function useExpense() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseApi.getAll();
      setExpenses(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load expenses",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseById = async (id: string) => {
    try {
      const res = await expenseApi.getById(id);
      setSelectedExpense(res.data);
      return res.data;
    } catch {
      Toast.show({ message: "Failed to fetch expense", type: "error" });
    }
  };

  const createExpense = async (data: any) => {
    await expenseApi.create(data);
    Toast.show({ message: "Expense created", type: "success" });
    fetchExpenses();
  };

  const updateExpense = async (id: string, data: any) => {
    await expenseApi.update(id, data);
    Toast.show({ message: "Expense updated", type: "success" });
    fetchExpenses();
  };

  const deleteExpense = async (id: string) => {
    await expenseApi.delete(id);
    Toast.show({ message: "Expense deleted", type: "success" });
    fetchExpenses();
  };


   const updateExpenseStatus = async (id: string) => {
    
    try {
      const res = await expenseApi.patch(id);
      Toast.show({ message: res?.message, type: "success" });
      
      
      if (res?.data) {
        setExpenses((prev) =>
          prev.map((exp) =>
            exp._id === id ? res.data : exp
          )
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
          const res = await expenseApi.table(params);
          setExpenses(res?.data?.data || []);
          return res?.data?.total || 0;
        } finally {
          setLoading(false);
        }
      };


  return {
    expenses,
    selectedExpense,
    loading,
    fetchExpenses,
    fetchExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    setSelectedExpense,
    updateExpenseStatus,
    fetchTable
  };
}
