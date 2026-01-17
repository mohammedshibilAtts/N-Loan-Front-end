import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { DashboardContent } from '../layouts/dashboard';
import { Box, Card, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SubTable from '../components/subTable/subTable';
import { apiRequest } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import API_ENDPOINTS from '../services/endpoints';
import { CASH_FLOW_REPORTS } from '../store/actionTypes';
import SingleDate from "../components/singleDate/singleDate";
import ImportButton from "../components/importButton/importButton";
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;

export default function CashFlowReport() {
    const dispatch = useDispatch();
    const [reportsData, setReportsData] = useState<any[]>([]);

    const [date, setDate] = useState<any>(new Date());
    const [loading, setLoading] = useState(false);
    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const { CashFlowReportsData } = useSelector((states: any) => ({
        CashFlowReportsData: states[CASH_FLOW_REPORTS]?.data,
    }));

    // Cleanup page on filter change
    useEffect(() => {
        setPage(0);
    }, [date]);

    // API Call with Pagination
    useEffect(() => {
        setLoading(true);
        dispatch(
            apiRequest(CASH_FLOW_REPORTS, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "Reports",
                params: {
                    tableName: "cashFlowReport",
                    page: page + 1, // API expects 1-based index
                    limit: rowsPerPage,
                    filters: {
                        date: date,
                    },
                },
            })
        );
    }, [dispatch, page, rowsPerPage, date]);

    useEffect(() => {
        if (CashFlowReportsData?.success) {
            setReportsData(CashFlowReportsData.data.data || []);
            // Ensure we safely fallback to 0 if totalCount is missing
            setTotalCount(CashFlowReportsData.data.totalCount || 0);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [CashFlowReportsData]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
        modeOfPayment: item["Mode of Payment"],
        open: item["Open"],
        in: item["In"],
        out: item["Out"],
        close: item["close"],
    }));

    const getExcel = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await axios.post(
                `${API_URL}${API_ENDPOINTS.SP.POST}`,
                {
                    procedureName: "Reports",
                    params: {
                        tableName: "exportCashFlowReport",
                        filters: {
                            date: date,
                        },
                        // search,
                        // fromDate: date,
                        // toDate: date,
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
            a.download = "CashFlowReport.xlsx";
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
    )
}
