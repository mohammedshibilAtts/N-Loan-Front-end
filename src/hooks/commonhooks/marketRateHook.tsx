import { useState } from "react";
import { marketRateApi } from "../../services/api.common";
import { Toast } from "../../components/toast/toast";

export function useMarketRate() {
  const [marketRates, setMarketRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMarketRates = async () => {
    try {
      setLoading(true);
      const res = await marketRateApi.getAll();
      setMarketRates(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return { marketRates, loading,fetchMarketRates };
}
