import { useState } from "react";
import { lockerApi, Locker, LockerPayload } from "./api.locker";
import { Toast } from "../../../components/toast/toast";

export function useLocker() {
  /* ---------- STATE ---------- */
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [lockerData, setLockerData] = useState<Locker | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ---------- GET ALL ---------- */
  const fetchLockers = async () => {
    try {
      setLoading(true);
      const res = await lockerApi.getAll();
      setLockers(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FIND BY ID ---------- */
  const fetchLockerById = async (id: string) => {
    try {
      setLoading(true);
      const res = await lockerApi.getById(id);
      setLockerData(res.data);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CREATE ---------- */
  const createLocker = async (data: LockerPayload): Promise<boolean> => {
    try {
      setLoading(true);
      await lockerApi.create(data); // ✅ FIXED
      Toast.show({ message: "Locker created successfully", type: "success" });
      fetchLockers();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UPDATE ---------- */
  const updateLocker = async (
    id: string,
    data: LockerPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await lockerApi.update(id, data);
      Toast.show({ message: "Locker updated successfully", type: "success" });
      fetchLockers();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteLocker = async (id: string) => {
    try {
      await lockerApi.delete(id);
      Toast.show({ message: "Locker deleted successfully", type: "success" });
      fetchLockers();
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    }
  };



  return {
    /* data */
    lockers,
    lockerData,

    /* state */
    loading,

    /* actions */
    fetchLockers,
    fetchLockerById,
    createLocker,   
    updateLocker,   
    deleteLocker,
  };
}
