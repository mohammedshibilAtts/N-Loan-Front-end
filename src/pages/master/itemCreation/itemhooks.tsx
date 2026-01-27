// src/pages/masters/item/useItem.ts
import { useState } from "react";
import { itemApi } from "./api.items";
import { Toast } from "../../../components/toast/toast";

export function useItem() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [tableParams,SetTableParams]=useState()

  const fetchItems = async (query?: any) => {
    try {
      setLoading(true);
      const res = await itemApi.getAll(query);
      setItems(res.data || []);
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to load items",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (data: any) => {
    const res = await itemApi.create(data);
    Toast.show({ message: res.message, type: "success" });
    fetchTable(tableParams)
  };

  const updateItem = async (id: string, data: any) => {
    const res = await itemApi.update(id, data);
    Toast.show({ message: res.message, type: "success" });
    fetchTable(tableParams)
  };

  const deleteItem = async (id: string) => {
    const res = await itemApi.delete(id);
    Toast.show({ message: res.message, type: "success" });
    fetchTable(tableParams)
  };

  const fetchItemById = async (id: string) => {
    try {
      setLoading(true);
      const res = await itemApi.getById(id);
      setSelectedItem(res.data);
      return res.data;
    } catch (err: any) {
      Toast.show({
        message: err?.message || "Failed to fetch item",
        type: "error",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItemStaus = async (id: string) => {
    try {
      const res = await itemApi.patch(id);
      Toast.show({ message: res?.message, type: "success" });

      if (res?.data) {
        fetchTable();
      }
    } catch (error) {
      Toast.show({ message: "Failed to update status", type: "error" });
      console.error(error);
    }
  };

  const fetchTable = async (params?: any) => {
    try {
      SetTableParams(params)
      setLoading(true);
      const res = await itemApi.table(params);
      setItems(res?.data?.data || []);
      return res?.data?.total || 0;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setSelectedItem,
    fetchItemById,
    selectedItem,
    updateItemStaus,
    fetchTable,
  };
}
