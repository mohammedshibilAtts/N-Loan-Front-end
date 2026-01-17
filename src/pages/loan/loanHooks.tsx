import { useState } from "react";
import { loanApi } from "./api.loan";
import { Toast } from "../../components/toast/toast";
import { useNavigate } from "react-router-dom";

export function useLoan() {
  /* ---------- STATE ---------- */
  const [loans, setLoans] = useState<any[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  /* ---------- GET ALL ---------- */
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await loanApi.getAll();
      setLoans(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GET BY ID ---------- */
  const fetchLoanById = async (id: string) => {
    try {
      setLoading(true);
      const res = await loanApi.getById(id);
      setSelectedLoan(res.data);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CREATE ---------- */
  const createLoan = async (data: any): Promise<boolean> => {
    try {
      setLoading(true);
      await loanApi.create(data);
      Toast.show({ message: "Loan created successfully", type: "success" });
      navigate('/masters/loans')
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchTable = async (params: any) => {
      try {
        setLoading(true);
        const res = await loanApi.table(params);
        setLoans(res?.data?.data || []);
        return res?.data?.total || 0;
      } finally {
        setLoading(false);
      }
    };

 
  /* ---------- EXPORT ---------- */
  return {
    loans,
    selectedLoan,
    loading,

    fetchTable,
    fetchLoans,
    fetchLoanById,
    createLoan,
  };
}
