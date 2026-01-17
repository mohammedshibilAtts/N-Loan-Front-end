import { useState } from "react";
import { genderApi } from "../../services/api.common";
import { Toast } from "../../components/toast/toast";

export function useGender() {
  const [genders, setGenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGender = async () => {
    try {
      setLoading(true);
      const res = await genderApi.getAll();
      setGenders(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return { genders, loading,fetchGender };
}
