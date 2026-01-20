import { Helmet } from "react-helmet-async";
import { CONFIG } from "../config-global";
import { DashboardContent } from "../layouts/dashboard";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../components/subTable/subTable";
import dayjs from "dayjs";
import DropDown from "../components/dropdown/dropdown";
import Search from "../components/search/search";
import DateRange from "../components/dateRange/dateRange";
import ImportButton from "../components/importButton/importButton";
import { useLoan } from "../pages/loan/loanHooks";  
import { useOverdue } from "./overdue/useOverdue";

export default function OverDueReport() {
  const { fetchLoans, loans } = useLoan();
  const { fetchOverdueReports, exportOverdueReport, reportsData, loading, totalCount } = useOverdue();

  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Cleanup page on filter change
  useEffect(() => {
    setPage(0);
  }, [selectedLoanType, search, dateRange]);

  // API Call with Pagination
  useEffect(() => {
    const payload = {
      page: page + 1, // API expects 1-based index
      limit: rowsPerPage,
      loanId: selectedLoanType,
      search,
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
    };
    fetchOverdueReports(payload);
  }, [page, rowsPerPage, selectedLoanType, search, dateRange]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "loanNo", label: "Loan No" },
    { id: "customerName", label: "Customer Name" },
    { id: "mobile", label: "Customer Mobile" },
    { id: "branchName", label: "Branch" },
    { id: "loanType", label: "Loan Type" },
    { id: "paymentDate", label: "Payment Date" },
    { id: "overdueAmount", label: "Overdue Amount" },
    { id: "overdueMonths", label: "Overdue Months" },
    { id: "lateFine", label: "Late Fine" },
    { id: "totalOutstandingAmount", label: "Total Outstanding Amount" },
    { id: "lastPaymentDate", label: "Last Payment Date" },
    { id: "interestAmount", label: "Interest Amount" },
    { id: "principalAmount", label: "Principal Amount" },
  ];

  const columnsData = reportsData?.map((item: any, index: any) => ({
    id: page * rowsPerPage + index + 1,
    loanNo: item.loanNo,
    customerName: item.customerName,
    mobile: item.mobile,
    branchName: item.branchName,
    loanType: item.loanType,
    paymentDate: item.paymentDate
      ? dayjs(item.paymentDate).format("DD/MM/YYYY")
      : "-",
    overdueAmount: item.overdueAmount,
    overdueMonths: item.overdueMonths,
    lateFine: item.lateFine,
    totalOutstandingAmount: item.totalOutstandingAmount,
    lastPaymentDate: item.lastPaymentDate
      ? dayjs(item.lastPaymentDate).format("DD/MM/YYYY")
      : "-",
    interestAmount: item.interestAmount,
    principalAmount: item.principalAmount,
  }));

  const getExcel = async () => {
    const payload = {
      loanId: selectedLoanType,
      search,
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
    };
    exportOverdueReport(payload);
  };

  return (
    <>
      <Helmet>
        <title>{`Reports - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className="text-[#737791]">Reports</span> / Overdue Report
          </Typography>
        </Box>

        <Card sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                  Overdue Report
                </Typography>

                <Box>
                  <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                    <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
                      <DropDown
                        label="Loan Type"
                        value={selectedLoanType}
                        options={loans}
                        optionLabel="loanName"
                        optionValue="_id"
                        onChange={(e) => setSelectedLoanType(e.target.value)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    mt={2}
                    justifyContent={"space-between"}
                    flexWrap="wrap"
                  >
                    <Box
                      sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "250px" }}
                    >
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                        }}
                      />
                    </Box>

                    <Box display={"flex"} gap={1}>
                      <Box sx={{ minWidth: "200px", maxWidth: "250px" }}>
                        <DateRange
                          value={dateRange}
                          onChange={(range) => setDateRange(range)}
                        />
                      </Box>
                      {reportsData.length > 0 && (
                        <Box>
                          <ImportButton onImportExcel={getExcel} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>

                <SubTable
                  coloums={coloums}
                  data={columnsData}
                  action={false}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  count={totalCount}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  loading={loading}
                />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </DashboardContent>
    </>
  );
}
