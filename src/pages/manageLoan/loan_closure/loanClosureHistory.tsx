import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { formatDateTime } from "../../../utils/dateFormate";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { useEffect } from "react";
import { useLoanClosureHook } from "./loanClosureHook";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import SubTable from "../../../components/subTable/subTable";

function LoanClosureHistory() {
  let navigate = useNavigate();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { closureData, fetchTable, loading } = useLoanClosureHook();
  const { search, setSearch } = useTableFilters();

  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search]);

  // Fetch data
  useEffect(() => {
    fetchTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
    }).then(setTotalCount);
  }, [page, rowsPerPage, search]);

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "loanNo", label: "Loan No" },
    { id: "customerName", label: "Customer Name" },
    { id: "mobile", label: "Mobile" },
    { id: "loanType", label: "Loan Type" },
    { id: "closedBy", label: "Closed By" },
    { id: "closedThrough", label: "Closed Through" },
    { id: "loanClosureDate", label: "Closure Date" },
    { id: "createdAt", label: "Created At" },
  ];

  const columnsData = closureData.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    loanNo: item.loanNo || "-",
    customerName: item.customerName || "-",
    mobile: item.mobile || "-",
    loanType: item.loanType || "-",
    closedBy: item.closedBy || "-",
    closedThrough: item.closedThrough || "-",
    loanClosureDate: formatDateTime(item.loanClosureDate) || "-",
    createdAt: formatDateTime(item.createdAt) || "-",
    _id: item._id,
  }));

  return (
    <>
      <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" mb={3} flexGrow={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Breadcrumb
                items={[
                  { label: "Manage Loan" },
                  { label: "Loan Closure History", active: true },
                ]}
              />
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/manageloan/loanClosure")}
          >
            Loan Closure
          </Button>
        </Box>

        <Box bgcolor="#ffffff" px={2} py={1} sx={{ borderRadius: 1 }}>
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
            data={columnsData}
            loading={loading}
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

export default LoanClosureHistory;
