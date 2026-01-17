// src/common/hooks/useLocationMaster.ts
import { useState } from "react";
import { countryApi, stateApi, cityApi } from "../../services/api.common";
import { Toast } from "../../components/toast/toast";

interface Option {
  _id: string;
  name: string;
}
interface CityOption {
  _id: string;
  city_name: string;
}
interface StateOption {
  _id: string;
  state_name: string;
}

export function useLocationMaster() {
  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------- COUNTRY ---------- */
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await countryApi.getAll();
      setCountries(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- STATE ---------- */
  const fetchStates = async (countryId: string) => {
    if (!countryId) return;
    try {
      setLoading(true);
      const res = await stateApi.getByCountry(countryId);
      setStates(res.data || []);
      setCities([]); // reset cities
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStates = async () => {
    try {
      setLoading(true);
      const res = await stateApi.getAll();
      setStates(res.data || []);
      setCities([]); // reset cities
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CITY ---------- */
  const fetchCities = async (stateId: string) => {
    if (!stateId) return;
    try {
      setLoading(true);
      const res = await cityApi.getByState(stateId);
      setCities(res.data || []);
    } catch (err: any) {
      Toast.show({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESET ---------- */
  const resetStates = () => {
    setStates([]);
    setCities([]);
  };

  const resetCities = () => {
    setCities([]);
  };

  return {
    countries,
    states,
    cities,
    loading,

    fetchAllStates,

    fetchCountries,
    fetchStates,
    fetchCities,

    resetStates,
    resetCities,
  };
}
