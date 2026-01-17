    import { useEffect, useState } from "react";
import { Toast } from "../../components/toast/toast";
import { paymentModeApi, paymentProviderApi } from "../../services/api.common";

/* ---------- TYPES ---------- */
export type Option = {
  label: string;
  value: string;
};

export function usePaymentMethod() {
  /* ---------- STATE ---------- */
  const [paymentModes, setPaymentModes] = useState<Option[]>([]);
  const [paymentProviders, setPaymentProviders] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH PAYMENT MODES ---------- */
  const fetchPaymentModes = async () => {
    try {
      setLoading(true);

      const res = await paymentModeApi.getAll();

      setPaymentModes(
        (res?.data || []).map((item: any) => ({
          label: item.mode,
          value: item._id,
        }))
      );
    } catch (error: any) {
      Toast.show({
        message: error?.message || "Failed to load payment modes",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FETCH PAYMENT PROVIDERS (CASCADE) ---------- */
  const fetchPaymentProviders = async (paymentModeId?: string) => {
    if (!paymentModeId) {
      setPaymentProviders([]);
      return;
    }

    try {
      setLoading(true);

      const res = await paymentProviderApi.getByPaymentMode(paymentModeId);

      setPaymentProviders(
        (res?.data || []).map((item: any) => ({
          label: item.providerName,
          value: item._id,
        }))
      );
    } catch (error: any) {
      Toast.show({
        message: error?.message || "Failed to load payment providers",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchPaymentModes();
  }, []);

  /* ---------- EXPORT ---------- */
  return {
    /* data */
    paymentModes,
    paymentProviders,

    /* state */
    loading,

    /* actions */
    fetchPaymentProviders,
  };
}
