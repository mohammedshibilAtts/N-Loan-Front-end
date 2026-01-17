import { Helmet } from "react-helmet-async";
import { CONFIG } from "../config-global";
import { DashboardContent } from "../layouts/dashboard";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../components/subTable/subTable";
import { apiRequest } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINTS from "../services/endpoints";
import { PAYMENT_MODE_REPORT } from "../store/actionTypes";
import { spliceDecimals } from "../const";
import DateRange from "../components/dateRange/dateRange";
import ImportButton from "../components/importButton/importButton";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;

export default function PaymentModeReport() {
  const dispatch = useDispatch();
  const [paymentModeDate, setPaymentModeData] = useState<any[]>([]);

  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { paymentReportRes } = useSelector((states: any) => ({
    paymentReportRes: states[PAYMENT_MODE_REPORT]?.data,
  }));

  useEffect(() => {
    setLoading(true);
    dispatch(
      apiRequest(PAYMENT_MODE_REPORT, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "Reports",
        params: {
          tableName: "paymentModeReport",

          page: page + 1,
          limit: rowsPerPage,
          fromDate: dateRange.startDate,
          toDate: dateRange.endDate,
        },
      })
    );
  }, [dateRange, rowsPerPage, page]);

  useEffect(() => {
    if (paymentReportRes?.success) {
      setPaymentModeData(paymentReportRes.data.data);
      setTotalCount(paymentReportRes.data.pagination.totalRecords || 0);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [paymentReportRes]);

  const amountDecimal = (amount: number) => {
    return `₹${spliceDecimals(amount, 2)}`;
  };

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "paymentMethodName", label: "Mode" },
    { id: "totalAmount", label: "Total Amount" },
    { id: "totalTransactions", label: "Total Transactions" },
  ];

  const columnsData = paymentModeDate?.map((item: any, index: any) => ({
    id: (page * rowsPerPage) + index + 1,
    paymentMethodName: item.paymentMethodName,
    totalAmount: amountDecimal(item.totalAmount),
    totalTransactions: item.totalTransactions,
  }));

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getExcel = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${API_URL}${API_ENDPOINTS.SP.POST}`,
        {
          procedureName: "Reports",
          params: {
            tableName: "exportPaymentModeReport",
            fromDate: dateRange.startDate,
            toDate: dateRange.endDate,
          },
        },
        {
          responseType: "blob", // ✅ REQUIRED
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && {
              Authorization: `Bearer ${accessToken}`,
            }),
          },
        }
      );

      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "PaymentModeReport.xlsx";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel export error:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Reports - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className="text-[#737791]">Reports</span> / Payment Mode
            Report
          </Typography>
        </Box>

        <Card sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                  Payment Mode Report
                </Typography>

                <Box>
                  <Box
                    display="flex"
                    mt={2}
                    justifyContent={"space-between"}
                    flexWrap="wrap"
                  >
                    <Box
                      sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "250px" }}
                    ></Box>

                    <Box display={"flex"} gap={1}>
                      <Box sx={{ minWidth: "200px", maxWidth: "250px" }}>
                        <DateRange
                          value={dateRange}
                          onChange={(range) => setDateRange(range)}
                        />
                      </Box>
                      {paymentModeDate.length > 0 && (
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
