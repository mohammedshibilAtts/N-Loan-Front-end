import { apiService } from "../../../services/apiService";

export const interestPaymentApi = {
    getDue: (data: { loanAccountId: string; paymentBasis: string }) =>
        apiService.post("/payment/due", data),

    create: (data: any) => apiService.post("/payment", data),
    table: (data: any) => apiService.post("/payment/table", data),

    // Assuming these common endpoints exist or will exist consistent with other modules
    getRelationships: () => apiService.get("/common/relation"),
    getPaymentBasis: () => apiService.get("/common/paymentbasis"),
};
