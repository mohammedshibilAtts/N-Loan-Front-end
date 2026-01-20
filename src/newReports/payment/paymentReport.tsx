import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../config-global";
import { DashboardContent } from "../../layouts/dashboard";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../../components/subTable/subTable";
import { spliceDecimals } from "../../const";
import DateRange from "../../components/dateRange/dateRange";
import ImportButton from "../../components/importButton/importButton";
import DropDown from "../../components/dropdown/dropdown";
import Search from "../../components/search/search";
import PaymentViewModal from "../paymentViewModal";
import { useLocation } from "react-router-dom";
import { usePayment } from "./usePayment";
import dayjs from "dayjs";

export default function PaymentReport() {
    const {
        reportData,
        loading,
        totalCount,
        paymentMethodsList,
        paymentProvidersList,
        fetchPaymentReport,
        exportPaymentExcel
    } = usePayment();

    const location = useLocation();

    const [dateRange, setDateRange] = useState<any>({
        startDate: null,
        endDate: null,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filters
    const [paymentTypeId, setPaymentTypeId] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [paymentTypeOptions, setPaymentTypeOptions] = useState<any[]>([]);

    // Modal State
    const [openModal, setOpenModal] = useState(false);
    const [selectedPaymentModeData, setSelectedPaymentModeData] = useState<any[]>([]);

    useEffect(() => {
        if (paymentMethodsList.length > 0) {
            setPaymentTypeOptions(
                paymentMethodsList.map((item: any) => ({
                    label: item.mode,
                    value: item._id,
                }))
            );
        }
    }, [paymentMethodsList]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const fromDateParam = queryParams.get("fromDate");
        const toDateParam = queryParams.get("toDate");
        const modeParam = queryParams.get("mode");

        if (fromDateParam && toDateParam) {
            const parseDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split("/").map(Number);
                const date = new Date(year, month - 1, day);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                return date;
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

    useEffect(() => {
        const filters: any = {};
        if (paymentTypeId) filters.paymentType = paymentTypeId;

        const payload = {
            tableName: "paymentReport",
            page: page + 1,
            limit: rowsPerPage,
            fromDate: dateRange.startDate ? dayjs(dateRange.startDate).format("YYYY-MM-DD") : null,
            toDate: dateRange.endDate ? dayjs(dateRange.endDate).format("YYYY-MM-DD") : null,
            filters: filters,
            search: search || undefined,
        };
        fetchPaymentReport(payload);
    }, [dateRange, rowsPerPage, page, paymentTypeId, search]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const amountDecimal = (amount: number) => {
        return `₹${spliceDecimals(amount, 2)}`;
    };

    const handleView = (paymentModeData: any[]) => {
        setSelectedPaymentModeData(paymentModeData || []);
        setOpenModal(true);
    };

    const handleExport = () => {
        const filters: any = {};
        if (paymentTypeId) filters.paymentType = paymentTypeId;

        const payload = {
            tableName: "exportPaymentReport",
            fromDate: dateRange.startDate ? dayjs(dateRange.startDate).format("YYYY-MM-DD") : null,
            toDate: dateRange.endDate ? dayjs(dateRange.endDate).format("YYYY-MM-DD") : null,
            filters: filters,
            search: search || undefined,
        };
        exportPaymentExcel(payload);
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
        paymentDate: item.paymentDate ? dayjs(item.paymentDate).format("DD/MM/YYYY") : "-",
    }));

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
                                                    <ImportButton onImportExcel={handleExport} />
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
