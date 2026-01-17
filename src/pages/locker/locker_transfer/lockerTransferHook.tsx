import { useState } from "react";
import { lockerTransferApi } from "./api.lockerTransfer";
import { Toast } from "../../../components/toast/toast";

export function useLockerTransfer() {
  const [itemData, setItemData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const findItemByTag = async (
    tagNo: string,
    branchId: string,
    handleItem: any,
    handleTagId: any,
    hanldeClear:any
  ) => {
    try {
      setLoading(true);
      const res = await lockerTransferApi.getByTagNo(tagNo, branchId);
      setItemData(res.data || []);
      handleTagId(tagNo);
      handleItem(res.data);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to get item details",
        type: "error",
      });
      hanldeClear()
    } finally {
      setLoading(false);
    }
  };

  const lockerTransfer = async (data: any) => {
    try {
      setLoading(true);
      const res = await lockerTransferApi.update(data);
      Toast.show({
        message: res?.message,
        type: "success",
      });
      return true
    } catch (error: any) {
      Toast.show({
        message: error?.message || "Failed to transfer the locker",
        type: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    itemData,
    loading,
    findItemByTag,
    lockerTransfer,
  };
}
