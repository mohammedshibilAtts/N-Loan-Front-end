import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import 'dayjs/locale/en';
import { Box, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import DateRange from "../components/dateRange/dateRange";
import { apiClear, apiRequest } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINTS from "../services/endpoints";
import { EXPENSE_INCOME_REPORT_RES } from "../store/actionTypes";
import { formatNumber } from '../utils/commonFunction';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

// New Interfaces based on JSON
interface IncomeBreakdown {
    interest: number;
    overdue: number;
    charges: number;
    principalRepayment: number;
    preClose: number;
    other: number;
    [key: string]: number;
}

interface IncomeData {
    total: number;
    breakdown: IncomeBreakdown;
}

interface OperationalExpense {
    name: string;
    amount: number;
}

interface ExpenseData {
    total: number;
    operationalTotal: number;
    disbursementTotal: number;
    topUpTotal: number;
    operationalBreakdown: OperationalExpense[];
}

interface ReportData {
    income: IncomeData;
    expense: ExpenseData;
    netProfitLoss: number;
}

const COLORS = {
    expense: '#F4A825', // Red/Orange - FF5630
    income: '#EAEAEA',  // Green - 22C55E
};

const options = {
    responsive: true,
    rotation: -90,
    circumference: 360,
    cutout: '75%',
    borderRadius: [10, 0],
    plugins: {
        legend: { display: false },
        tooltip: {
            enabled: true,
            callbacks: {
                label: function (tooltipItem: any) {
                    return `${tooltipItem.label}: ₹${tooltipItem.raw.toLocaleString()}`;
                },
            },
        },
    },
    elements: {
        arc: {
            backgroundColor: '#EAEAEA',
        },
    },
};

const formatLabel = (key: string) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
};

