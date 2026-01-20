import { apiService } from "../../../services/apiService";

export const principalApi = {
    // Fetch all interest types for the dropdown
    getInterestTypes: () => apiService.post("/master/get-table", {
        procedureName: "findAll",
        params: { tableName: "Interest" }
    }),

    // Submit the principal adjustment
    create: (data: any) => apiService.post("/payment/principal-adjustment", data),
};
