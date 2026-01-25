import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../config-global";
import { DashboardContent } from "../../layouts/dashboard";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../../components/subTable/subTable";
import dayjs from "dayjs";
import { spliceDecimals, statusBadge } from "../../const";
import DropDown from "../../components/dropdown/dropdown";
import Search from "../../components/search/search";
import DateRange from "../../components/dateRange/dateRange";
import ImportButton from "../../components/importButton/importButton";
import { useLocation } from "react-router-dom";
import { useLoan } from "../../pages/loan/loanHooks";
import { useLoanAccount } from "./useLoanAccount";
import { useInterest } from "../../pages/master/interestCreation/interestHook";

const status = [
  { _id: "0", label: "Open" },
  { _id: "1", label: "Close" },
  { _id: "2", label: "Pre Close" },
  { _id: "4", label: "Eligible For Close" },
];

export default function LoanAccountReport() {
  const { fetchLoans, loans } = useLoan();
  const { interests } = useInterest();
  const {
    fetchLoanAccountReports,
    exportLoanAccountReport,
    loanAccountData,
    loading,
    totalCount,
  } = useLoanAccount();

  const [selectedLoanStatus, setSelectedLoanStatus] = useState(null);
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [selectedInterestType, setSelectedInterestType] = useState(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fromDateParam = queryParams.get("fromDate");
    const toDateParam = queryParams.get("toDate");

    if (fromDateParam && toDateParam) {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        // Adjust for timezone offset to ensure correct date
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date;
      };

      setDateRange({
        startDate: parseDate(fromDateParam),
        endDate: parseDate(toDateParam),
      });
    }
  }, [location.search]);

  useEffect(() => {
    fetchLoans();
  }, []);

  // Cleanup page on filter change
  useEffect(() => {
    setPage(0);
  }, [
    selectedLoanStatus,
    selectedLoanType,
    selectedInterestType,
    search,
    dateRange,
  ]);

  useEffect(() => {
    const payload = {
      tableName: "loanAccountReport",
      filters: {
        loanStatus: selectedLoanStatus,
        loanId: selectedLoanType,
        interestId: selectedInterestType,
      },
      page: page + 1,
      limit: rowsPerPage,
      search,
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
    };
    fetchLoanAccountReports(payload);
  }, [
    selectedLoanStatus,
    selectedLoanType,
    selectedInterestType,
    search,
    dateRange,
    rowsPerPage,
    page,
  ]);

  const amountDecimal = (amount: number) => {
    return spliceDecimals(amount, 2);
  };

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
    { id: "loanType", label: "Loan Type" },
    { id: "interestType", label: "Interest Type" },
    { id: "loanStatus", label: "Loan Status" },
    { id: "installment", label: "Installment" },
    { id: "paymentDate", label: "Payment Date" },
    { id: "lastPaidDate", label: "Last Paid Date" },
    { id: "lastPaidAmt", label: "Last Paid Amount" },
    { id: "loanCreatedDate", label: "Loan created Date" },
    { id: "maturityDate", label: "Maturity Date" },
    { id: "principalAmount", label: "Principal Amount" },
    { id: "interestRate", label: "Interest Rate (%)" },
    { id: "interestAmount", label: "Interest Amount" },
    { id: "totalPayable", label: "Total Loan Amount" },
  ];

  const columnsData = loanAccountData?.map((item: any, index: any) => ({
    id: page * rowsPerPage + index + 1,
    loanNo: item.loanNo,
    customerName: item.customerName,
    mobile: item.mobile,
    loanType: item.loanType,
    interestType: item.interestName,
    loanStatus: statusBadge(item.loanStatus),
    installment: `${item.paidInstallment}/${item.installment}`,
    paymentDate: item.paymentDate
      ? dayjs(item.paymentDate).format("DD/MM/YYYY")
      : "-",
    lastPaidDate: item.lastPaymentDate
      ? dayjs(item.lastPaymentDate).format("DD/MM/YYYY")
      : "-",
    lastPaidAmt: amountDecimal(item.interestAmount),
    maturityDate: item.maturityDate
      ? dayjs(item.maturityDate).format("DD/MM/YYYY")
      : "-",
    principalAmount: amountDecimal(item.principalAmt),
    interestRate: item.interestRate,
    interestAmount: amountDecimal(item.interestAmount),
    totalPayable: amountDecimal(item.totalPayable),
    loanCreatedDate: item.createdAt
      ? dayjs(item.createdAt).format("DD/MM/YYYY")
      : "-",
  }));

  const getExcel = async () => {
    const payload = {
      tableName: "exportLoanAccountReport",
      filters: {
        loanStatus: selectedLoanStatus,
        loanId: selectedLoanType,
        interestId: selectedInterestType,
      },
      search,
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
    };
    exportLoanAccountReport(payload);
  };

  return (
    <>
      <Helmet>
        <title>{`Reports - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className="text-[#737791]">Reports</span> / Loan Account
            Report
          </Typography>
        </Box>

        <Card sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                  Loan Account Report
                </Typography>

                <Box>
                  <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                    <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
                      <DropDown
                        label="Loan Status"
                        value={selectedLoanStatus}
                        options={status}
                        optionLabel="label"
                        optionValue="_id"
                        onChange={(e) => setSelectedLoanStatus(e.target.value)}
                        size="small"
                      />
                    </Box>
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
                    <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
                      <DropDown
                        label="Interest Type"
                        value={selectedInterestType}
                        options={interests}
                        optionLabel="interestName"
                        optionValue="_id"
                        onChange={(e) =>
                          setSelectedInterestType(e.target.value)
                        }
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
                      {loanAccountData.length > 0 && (
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
