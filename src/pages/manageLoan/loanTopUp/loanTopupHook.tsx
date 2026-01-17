import { useState } from "react";
import { topUpApi } from "./api.loanTopup";
import { Toast } from "../../../components/toast/toast";
import { useNavigate } from "react-router-dom";

export function useLoanTopUpHook() {
  const [topUpData, setTopUpData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const createTopup = async (data: any) => {
    const res = await topUpApi.create(data);
    Toast.show({ message: res.message, type: "success" });
    navigate("/manageloan/topup-history");
  };

  const fetchTable = async (params?: any) => {
    try {
      setLoading(true);
      const res = await topUpApi.table(params);
      setTopUpData(res?.data?.data || []);
      return res?.data?.total || 0;
    } finally {
      setLoading(false);
    }
  };

  return {
    topUpData,
    loading,
    createTopup,
    fetchTable,
  };
}
