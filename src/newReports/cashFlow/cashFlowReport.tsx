import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DashboardContent } from '../../layouts/dashboard';
import { Box, Card, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SubTable from '../../components/subTable/subTable';
import SingleDate from "../../components/singleDate/singleDate";
import ImportButton from "../../components/importButton/importButton";
import { useCashFlow } from './useCashFlow';
import dayjs from 'dayjs';

export default function CashFlowReport() {
    const { reportsData, loading, totalCount, fetchCashFlowReport, exportCashFlowExcel } = useCashFlow();

    const [date, setDate] = useState<any>(new Date());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Cleanup page on filter change
    useEffect(() => {
        setPage(0);
    }, [date]);

    // API Call with Pagination
    useEffect(() => {
        const payload = {
            tableName: "cashFlowReport",
            page: page + 1, // API expects 1-based index
            limit: rowsPerPage,
            filters: {
                date: dayjs(date).format("YYYY-MM-DD"),
            },
        };
        fetchCashFlowReport(payload);
    }, [page, rowsPerPage, date]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleExport = () => {
        const payload = {
            tableName: "exportCashFlowReport",
            filters: {
                date: dayjs(date).format("YYYY-MM-DD"),
            },
        };
        exportCashFlowExcel(payload);
    }

    const coloums = [
        { id: "id", label: "S.NO" },
        { id: "modeOfPayment", label: "Mode of Payment" },
        { id: "open", label: "Open" },
        { id: "in", label: "In" },
        { id: "out", label: "Out" },
        { id: "close", label: "Close" },
    ];

    const columnsData = reportsData?.map((item: any, index: any) => ({
        id: (page * rowsPerPage) + index + 1,
        modeOfPayment: item["Mode of Payment"] || item.modeOfPayment,
        open: item["Open"] || item.open || 0,
        in: item["In"] || item.in || 0,
        out: item["Out"] || item.out || 0,
        close: item["close"] || item.close || 0,
    }));

    return (
        <>
            <Helmet>
                <title>{`Reports - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent>
                <Box display="flex" alignItems="center" mb={5}>
                    <Typography variant="h6" flexGrow={1} marginLeft={2}>
                        <span className='text-[#737791]'>Reports</span> / Cash Flow Report
                    </Typography>
                </Box>

                <Card sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                                    Cash Flow Report
                                </Typography>

                                <Box>
                                    <Box display="flex" mt={2} justifyContent="flex-end" flexWrap="wrap">
                                        <Box display={"flex"} gap={1}>
                                            <Box sx={{ minWidth: "100px", maxWidth: "150px" }}>
                                                <SingleDate
                                                    value={date}
                                                    onChange={(d) => setDate(d)}
                                                />
                                            </Box>
                                            {reportsData.length > 0 && (
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
    )
}