export default function IncomeExpensesReport() {
    const location = useLocation();

    // Parse query params for initial date range
    const getInitialDateRange = () => {
        const queryParams = new URLSearchParams(location.search);
        const fromDateParam = queryParams.get("fromDate");
        const toDateParam = queryParams.get("toDate");

        if (fromDateParam && toDateParam) {
            // Function to parse "dd/mm/yyyy" to Date object
            const parseDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split("/").map(Number);
                return new Date(year, month - 1, day);
            };
            return {
                startDate: parseDate(fromDateParam),
                endDate: parseDate(toDateParam),
            };
        }
        return {
            startDate: dayjs().subtract(29, 'day').toDate(),
            endDate: new Date(),
        };
    };

    const [dateRange, setDateRange] = useState<any>(getInitialDateRange());

    const [reportData, setReportData] = useState<ReportData | null>(null);

    const [chartData, setChartData] = useState({
        incomeTotal: 0,
        expenseTotal: 0,
    });

    const [barChartData, setBarChartData] = useState<{
        labels: string[];
        incomeValues: number[];
        expenseValues: number[];
    }>({ labels: [], incomeValues: [], expenseValues: [] });

    const dispatch = useDispatch();



    const { expenseIncome } = useSelector(
        (states: any) => ({
            expenseIncome: states[EXPENSE_INCOME_REPORT_RES]?.data,
        })
    );

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const fromDateParam = queryParams.get("fromDate");
        const toDateParam = queryParams.get("toDate");

        if (fromDateParam && toDateParam) {
            const parseDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split("/").map(Number);
                return new Date(year, month - 1, day);
            };

            setDateRange({
                startDate: parseDate(fromDateParam),
                endDate: parseDate(toDateParam),
            });
        }
    }, [location.search]);

    useEffect(() => {
        dispatch(apiClear(EXPENSE_INCOME_REPORT_RES));
        return () => {
            dispatch(apiClear(EXPENSE_INCOME_REPORT_RES));
        };
    }, [dispatch]);

    useEffect(() => {
        // Prevent call if dates are empty
        if (!dateRange?.startDate || !dateRange?.endDate) return;

        const data = {
            procedureName: "Reports",
            params: {
                tableName: "incomeExpenseReport",
                filters: {
                    fromDate: dayjs(dateRange.startDate).format("YYYY-MM-DD"),
                    toDate: dayjs(dateRange.endDate).format("YYYY-MM-DD")
                },
            },
        };

        dispatch(
            apiRequest(EXPENSE_INCOME_REPORT_RES, "post", API_ENDPOINTS.SP.POST, data)
        );
    }, [dispatch, dateRange]);

    useEffect(() => {
        if (expenseIncome?.success && expenseIncome.data) {
            const data: ReportData = expenseIncome.data;
            setReportData(data);

            const incomeTotal = data.income.total || 0;
            const expenseTotal = data.expense.total || 0;

            setChartData({
                incomeTotal,
                expenseTotal,
            });

            // ---- Prepare Bar Chart Data (Breakdown) ----
            const labels: string[] = [];
            const incomeValues: number[] = [];
            const expenseValues: number[] = [];

            // 1. Process Income Breakdown
            const incomeBreakdown = data.income.breakdown;
            if (incomeBreakdown) {
                Object.keys(incomeBreakdown).forEach(key => {
                    const val = incomeBreakdown[key];
                    labels.push(formatLabel(key));
                    incomeValues.push(val);
                    expenseValues.push(0);
                });
            }

            // 2. Process Expense: Disbursement
            labels.push('Disbursement');
            incomeValues.push(0);
            expenseValues.push(data.expense.disbursementTotal || 0);

            // 2.1 Process Expense: Top Up
            if (data.expense.topUpTotal > 0) {
                labels.push('Loan Top Up');
                incomeValues.push(0);
                expenseValues.push(data.expense.topUpTotal || 0);
            }

            // 3. Process Expense: Operational Breakdown
            const operationalBreakdown = data.expense.operationalBreakdown;
            if (operationalBreakdown && Array.isArray(operationalBreakdown)) {
                operationalBreakdown.forEach(op => {
                    labels.push(op.name);
                    incomeValues.push(0);
                    expenseValues.push(op.amount);
                });
            }

            setBarChartData({
                labels,
                incomeValues,
                expenseValues
            });
        }
    }, [expenseIncome]);

    const allValues = [...barChartData.incomeValues, ...barChartData.expenseValues];
    const maxBarValue = Math.max(...allValues, 0);
    const maxY = maxBarValue > 0 ? maxBarValue * 1.1 : 100;

    const doughnoutData = {
        labels: ['Expense', 'Income'],
        datasets: [
            {
                data: [chartData.expenseTotal, chartData.incomeTotal],
                backgroundColor: [COLORS.expense, COLORS.income],
                borderWidth: 0,
                borderRadius: [0, 0],
                spacing: 0,
                cutout: '75%',
            },
        ],
    };

    return (
        <>
            <Box sx={{
                mx: 2,
                display: { xs: 'block', sm: 'flex' },
                flexDirection: { xs: 'column', lg: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>

                <Box
                    sx={{
                        mt: -8,
                        p: 3,
                        backgroundColor: "white",
                        borderRadius: 2,
                        width: { xs: '100%', md: '40%' },
                    }}
                >
                    {/* Header and Date Filter */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Typography fontWeight={700}>Income & Expenses</Typography>
                            {/* <Typography color="gray" variant="body2">
                                {"Statistics of the selected period"}
                            </Typography>
                            {dateRange?.startDate && dateRange?.endDate && (
                                <Typography fontSize={11} color="text.secondary" mt={0.5}>
                                    ({dayjs(dateRange.startDate).format("YYYY-MM-DD")} - {dayjs(dateRange.endDate).format("YYYY-MM-DD")})
                                </Typography>
                            )} */}
                        </Box>

                        <Box sx={{ px: 1.5, py: 0.5, fontSize: '14px', minWidth: "250px" }}>
                            <DateRange value={dateRange} onChange={(range) => setDateRange(range)} />
                        </Box>
                    </Box>

                    {/* Legend */}
                    <Box
                        sx={{
                            mt: 4,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 2,
                            alignItems: 'center',
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 20, height: 10, bgcolor: COLORS.expense, borderRadius: 1 }} />
                            <Typography fontSize={14}>Expense Amount</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 20, height: 10, bgcolor: COLORS.income, borderRadius: 1 }} />
                            <Typography fontSize={14}>Received Amount</Typography>
                        </Stack>
                    </Box>

                    {/* Doughnut Chart Container */}
                    <Box
                        position="relative"
                        width="100%"
                        maxWidth={800}
                        height={220}
                        mx="auto"
                        mt={6}
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Doughnut data={doughnoutData} options={options} />

                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            sx={{ transform: 'translate(-50%, -50%)', textAlign: 'center' }}
                        >
                            <Typography fontWeight={700}>Income</Typography>
                            <Typography fontWeight={700}>&</Typography>
                            <Typography fontWeight={700}>Expenses</Typography>
                        </Box>
                    </Box>

                    {/* Financial Data Section */}
                    <Box sx={{
                        mt: 4,
                        width: "100%",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        <Box textAlign="center">
                            <Typography fontWeight={700}>{formatNumber({ value: chartData.expenseTotal, decimalPlaces: 0 })}</Typography>
                            <Typography fontSize={13} color="gray">Expense Amount</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography fontWeight={700}>{formatNumber({ value: chartData.incomeTotal, decimalPlaces: 0 })}</Typography>
                            <Typography fontSize={13} color="gray">Received Amount</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography fontWeight={700}>{formatNumber({ value: reportData?.netProfitLoss || 0, decimalPlaces: 0 })}</Typography>
                            <Typography fontSize={13} color="gray">Net Amount</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Bar Chart Section */}
                <Box
                    sx={{
                        mt: 2,
                        p: 3,
                        mx: 4,
                        backgroundColor: "white",
                        borderRadius: 2,
                        width: { xs: '100%', md: '60%' },
                    }}
                >
                    <Box sx={{
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                            <Box>
                                <Typography variant="h6" fontWeight={700} marginTop={0.5}>Breakdown Analysis</Typography>
                                {dateRange?.startDate && dateRange?.endDate && (
                                    <Typography variant="caption" color="text.secondary">
                                        for {dayjs(dateRange.startDate).format("YYYY-MM-DD")} to {dayjs(dateRange.endDate).format("YYYY-MM-DD")}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    <BarChart
                        sx={{ mt: 4 }}
                        borderRadius={4}
                        hideLegend={true}
                        xAxis={[
                            {
                                id: 'categories',
                                data: barChartData.labels,
                                scaleType: 'band',
                                disableLine: false,
                                disableTicks: false,
                                categoryGapRatio: 0.3,
                                tickLabelStyle: {
                                    angle: -45,
                                    textAnchor: 'end',
                                    fontSize: 12, // Increased font size
                                    fontWeight: 500
                                }
                            },
                        ]}
                        yAxis={[
                            {
                                min: 0,
                                max: maxY,
                                disableLine: true,
                                disableTicks: true,
                            },
                        ]}
                        series={[
                            {
                                data: barChartData.expenseValues,
                                label: 'Expenses',
                                color: COLORS.expense,
                                stack: 'total',
                            },
                            {
                                data: barChartData.incomeValues,
                                label: 'Income',
                                color: COLORS.income,
                                stack: 'total',
                            },
                        ]}
                        height={400}
                        margin={{ bottom: 100, left: 50, right: 20, top: 20 }}
                    />

                    <Stack direction="row" spacing={3} justifyContent="center" mt={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 20, height: 10, bgcolor: COLORS.expense, borderRadius: 1 }} />
                            <Typography variant="body2">Expense Breakdown</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 20, height: 10, bgcolor: COLORS.income, borderRadius: 1 }} />
                            <Typography variant="body2">Income Breakdown</Typography>
                        </Stack>
                    </Stack>
                </Box>

            </Box>
        </>
    )
}