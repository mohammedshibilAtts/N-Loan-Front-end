import { apiService } from "../../services/apiService";

export const LoginApi = {
  login: (data:{userName:string,password:string}) => apiService.post("/login",data),
};