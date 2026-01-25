import { Helmet } from "react-helmet-async";
import { DashboardContent } from "../../../layouts/dashboard";
import { Stack } from "@mui/material";
import { Button, Box } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { CONFIG } from "../../../config-global";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { useInterestPayment } from "./interestPaymentHooks";
import { useEffect } from "react";
import { formatDateTime } from "../../../utils/dateFormate";
import SubTable from "../../../components/subTable/subTable";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";

function PaymentTable() {
  const navigate = useNavigate();
  const {
    fetchTable,
    paymentData,
    loading,
    fetchPaymentBasis,
    paymentBasisList,
  } = useInterestPayment();
  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters, setFilters } = useTableFilters();

  console.log(paymentBasisList);
  useEffect(() => {
    fetchPaymentBasis();
  }, []);
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

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "customerName", label: "Customer Name" },
    { id: "paymentBasis", label: "Payment Basis" },
    { id: "totalPaybleAmount", label: "Total Payable" },
    { id: "pendingAmount", label: "Pending Amount" },
    { id: "paymentDate", label: "Payment Date" },
  ];

  const tableData = paymentData.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    customerName: item.customerName,
    paymentBasis: paymentBasisList.find((i) => i.no == item.paymentBasis)?.mode,
    totalPaybleAmount: item.totalPaybleAmount,
    pendingAmount: item.pendingAmount,
    paymentDate: formatDateTime(item.paymentDate),
  }));

  // useEffect(() => {
  //   setFilters((prev: any) => ({
  //     ...prev,
  //     paymentBasis: paymentBasisList.find((i)=>i._id==filters?.paymentBasisId)?.no,
  //   }));
  // }, [filters.paymentBasisId]);

  return (
    <>
      <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" flexGrow={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Breadcrumb
                items={[
                  { label: "Payment" },
                  { label: "Manage Payment", active: true },
                ]}
              />
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/payment/interest-payment")}
          >
            Add Payment
          </Button>
        </Box>

        <Box bgcolor="#ffffff" px={2} py={1} sx={{ borderRadius: 1 }}>
          <FilterBar
            rows={[
              <Box display="flex" gap={1} flexWrap="wrap">
                <FilterItem>
                  <Search onSearch={(v) => setSearch(v)} loading={loading} />
                </FilterItem>
                {/* <FilterItem>
                  <DropDown
                    label="Payment Basis"
                    value={filters.paymentBasis}
                    options={paymentBasisList}
                    optionLabel="mode"
                    optionValue="_id"
                    onChange={(e) => {
                      setFilters((prev: any) => ({
                        ...prev,
                        paymentBasisId: e.target.value,
                      }));
                    }}
                    size="small"
                  />
                </FilterItem> */}
              </Box>,
            ]}
          />
          <SubTable
            coloums={columns}
            data={tableData}
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

export default PaymentTable;
