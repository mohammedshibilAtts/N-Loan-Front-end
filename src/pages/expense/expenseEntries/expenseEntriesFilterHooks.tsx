import { useEffect, useState } from "react";
import { apiService } from "../../../services/apiService";

export function useExpenseFilters() {
  const [branches, setBranches] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [subExpenses, setSubExpenses] = useState<any[]>([]);
  const [paymentModes, setPaymentModes] = useState<any[]>([]);

  useEffect(() => {
    apiService.get("branches").then(r => setBranches(r.data || []));
    apiService.get("expenses").then(r => setExpenses(r.data || []));
    apiService.get("sub-expenses").then(r => setSubExpenses(r.data || []));
    apiService.get("payment-modes").then(r => setPaymentModes(r.data || []));
  }, []);

  return {
    branches,
    expenses,
    subExpenses,
    paymentModes,
  };
}
