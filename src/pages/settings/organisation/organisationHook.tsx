import { useState } from "react";

import { Toast } from "../../../components/toast/toast";
import { organisationApi } from "./api.organisation";

export function useOrganisation() {
  /* ---------- STATE ---------- */
  const [organisationData, setOrganisationData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  /* ---------- FIND BY ID ---------- */
  const find = async () => {
    try {
      setLoading(true);
      const res = await organisationApi.find();
      setOrganisationData(res.data);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CREATE ---------- */
  const create = async (data: any) => {
    try {
      setLoading(true);
      let res = await organisationApi.create(data);
      Toast.show({ message: res.message, type: "success" });
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return {
    /* data */

    organisationData,

    /* state */
    loading,

    /* actions */

    find,
    create,
  };
}
