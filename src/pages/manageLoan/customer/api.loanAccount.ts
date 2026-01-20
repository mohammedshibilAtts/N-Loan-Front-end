import { apiService } from "../../../services/apiService";

export const loanAccountApi = {
  getAll: () => apiService.get("/loanAccounts"),
  getById: (id: string) => apiService.get(`/loanAccounts/${id}`),
  create: (data: any) => apiService.postFile("/loanAccounts", data),
  close: (data: any) => apiService.postFile("/loanAccounts/close", data),
  findAccByCustomers:(data:{mobile:String,status:Number})=>apiService.get(`/loanAccounts/customer/${data.mobile}/${data.status}`)
};
