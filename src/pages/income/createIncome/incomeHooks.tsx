// src/pages/income/useIncome.ts
import { useState } from "react";
import { incomeApi } from "./api.income";
import { Toast } from "../../../components/toast/toast";

export function useIncome() {
    const [incomes, setIncomes] = useState<any[]>([]);
    const [selectedIncome, setSelectedIncome] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const res = await incomeApi.getAll();
            setIncomes(res.data || []);
        } catch (err: any) {
            Toast.show({
                message: err?.message || "Failed to load incomes",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchIncomeById = async (id: string) => {
        try {
            const res = await incomeApi.getById(id);
            setSelectedIncome(res.data);
            return res.data;
        } catch {
            Toast.show({ message: "Failed to fetch income", type: "error" });
        }
    };

    const createIncome = async (data: any) => {
        await incomeApi.create(data);
        Toast.show({ message: "Income created", type: "success" });
        fetchIncomes();
    };

    const updateIncome = async (id: string, data: any) => {
        await incomeApi.update(id, data);
        Toast.show({ message: "Income updated", type: "success" });
        fetchIncomes();
    };

    const deleteIncome = async (id: string) => {
        await incomeApi.delete(id);
        Toast.show({ message: "Income deleted", type: "success" });
        fetchIncomes();
    };


    const updateIncomeStatus = async (id: string) => {

        try {
            const res = await incomeApi.patch(id);
            Toast.show({ message: res?.message, type: "success" });


            if (res?.data) {
                setIncomes((prev) =>
                    prev.map((inc) =>
                        inc._id === id ? res.data : inc
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
            const res = await incomeApi.table(params);
            setIncomes(res?.data?.data || []);
            return res?.data?.total || 0;
        } finally {
            setLoading(false);
        }
    };


    return {
        incomes,
        selectedIncome,
        loading,
        fetchIncomes,
        fetchIncomeById,
        createIncome,
        updateIncome,
        deleteIncome,
        setSelectedIncome,
        updateIncomeStatus,
        fetchTable
    };
}
