// src/modules/notification/api.notification.ts
import { apiService } from "../../../services/apiService";

export const notificationApi = {
  getConfig: () => apiService.get("notification"),
  saveConfig: (data: any) => apiService.put("notification", data),
};
