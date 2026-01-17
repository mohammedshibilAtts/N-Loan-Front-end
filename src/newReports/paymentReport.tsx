
import { Helmet } from "react-helmet-async";
import { CONFIG } from "../config-global";
import { DashboardContent } from "../layouts/dashboard";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../components/subTable/subTable";
import { apiRequest } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINTS from "../services/endpoints";
import { PAYMENT_REPORT, PAYMENT_MODE_LIST, PAYMENT_PROVIDER_LIST } from "../store/actionTypes";
import { spliceDecimals } from "../const";
import DateRange from "../components/dateRange/dateRange";
import ImportButton from "../components/importButton/importButton";
import axios from "axios";
import DropDown from "../components/dropdown/dropdown";
import Search from "../components/search/search";
import PaymentViewModal from "./paymentViewModal";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;

export default function PaymentReport() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [reportData, setReportData] = useState<any[]>([]);
    // const [summary, setSummary] = useState<any>(null);

    const [dateRange, setDateRange] = useState<any>({
        startDate: null,
        endDate: null,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filters
    const [paymentTypeId, setPaymentTypeId] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");

    const [paymentTypeOptions, setPaymentTypeOptions] = useState<any[]>([]);

    // Modal State
    const [openModal, setOpenModal] = useState(false);
    const [selectedPaymentModeData, setSelectedPaymentModeData] = useState<any[]>([]);
    const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>([]);
    const [paymentProvidersList, setPaymentProvidersList] = useState<any[]>([]);


    const { paymentReportRes, paymentModeListRes, paymentProviderListRes } = useSelector(
        (states: any) => ({
            paymentReportRes: states[PAYMENT_REPORT]?.data,
            paymentModeListRes: states[PAYMENT_MODE_LIST]?.data,
            paymentProviderListRes: states[PAYMENT_PROVIDER_LIST]?.data,
        })
    );

    // Fetch initial data (Branches, etc.)
    useEffect(() => {
        dispatch(
            apiRequest(PAYMENT_MODE_LIST, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "findAll",
                params: { tableName: "paymentBasis" },
            })
        );
        dispatch(
            apiRequest(PAYMENT_PROVIDER_LIST, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "findAll",
                params: { tableName: "paymentProvider" },
            })
        );
    }, [dispatch]);

    useEffect(() => {
        if (paymentModeListRes?.success) {
            setPaymentMethodsList(paymentModeListRes.data.data);
            setPaymentTypeOptions(
                paymentModeListRes.data.data.map((item: any) => ({
                    label: item.mode,
                    value: item._id,
                }))
            );
        }
        if (paymentProviderListRes?.success) {
            setPaymentProvidersList(paymentProviderListRes.data.data);
        }
    }, [paymentModeListRes, paymentProviderListRes]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const fromDateParam = queryParams.get("fromDate");
        const toDateParam = queryParams.get("toDate");
        const modeParam = queryParams.get("mode");

        if (fromDateParam && toDateParam) {
            // Function to parse "dd/mm/yyyy" to Date object
            const parseDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split("/").map(Number);
                return new Date(year, month - 1, day);
            };

            setDateRange({
                startDate: parseDate(fromDateParam),
                endDate: parseDate(toDateParam),
            });
        }

        if (modeParam && paymentMethodsList.length > 0) {
            const foundMode = paymentMethodsList.find((method: any) =>
                method.mode.toLowerCase().includes(modeParam.toLowerCase())
            );
            if (foundMode) {
                setPaymentTypeId(foundMode._id);
            }
        }
    }, [location.search, paymentMethodsList]);

    // Fetch Report Data
    useEffect(() => {
        setLoading(true);
        const filters: any = {};
        if (paymentTypeId) filters.paymentType = paymentTypeId;

        dispatch(
            apiRequest(PAYMENT_REPORT, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "Reports",
                params: {
                    tableName: "paymentReport",
                    page: page + 1,
                    limit: rowsPerPage,
                    fromDate: dateRange.startDate,
                    toDate: dateRange.endDate,
                    filters: filters,
                    search: search || undefined,
                },
            })
        );
    }, [dateRange, rowsPerPage, page, paymentTypeId, search, dispatch]);

    useEffect(() => {
        if (paymentReportRes?.success) {
            setReportData(paymentReportRes.data.data);
            setTotalCount(paymentReportRes.data.totalCount || 0); // Note: response says totalCount is at root of data, not pagination
            // setSummary(paymentReportRes.data.summary);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [paymentReportRes]);

    const amountDecimal = (amount: number) => {
        return `₹${spliceDecimals(amount, 2)}`;
    };

    const handleView = (paymentModeData: any[]) => {
        setSelectedPaymentModeData(paymentModeData || []);
        setOpenModal(true);
    };

    const columns = [
        { id: "id", label: "S.NO" },
        { id: "loanNo", label: "Loan No" },
        { id: "customerName", label: "Customer Name" },
        { id: "customerMobile", label: "Mobile" },
        { id: "branchName", label: "Branch" },
        { id: "paymentType", label: "Payment Type" },
        { id: "paymentDetails", label: "Payment Details" },
        { id: "amount", label: "Amount" },
        { id: "fine", label: "Fine" },
        { id: "totalPaid", label: "Total Paid" },
        { id: "collectedBy", label: "Collected By" },
        { id: "paymentDate", label: "Date" },
    ];

    const columnsData = reportData?.map((item: any, index: number) => ({
        id: page * rowsPerPage + index + 1,
        loanNo: item.loanNo,
        customerName: item.customerName,
        customerMobile: item.customerMobile,
        branchName: item.branchName,
        paymentType: item.paymentType,
        paymentDetails: (
            <span
                style={{ textDecoration: "underline", cursor: "pointer", color: "black" }}
                onClick={() => handleView(item.paymentMode)}
            >
                View
            </span>
        ),
        amount: amountDecimal(item.amount),
        fine: amountDecimal(item.fine),
        totalPaid: amountDecimal(item.totalPaid),
        collectedBy: item.collectedBy,
        paymentDate: item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : "-",
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
            const filters: any = {};
            if (paymentTypeId) filters.paymentType = paymentTypeId;

            const response = await axios.post(
                `${API_URL}${API_ENDPOINTS.SP.POST}`,
                {
                    procedureName: "Reports",
                    params: {
                        tableName: "exportPaymentReport", // Assuming export tableName
                        fromDate: dateRange.startDate,
                        toDate: dateRange.endDate,
                        filters: filters,
                        search: search || undefined,
                    },
                },
                {
                    responseType: "blob",
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
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "PaymentReport.xlsx";
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
                        <span className="text-[#737791]">Reports</span> / Payment Report
                    </Typography>
                </Box>

                <Card sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                                    Payment Report
                                </Typography>

                                <Box>
                                    <Box display="flex" gap={0.6} mt={1} flexWrap="wrap">
                                        <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
                                            <DropDown
                                                label="Payment Type"
                                                name="paymentType"
                                                value={paymentTypeId}
                                                options={paymentTypeOptions}
                                                onChange={(e) => setPaymentTypeId(e.target.value)}
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
                                            {reportData.length > 0 && (
                                                <Box>
                                                    <ImportButton onImportExcel={getExcel} />
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                <SubTable
                                    coloums={columns}
                                    data={columnsData}
                                    action={false}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    count={totalCount}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    loading={loading}
                                />

                                {/* {summary && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                                            <Typography variant="h6">{amountDecimal(summary.totalAmount || 0)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Total Fine</Typography>
                                            <Typography variant="h6">{amountDecimal(summary.totalFine || 0)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Total Paid</Typography>
                                            <Typography variant="h6" color="primary.main">{amountDecimal(summary.totalPaid || 0)}</Typography>
                                        </Box>
                                    </Box>
                                )} */}
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                <PaymentViewModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    data={selectedPaymentModeData}
                    paymentMethods={paymentMethodsList}
                    paymentProviders={paymentProvidersList}
                />
            </DashboardContent>
        </>
    );
}
