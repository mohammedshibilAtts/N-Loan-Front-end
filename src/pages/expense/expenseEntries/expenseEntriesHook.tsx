import { useState } from "react";
import { expenseEntriesApi } from "./api.expenseEntries";
import { Toast } from "../../../components/toast/toast";

export function useExpenseEntries() {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await expenseEntriesApi.getAll();
      setEntries(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (id: string) => {
    try {
      setLoading(true);
      const res = await expenseEntriesApi.getById(id);
      setSelectedEntry(res.data);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (data: any): Promise<boolean> => {
    try {
      setLoading(true);
      await expenseEntriesApi.create(data);
      Toast.show({ message: "Expense entry created", type: "success" });
      fetchEntries();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: string, data: any): Promise<boolean> => {
    try {
      setLoading(true);
      await expenseEntriesApi.update(id, data);
      Toast.show({ message: "Expense entry updated", type: "success" });
      fetchEntries();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setLoading(true);
      await expenseEntriesApi.delete(id);
      Toast.show({ message: "Expense entry deleted", type: "success" });
      fetchEntries();
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

      const fetchTable = async (params: any) => {
      try {
        setLoading(true);
        const res = await expenseEntriesApi.table(params);
        setEntries(res?.data?.data || []);
        return res?.data?.total || 0;
      } finally {
        setLoading(false);
      }
    };

  return {
    entries,
    selectedEntry,
    loading,
    fetchEntries,
    fetchById,
    createEntry,
    updateEntry,
    deleteEntry,
    setSelectedEntry,
    fetchTable
  };
}
