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
import DateFilter from '../../components/dateFilterDropdown/DateFilter';
import { apiClear, apiRequest } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINTS from "../../services/endpoints";
import { EXPENSE_INCOME_REPORT_RES } from "../../store/actionTypes";
import { formatNumber } from '../../utils/commonFunction';


ChartJS.register(ArcElement, Tooltip, Legend);

type DayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

type WeeklyReportItem = {
  day: DayName;
  income: number;
  expense: number;
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


const dayShortNames: Record<DayName, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

export default function ExpensesReport() {


  const [selectedOption, setSelectedOption] = useState('thisMonth');
  const [Data, setData] = useState<any>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [days, setDays] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<number[]>([]);
  const [incomes, setIncomes] = useState<number[]>([]);

  const dispatch = useDispatch();

  const handleDateChange = (option: string, range: { start: string; end: string }) => {
    setSelectedOption(option);
    setDateRange(range);

  };

  useEffect(() => {
    if (!Data?.weeklyReport) return;

    const transformedDays: string[] = Data.weeklyReport.map((item: WeeklyReportItem) => {
      const day = item.day as DayName;
      return dayShortNames[day];
    });

    const transformedExpenses: number[] = Data.weeklyReport.map((item: WeeklyReportItem) => item.expense);
    const transformedIncomes: number[] = Data.weeklyReport.map((item: WeeklyReportItem) => item.income);

    setDays(transformedDays);
    setExpenses(transformedExpenses);
    setIncomes(transformedIncomes);
  }, [Data]);

  const maxY = Math.max(...expenses, ...incomes, 0) + 100;

  const data = {
    labels: ['Expense', 'Income'],
    datasets: [
      {
        data: [Data.expensePercentage, Data.incomePercentage],
        backgroundColor: ['#F4A825', '#EAEAEA'],
        borderWidth: 0,
        borderRadius: [0, 0],
        spacing: 0,
        cutout: '75%',
      },
    ],
  };

  const { expenseIncome } = useSelector(
    (states: any) => ({
      expenseIncome: states[EXPENSE_INCOME_REPORT_RES]?.data,
    })
  );

  useEffect(() => {
    dispatch(apiClear(EXPENSE_INCOME_REPORT_RES));

    return () => {
      dispatch(apiClear(EXPENSE_INCOME_REPORT_RES));
    };
  }, [dispatch]);

  useEffect(() => {
    const data = {
      procedureName: "find",
      params: {
        tableName: "loanAccount",
        table_type: "reports-IncomeExpenses",
        filters: {
          fromDate: dateRange.start,
          toDate: dateRange.end
        },

      },
    };

    dispatch(
      apiRequest(EXPENSE_INCOME_REPORT_RES, "post", API_ENDPOINTS.SP.POST, data)
    );
  }, [dispatch, selectedOption])


  useEffect(() => {
    if (expenseIncome?.success) {
      setData(expenseIncome.data);
    }
  }, [expenseIncome]);



  return (
    <>

      <Box sx={{
        mx: 2,
        display: {
          xs: 'block',
          sm: 'flex',
        },
        flexDirection: {
          xs: 'column',
          lg: 'row',
        },
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>

        <Box
          sx={{
            mt: 4,
            p: 3,

            backgroundColor: "white",
            borderRadius: 2,
            width: {
              xs: '100%',
              md: '40%',
            },
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
              <Typography color="gray" variant="body2">
                Statistics of the month
              </Typography>
            </Box>

            <Box sx={{ px: 1.5, py: 0.5, fontSize: '14px' }}>
              <DateFilter value={selectedOption} onChange={handleDateChange} />
            </Box>
          </Box>

          {/* Expense and Received Amount Information */}
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap:2,
             alignItems: 'center',

            }}
          >
            <Stack direction="row" alignItems="center"  spacing={1}>
              <Box sx={{ width: 20, height: 10, bgcolor: '#F4A825', borderRadius: 1 }} />
              <Typography fontSize={14}>Expense Amount</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 20, height: 10, bgcolor: '#EAEAEA', borderRadius: 1 }} />
              <Typography fontSize={14}>Received Amount</Typography>
            </Stack>
          </Box>

          {/* Chart Container */}
          <Box
            position="relative"
            width="100%"
            maxWidth={800}
            height={220}
            mx="auto"
            mt={6}
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >

            <Doughnut data={data} options={options} />


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
              <Typography fontWeight={700}>{formatNumber({ value: Data.finalExpense, decimalPlaces: 0 })}</Typography>
              <Typography fontSize={13} color="gray">Expense Amount</Typography>
            </Box>
            <Box textAlign="center">
              <Typography fontWeight={700}>{formatNumber({ value: Data.finalIncome, decimalPlaces: 0 })}</Typography>
              <Typography fontSize={13} color="gray">Received Amount</Typography>
            </Box>
            <Box textAlign="center">
              <Typography fontWeight={700}>{formatNumber({ value: Data.netAmount, decimalPlaces: 0 })}</Typography>
              <Typography fontSize={13} color="gray">Net Amount</Typography>
            </Box>

          </Box>

        </Box>


        <Box
          sx={{
            mt: 2,
            p: 3,
            mx: 4,
            backgroundColor: "white",
            borderRadius: 2,
            width: {
              xs: '100%',
              md: '60%',
            },


          }}
        >
          <Box sx={{
            mt:1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>

            <Stack direction="row" justifyContent="space-between" alignItems="start">
              <Typography variant="h6" fontWeight={700} marginTop={0.5}>Income & Expenses</Typography>
            </Stack>

            {/* <Box sx={{ px: 1.5, py: 0.5, fontSize: '14px' }}>
              <DateFilter value={selectedOption} onChange={handleDateChange} />
            </Box> */}


          </Box>

          <BarChart
            sx={{
              mt: 8,
              '& .MuiChartsAxis-line': { display: 'none' },
              '& .MuiChartsAxis-tick': { display: 'none' },
            }}
            borderRadius={4}
            hideLegend={true}
            xAxis={[
              {
                id: 'days',
                data: days,
                scaleType: 'band',
                disableLine: true,
                disableTicks: true,
                categoryGapRatio: 0.3,
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
                data: expenses,
                label: 'Expenses',
                color: '#F4A825',
              },
              {
                data: incomes,
                label: 'Received',
                color: '#EAEAEA',
              },
            ]}
            height={300}
          />

          <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 20, height: 10, bgcolor: '#F4A825', borderRadius: 1 }} />
              <Typography variant="body2">Expense Amount</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 20, height: 10, bgcolor: '#EAEAEA', borderRadius: 1 }} />
              <Typography variant="body2">Received Amount</Typography>
            </Stack>
          </Stack>
        </Box>



      </Box>


    </>
  )
}