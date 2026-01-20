import { useState } from "react";
import { metalRateApi } from "./api.metalRate";
import { Toast } from "../../../components/toast/toast";

export function useMetalRate() {
  const [metalRates, setMetalRates] = useState<any[]>([]);
  const [selectedMetalRate,setSelectedMetalRate]=useState({})
  const [loading, setLoading] = useState(false);

  const fetchMetalRates = async (data: any) => {
    try {
      setLoading(true);
      const res = await metalRateApi.getMetalRate(data);
      setMetalRates(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load metal rates",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMetalRates = async (data: any,branchId:string) => {
    try {
      setLoading(true);
      const res = await metalRateApi.updateRate(data);
      Toast.show({
        message: res?.message || "Metal rates updated",
        type: "success",
      });
      fetchMetalRates({branchId});
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to update metal rates",
        type: "error",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getRateByPurity = async (branchId:string,metalId:string,puirtyNo:Number) => {
    try {
      setLoading(true);
      const res = await metalRateApi.getRateByPurity(branchId,metalId,puirtyNo);
      console.log(res)
      setSelectedMetalRate(res.data.rate)
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to get metal rates",
        type: "error",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  

  return {
    metalRates,
    loading,
    fetchMetalRates,
    updateMetalRates,
    getRateByPurity,
    selectedMetalRate
  };
}
