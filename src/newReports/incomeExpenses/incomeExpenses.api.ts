import { apiService } from "../../services/apiService";

export const incomeExpensesApi = {
    getIncomeExpenseReport: (data: any) =>
        apiService.post("/reports/incomeExpenseReport", data),
};
