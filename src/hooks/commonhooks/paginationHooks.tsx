import { useState } from "react";

export function useTablePagination(initialRows = 10) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRows);
  const [totalCount, setTotalCount] = useState(0);

  const onPageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  };
}
