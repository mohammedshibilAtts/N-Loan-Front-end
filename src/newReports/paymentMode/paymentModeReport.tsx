import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../config-global";
import { DashboardContent } from "../../layouts/dashboard";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../../components/subTable/subTable";
import DateRange from "../../components/dateRange/dateRange";
import ImportButton from "../../components/importButton/importButton";
import { usePaymentMode } from "./usePaymentMode";
import { spliceDecimals } from "../../const";

export default function PaymentModeReport() {
    const { paymentModeData, loading, totalCount, fetchPaymentModeReport, exportPaymentModeExcel } = usePaymentMode();

    const [dateRange, setDateRange] = useState<any>({
        startDate: null,
        endDate: null,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter effect
    useEffect(() => {
        setPage(0);
    }, [dateRange]);

    useEffect(() => {
        const payload = {
            tableName: "paymentModeReport",
            page: page + 1,
            limit: rowsPerPage,
            fromDate: dateRange.startDate,
            toDate: dateRange.endDate,
        };
        fetchPaymentModeReport(payload);
    }, [dateRange, rowsPerPage, page]);

    const amountDecimal = (amount: number) => {
        return `₹${spliceDecimals(amount, 2)}`;
    };

    const coloums = [
        { id: "id", label: "S.NO" },
        { id: "paymentMethodName", label: "Mode" },
        { id: "totalAmount", label: "Total Amount" },
        { id: "totalTransactions", label: "Total Transactions" },
    ];

    const columnsData = paymentModeData?.map((item: any, index: any) => ({
        id: (page * rowsPerPage) + index + 1,
        paymentMethodName: item.paymentMethodName,
        totalAmount: amountDecimal(item.totalAmount),
        totalTransactions: item.totalTransactions,
    }));

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleExport = () => {
        const payload = {
            tableName: "exportPaymentModeReport",
            fromDate: dateRange.startDate,
            toDate: dateRange.endDate,
        };
        exportPaymentModeExcel(payload);
    };

    return (
        <>
            <Helmet>
                <title>{`Reports - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent>
                <Box display="flex" alignItems="center" mb={5}>
                    <Typography variant="h6" flexGrow={1} marginLeft={2}>
                        <span className="text-[#737791]">Reports</span> / Payment Mode Report
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
                                        <Box sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "250px" }}></Box>

                                        <Box display={"flex"} gap={1}>
                                            <Box sx={{ minWidth: "200px", maxWidth: "250px" }}>
                                                <DateRange
                                                    value={dateRange}
                                                    onChange={(range) => setDateRange(range)}
                                                />
                                            </Box>
                                            {paymentModeData.length > 0 && (
                                                <Box>
                                                    <ImportButton onImportExcel={handleExport} />
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
