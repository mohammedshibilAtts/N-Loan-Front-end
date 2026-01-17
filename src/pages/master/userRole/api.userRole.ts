// src/pages/masters/userRole/api.userRole.ts
import { apiService } from "../../../services/apiService";

export const userRoleApi = {
  getAll: () => apiService.get("common/role"),
};
