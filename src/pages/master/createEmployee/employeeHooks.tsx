import { useState } from "react";
import { employeeApi } from "./api.employee";
import { Toast } from "../../../components/toast/toast";

export function useEmployee() {
  /* ---------- STATE ---------- */
  const [employees, setEmployees] = useState<any[]>([]);
const [employeeData, setEmployeeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH ALL ---------- */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeApi.getAll();
      setEmployees(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FETCH BY ID ---------- */
  const fetchEmployeeById = async (id: string) => {
    try {
      setLoading(true);
      const res = await employeeApi.getById(id);
      setEmployeeData(res.data);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CREATE ---------- */
  const createEmployee = async (data: any): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeApi.create(data);
      Toast.show({
        message: "Employee created successfully",
        type: "success",
      });
      fetchEmployees();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UPDATE ---------- */
  const updateEmployee = async (
    id: string,
    data: any
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeApi.update(id, data);
      Toast.show({
        message: "Employee updated successfully",
        type: "success",
      });
      fetchEmployees();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeApi.delete(id);
      Toast.show({
        message: "Employee deleted successfully",
        type: "success",
      });
      fetchEmployees();
      return true;
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

     const fetchTable = async (params: any) => {
      try {
        setLoading(true);
        const res = await employeeApi.table(params);
        setEmployees(res?.data?.data || []);
        return res?.data?.total || 0;
      } finally {
        setLoading(false);
      }
    };
    

  /* ---------- EXPORT ---------- */
  return {
    /* data */
    employees,
    employeeData,

    /* state */
    loading,

    /* actions */
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchTable
  };
}
