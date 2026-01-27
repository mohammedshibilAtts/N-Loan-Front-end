import { useState } from "react";
import { loanAccountApi } from "../customer/api.loanAccount";

export function useLoanClosureHook() {
  const [closureData, setLoanClousreData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);



  const fetchTable = async (params?: any) => {
    try {
      setLoading(true);
      const res = await loanAccountApi.closeTable(params);
      setLoanClousreData(res?.data?.data || []);
      return res?.data?.total || 0;
    } finally {
      setLoading(false);
    }
  };

  return {
    closureData,
    loading,
    fetchTable,
  };
}
