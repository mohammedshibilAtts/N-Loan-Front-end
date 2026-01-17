import { useEffect, useState } from "react";
import { notificationApi } from "./api.notification";
import { Toast } from "../../../components/toast/toast";

export function useNotificationConfig() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH ---------- */
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getConfig();
      setChannels(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SAVE ---------- */
  const saveConfig = async (payload: any) => {
    try {
      setLoading(true);
      await notificationApi.saveConfig(payload);
      Toast.show({ message: "Notification settings saved", type: "success" });
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    channels,
    setChannels,
    loading,
    saveConfig,
  };
}
