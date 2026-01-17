import { useState } from "react";
import { loanAccountApi } from "./api.loanAccount";
import { Toast } from "../../../components/toast/toast";
import { useNavigate } from "react-router-dom";

export function useLoanAccount() {
  /* ---------- STATE ---------- */
  const [loans, setLoans] = useState<any[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  /* ---------- GET ALL LOANS ---------- */
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await loanAccountApi.getAll();
      setLoans(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to fetch loans",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GET LOAN BY ID ---------- */
  const fetchLoanById = async (id: string) => {
    try {
      setLoading(true);
      const res = await loanAccountApi.getById(id);
      setSelectedLoan(res.data || null);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to fetch loan",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CREATE LOAN ---------- */
  const createLoanAccount = async (data: FormData): Promise<boolean> => {
    try {
      setLoading(true);
      await loanAccountApi.create(data);

      Toast.show({
        message: "Loan created successfully",
        type: "success",
      });

      navigate("/masters/loans");
      return true;
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to create loan",
        type: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };


  /* ---------- EXPORT ---------- */
  return {
    /* state */
    loans,
    selectedLoan,
    loading,

    /* actions */
    fetchLoans,
    fetchLoanById,
    createLoanAccount,
    
  };
}
