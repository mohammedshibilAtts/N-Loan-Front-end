import { useState } from "react";
import { closedTypes } from "../../services/api.common";
import { Toast } from "../../components/toast/toast";

export function useCloseType() {
  const [closedType, setClosedType] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const GetClosedTypes = async () => {
    try {
      setLoading(true);
      const res = await closedTypes.getAll();
      setClosedType(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return { closedType, loading,GetClosedTypes };
}
