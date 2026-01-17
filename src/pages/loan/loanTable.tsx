import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { CONFIG } from "../../config-global";
import { DashboardContent } from "../../layouts/dashboard";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Iconify } from "../../components/iconify";
import { Breadcrumb } from "../../components/breadCrumbComp";
import { useNavigate } from "react-router-dom";

import { useLoan } from "./loanHooks";
import SubTable from "../../components/subTable/subTable";
import { useTableFilters } from "../../hooks/commonhooks/tableFilterHooks";
import { useTablePagination } from "../../hooks/commonhooks/paginationHooks";
import { formatDateTime } from "../../utils/dateFormate";
import FilterBar from "../../components/filterLayout/filterLayout";
import FilterItem from "../../components/filterLayout/filterItem";
import Search from "../../components/search/search";

export default function LoanTable() {
  const navigate = useNavigate();
  const { loans, fetchTable, loading } = useLoan();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters } = useTableFilters();

  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search, filters]);

  // Fetch data
  useEffect(() => {
    fetchTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
      filters,
    }).then(setTotalCount);
  }, [page, rowsPerPage, search, filters]);

  const handleView = async (row: any) => {
    navigate(`/masters/view-loan/${row._id}`);
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "loanCode", label: "Loan Code" },
    { id: "loanName", label: "Loan Name" },
    { id: "maturityPeriod", label: "Maturity Period" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = loans.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    loanCode: item.loanCode,
    loanName: item.loanName,
    maturityPeriod: item.maturityPeriod,
    createdAt: formatDateTime(item.createdAt),
  }));
  return (
    <>
      <Helmet>
        <title>{`Loan Creation - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h4" flexGrow={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Breadcrumb
                items={[
                  { label: "Masters" },
                  { label: "Loan Creation", active: true },
                ]}
              />
            </Stack>
          </Typography>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/masters/loancreate")}
          >
            Create Loan
          </Button>
        </Box>

        <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
          <FilterBar
            rows={[
              <Box display="flex" gap={1} flexWrap="wrap">
                <FilterItem>
                  <Search onSearch={(v) => setSearch(v)} loading={loading} />
                </FilterItem>
                
              </Box>,
            ]}
          />
          <SubTable
            coloums={columns}
            data={tableData}
            loading={loading}
            onView={handleView}
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>
      </DashboardContent>
    </>
  );
}
