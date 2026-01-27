import { useState } from "react";
import { Toast } from "../../components/toast/toast";
import { LoginApi } from "./api.login";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (data: any) => {
    try {
      setLoading(true);
      const res = await LoginApi.login(data);
      localStorage.setItem("accessToken", res.data.token);
      const userData = res.data.user
      localStorage.setItem("user", JSON.stringify(userData));
      Toast.show({ message: res.message, type: "success" });
    navigate("/");
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
  };
}
