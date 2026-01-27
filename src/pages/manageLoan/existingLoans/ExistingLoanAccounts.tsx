import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../config-global";

import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";

import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import SubTable from "../../../components/subTable/subTable";
import { useLoanAccount } from "../customer/loanAccountHooks";
import { useEffect } from "react";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { formatDateTime } from "../../../utils/dateFormate";
import { statusBadge } from "../../../const";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";
import { useLoan } from "../../loan/loanHooks";

const status = [
    { _id: "0", label: "Open" },
    { _id: "1", label: "Close" },
    { _id: "2", label: "Pre Close" },
    { _id: "4", label: "Eligible For Close" },
];

function ViewLoan() {
  let navigate = useNavigate();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch,filters,setFilters } = useTableFilters();

  const { fetchTable, loading, loansAccounts } = useLoanAccount();
  const {fetchLoans,loans}=useLoan()

  useEffect(()=>{
    fetchLoans()
  },[])
  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search,filters]);

  // Fetch data
  useEffect(() => {
    fetchTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
      filters
    }).then(setTotalCount);
  }, [page, rowsPerPage, search,filters]);

  // Handle view action
  const handleView = (row: { _id: string }) => {
    navigate(`/manageloan/viewexistingloan/${row._id}`);
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "loanNo", label: "Loan No" },
    { id: "customerName", label: "Customer Name" },
    { id: "mobile", label: "Mobile" },
    { id: "loanType", label: "Loan Type" },
    { id: "loanStatus", label: "Status" },
    { id: "principalAmt", label: "Principal Amount" },
    { id: "paidInstallment", label: "Paid Installment" },
    { id: "maturityDate", label: "Maturity Date" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = loansAccounts.map((item: any, index: number) => ({
     id: page * rowsPerPage + index + 1,
    _id: item._id,

    loanNo: item.loanNo,
    customerName: item.customerName,
    mobile: item.mobile,
    loanType: item.loanType,

    loanStatus: statusBadge(item.loanStatus),
    principalAmt: item.principalAmt,
    paidInstallment: `${item.paidInstallment}/${item.installment}`,

    maturityDate: formatDateTime(item.maturityDate),
    createdAt: formatDateTime(item.createdAt),
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
                  { label: "Existing Loan", active: true },
                ]}
              />
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/manageloan/new-loan")}
          >
            Add Loans
          </Button>
        </Box>

        <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
           <FilterBar
            rows={[
              <Box display="flex" gap={1} flexWrap="wrap">
                <FilterItem>
                  <Search onSearch={(v) => setSearch(v)} loading={loading} />
                </FilterItem>
                <FilterItem>
                  <DropDown
                    label="Loans"
                    value={filters.loanId}
                    options={loans}
                    optionLabel="loanName"
                    optionValue="_id"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        loanId: e.target.value,
                      }))
                    }
                    size="small"
                  />
                 
                </FilterItem>
                <FilterItem>
                   <DropDown
                    label="Status"
                    value={filters.loanStatus}
                    options={status}
                    optionLabel="label"
                    optionValue="_id"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        loanStatus: e.target.value,
                      }))
                    }
                    size="small"
                  />
                </FilterItem>
              </Box>
              
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

export default ViewLoan;
