// src/pages/masters/userRole/useUserRole.ts
import { useState } from "react";
import { userRoleApi } from "./api.userRole";
import { Toast } from "../../../components/toast/toast";

export function useUserRole() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const res = await userRoleApi.getAll();
      setRoles(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load user roles",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  

  return {
    roles,
    loading,
    fetchUserRoles,
  };
}
