import { useState } from "react";
import { martialStatus } from "../../services/api.common";
import { Toast } from "../../components/toast/toast";

export function useMartialStatus() {
  const [martialData, setmartialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMartialStatus = async () => {
    try {
      setLoading(true);
      const res = await martialStatus.getAll();
      setmartialData(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return { martialData, loading,fetchMartialStatus };
}
