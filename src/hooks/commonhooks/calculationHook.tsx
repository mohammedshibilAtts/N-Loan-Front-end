import { useState } from "react";
import { calculationTypes } from "../../services/api.common";
import { Toast } from "../../components/toast/toast";

export function useCalculationTypes() {
  const [calculationTypeData, setCalculationTypeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalculationType = async () => {
    try {
      setLoading(true);
      const res = await calculationTypes.getAll();
      setCalculationTypeData(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return { calculationTypeData, loading,fetchCalculationType };
}
