import { apiService } from "../../services/apiService";

export const paymentApi = {
    getDue: (data: { loanAccountId: string; paymentBasis: string; date?: string }) =>
        apiService.post("/payment/due", data),

    create: (data: any) => apiService.post("/payment", data),

    // Common endpoints
    getRelationships: () => apiService.get("/common/relation"),
    getPaymentBasis: () => apiService.get("/common/paymentbasis"),
    getPaymentModes: () => apiService.get("/common/payment-mode"),
    getPaymentProviders: (mode: string) => apiService.get(`/common/payment-provider/${mode}`),
};
