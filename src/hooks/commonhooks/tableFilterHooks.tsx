import { useState } from "react";

export function useTableFilters<T extends object = any>(initialFilters?: T) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<T>(initialFilters || ({} as T));

  const resetFilters = () => {
    setSearch("");
    setFilters(initialFilters || ({} as T));
  };

  return {
    search,
    setSearch,
    filters,
    setFilters,
    resetFilters,
  };
}
