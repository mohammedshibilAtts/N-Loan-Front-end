import { useState } from "react";
import { branchApi } from "./api.branch";
import { Toast } from "../../../components/toast/toast";

export function useBranch() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await branchApi.getAll();
      setBranches(res.data || []);
    } catch (err: any) {
      Toast.show({ message: "Failed to load branches", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchById = async (id: string) => {
    const res = await branchApi.getById(id);
    setSelectedBranch(res.data);
    return res.data;
  };

  const createBranch = async (data: any) => {
    const res = await branchApi.create(data);
    Toast.show({ message: res.message, type: "success" });
    fetchBranches();
  };

  const updateBranch = async (id: string, data: any) => {
    const res = await branchApi.update(id, data);
    Toast.show({ message: res.message, type: "success" });
    fetchBranches();
  };

  const deleteBranch = async (id: string) => {
    const res = await branchApi.delete(id);
    Toast.show({ message: res.message, type: "success" });
    fetchBranches();
  };

  return {
    branches,
    loading,
    selectedBranch,
    setSelectedBranch,
    fetchBranches,
    fetchBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
  };
}
