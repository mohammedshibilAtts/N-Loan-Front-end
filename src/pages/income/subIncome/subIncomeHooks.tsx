// src/pages/income/subIncome/useSubIncome.ts
import { useState } from "react";
import { subIncomeApi } from "./api.subIncome";
import { Toast } from "../../../components/toast/toast";

export function useSubIncome() {
    const [subIncomes, setSubIncomes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSubIncomes = async () => {
        try {
            setLoading(true);
            const res = await subIncomeApi.getAll();
            setSubIncomes(res.data || []);
        } catch (err: any) {
            Toast.show({
                message: err?.message || "Failed to load sub incomes",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchSubIncomeById = async (id: string) => {
        try {
            const res = await subIncomeApi.getById(id);
            console.log("res ==> ", res);

            return res.data;
        } catch {
            Toast.show({ message: "Failed to fetch sub income", type: "error" });
        }
    };

    const fetchSubIncomeByIncomeId = async (id: string) => {
        try {
            const res = await subIncomeApi.getByIncomeId(id);
            setSubIncomes(res.data);
        } catch {
            Toast.show({ message: "Failed to fetch sub incomes by income", type: "error" });
        }
    };

    const createSubIncome = async (data: any) => {
        const res = await subIncomeApi.create(data);
        Toast.show({ message: res.message, type: "success" });
        fetchSubIncomes();
    };

    const updateSubIncome = async (id: string, data: any) => {
        const res = await subIncomeApi.update(id, data);
        Toast.show({ message: res.message, type: "success" });
        fetchSubIncomes();
    };

    const deleteSubIncome = async (id: string) => {
        const res = await subIncomeApi.delete(id);
        Toast.show({ message: res.message, type: "success" });
        fetchSubIncomes();
    };

    const updateSubIncomeStatus = async (id: string) => {
        try {
            const res = await subIncomeApi.patch(id);
            Toast.show({ message: res?.message, type: "success" });

            if (res?.data) {
                setSubIncomes((prev) =>
                    prev.map((inc) => (inc._id === id ? res.data : inc))
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
            const res = await subIncomeApi.table(params);
            setSubIncomes(res?.data?.data || []);
            return res?.data?.total || 0;
        } finally {
            setLoading(false);
        }
    };

    return {
        subIncomes,
        loading,
        fetchSubIncomeById,
        createSubIncome,
        updateSubIncome,
        deleteSubIncome,
        fetchSubIncomes,
        updateSubIncomeStatus,
        fetchSubIncomeByIncomeId,
        fetchTable,
    };
}
