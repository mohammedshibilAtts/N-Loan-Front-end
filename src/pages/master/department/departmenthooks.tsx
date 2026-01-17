// src/pages/masters/department/useDepartment.ts
import { useState } from "react";
import { departmentApi } from "./api.department";
import { Toast } from "../../../components/toast/toast";

export function useDepartment() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentApi.getAll();
      setDepartments(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load departments",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (data: any) => {
    const res = await departmentApi.create(data);
    Toast.show({ message: res?.message, type: "success" });
    fetchDepartments();
  };

  const updateDepartment = async (id: string, data: any) => {
    const res = await departmentApi.update(id, data);
    Toast.show({ message: res?.message, type: "success" });
    fetchDepartments();
  };

  const deleteDepartment = async (id: string) => {
    const res = await departmentApi.delete(id);
    Toast.show({ message: res?.message, type: "success" });
    fetchDepartments();
  };

 const updateDepartmentStatus = async (id: string) => {
  
  try {
    const res = await departmentApi.patch(id);
    Toast.show({ message: res?.message, type: "success" });
    
    
    if (res?.data) {
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept._id === id ? res.data : dept
        )
      );
    }
  } catch (error) {
    Toast.show({ message: "Failed to update status", type: "error" });
    console.error(error);
  }
};


    const fetchDepartmentTable = async (params: any) => {
    try {
      setLoading(true);
      const res = await departmentApi.table(params);
      setDepartments(res?.data?.data || []);
      return res?.data?.total || 0;
    } finally {
      setLoading(false);
    }
  };
  

  return {
    departments,
    loading,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateDepartmentStatus,
    fetchDepartmentTable
  };
}
