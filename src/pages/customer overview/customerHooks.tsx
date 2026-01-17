import { useState } from "react";
import { customerApi } from "./api.customer";
import { Toast } from "../../components/toast/toast";

export function useCustomer() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- LIST ---------- */
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getAll();
      setCustomers(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GET BY ID ---------- */
  const fetchCustomerById = async (id: string) => {
    try {
      setLoading(true);
      const res = await customerApi.getById(id);
      setSelectedCustomer(res.data);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GET BY ID ---------- */
  const fetchCustomerBysearch = async (data: any) => {
    try {
      setLoading(true);
      const res = await customerApi.search(data);
      if (res.data.length < 1) {
          Toast.show({ message: "Customer Not Found ", type: "error" });
          return false;
        } else {
        Toast.show({ message: "Customer Found Successfuly", type: "success" });
        return res.data[0];
      }
      
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CREATE ---------- */
  const createCustomer = async (data: any): Promise<boolean> => {
    try {
      setLoading(true);
      await customerApi.create(data);
      Toast.show({ message: "Customer created successfully", type: "success" });
      fetchCustomers();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UPDATE ---------- */
  const updateCustomer = async (id: string, data: any): Promise<boolean> => {
    try {
      setLoading(true);
      await customerApi.update(id, data);
      Toast.show({ message: "Customer updated successfully", type: "success" });
      fetchCustomers();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await customerApi.delete(id);
      Toast.show({ message: "Customer deleted successfully", type: "success" });
      fetchCustomers();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    selectedCustomer,
    loading,
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchCustomerBysearch,
  };
}
