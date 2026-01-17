import {
  Box,
  Stack,

} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_CASH,
  BRANCH_LIST,
  DAY_CASH,
  DAILY_CASH_TABLE
} from "../../../store/actionTypes";
import API_ENDPOINTS from "../../../services/endpoints";
import { apiClear, apiRequest } from "../../../store/actions";
import { DataTable } from "../../../components/datatable/datatableComp";
import { ChartsGrid } from "@mui/x-charts/ChartsGrid";
import CashEntriesForm from "./CashEntriesForm";
import { Breadcrumb } from "../../../components/breadCrumbComp";
// import { Store,ChevronDown } from "lucide-react";


export type BarChartData = {
  weekStart: string;
  dayName: string;
  open: number;
  close: number;
  in: number;
  out: number;
};

const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function chartSeries(data: BarChartData[]) {

  const dayMap = new Map<string, BarChartData>();

  for (const entry of data) {
    // Override with latest if needed; can customize if needed
    dayMap.set(entry.dayName, entry);
  }

  const open: number[] = [], close: number[] = [], inVal: number[] = [], out: number[] = [];

  for (const day of fullDays) {
    const row = dayMap.get(day);
    open.push(row?.open || 0);
    close.push(row?.close || 0);
    inVal.push(row?.in || 0);
    out.push(row?.out || 0);
  }

  return {
    xAxisDays: shortDays,
    series: [
      { data: open, label: "Open", color: "#ECE8FE" },
      { data: close, label: "Close", color: "#FECC5D" },
      { data: inVal, label: "In", color: "#E4C1FF" },
      { data: out, label: "Out", color: "#A998FD" },
    ],
  };
}


function DaliyCashUpdate() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setEdit] = useState<any>(false);
  const [data, setData] = useState<any[]>([]);

 
  const [chartdata, setChartData] = useState<any[]>([]);

  //  const [filterValues, setFilterValues] = useState<{ [key: string]: any }>({});


  // const [branchData, setBranchData] = useState<
  //   { branchName: string; _id: string }[]
  // >([]);

  const handleModal = (row: any) => {
    setEdit(true);
    setData(row)
  };



  const { xAxisDays, series } = chartSeries(chartdata || []);


  useEffect(() => {
    dispatch(
      apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "branch" },
      })
    );
  }, [dispatch]);

  const { branchList } = useSelector((states: any) => ({
    branchList: states[BRANCH_LIST]?.data,
  }));


  // const getOptionsForField = (fieldName: string) => {
  //   return branchData.map((option) => ({
  //     label: option.branchName,
  //     value: option._id,
  //   }));
  // };


  const {
    // updateAmountRes,
    chartRes,
  } = useSelector((states: any) => ({
    // updateAmountRes: states[UPDATE_CASH]?.data,
    chartRes: states[DAY_CASH]?.data,
  }));

  useEffect(() => {
    dispatch(apiClear(UPDATE_CASH));
    dispatch(apiClear(DAY_CASH));
    dispatch(apiClear(BRANCH_LIST));

    return () => {
      dispatch(apiClear(UPDATE_CASH));
      dispatch(apiClear(BRANCH_LIST));
      dispatch(apiClear(DAY_CASH));

    };
  }, [dispatch]);


  useEffect(() => {
    // if (branchList?.success) {
    //   setBranchData(branchList.data.data);
    // }

    if (chartRes?.success) {
      setChartData(chartRes.data);
    }

  }, [branchList, chartRes]);



  useEffect(() => {

    dispatch(apiRequest(BRANCH_LIST, 'post', API_ENDPOINTS.SP.POST, { procedureName: 'findAll', params: { tableName: 'branch' } }));
    dispatch(apiRequest(DAY_CASH, 'post', API_ENDPOINTS.SP.POST, { procedureName: 'dailyCashFlow', params: { tableName: 'Payment', table_type: "reports-dailyCashFlow" } }));
    
    
  }, [dispatch]);


  const handleFormSubmitSuccess = () => {
   
    setEdit(false);
    setIsLoading(false);
  };

  const handleCloseForm = () => {
  
    setEdit(false);
    setIsLoading(false);
  };



  return (
    <>
    <Box px={5}>
         <Stack direction="row" alignItems="center" mb={2} flexGrow={1} >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "Daily Cash Update", active: true },
              ]}
            />
          </Stack>
        </Stack>

    </Box>
      <Box display="flex" alignItems="center">
         
        {/* <Autocomplete
                  options={getOptionsForField("branch")}
                  getOptionLabel={(option) => option.label}
                  value={
                    getOptionsForField("branch").find(
                      (opt) => opt.value === filterValues["branch"]
                    ) || null
                  }
                  onChange={(_, value) => {
                    setFilterValues(() => ({
                      branch: value ? value.value : "",
                    }));
                  }}
                  popupIcon={<ChevronDown size={20} color="#000" />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Branch"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                backgroundColor: "#FFF6D6",
                                padding: "6px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 1,
                              }}
                            >
                              <Store size={18} color="#FFC107" />
                            </Box>
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          border: 2,
                          borderColor: "#F5F5F5",
                          paddingLeft: "4px",
                          height: 44,
                        },
                        "& .MuiInputBase-input": {
                          fontWeight: 600,
                          fontSize: "16px",
                          "&::placeholder": {
                            color: "#000",
                            opacity: 1,
                            fontWeight: 500,
                            fontSize: "16px",
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  )}
                  sx={{ width: 235 }}
                /> */}
      </Box>
      <Box
        sx={{
          mt: 3,
          p: 1,
          mx: 4,
          backgroundColor: "white",
          borderRadius: 2,
          width: "60%",
          borderBlockColor: "#F2F2F9",
          height: "30%",
        }}
      >


        <BarChart
          sx={{ zIndex: "100px" }}
          borderRadius={4}
          xAxis={[
            {
              id: "days",
              data: xAxisDays,
              scaleType: "band",
              disableLine: true,
              disableTicks: true,
              barGapRatio: 0,
              categoryGapRatio: 0.3,
            },
          ]}
          yAxis={[
            {
              min: 0,
              disableLine: true,
              disableTicks: true,
              barGapRatio: 0.1,
            },
          ]}
          series={series}
          height={400}
          slotProps={{
            legend: {
              direction: "vertical",
              position: { vertical: "middle", horizontal: "center" },
            },
          }}
        >
          <ChartsGrid
            horizontal
            sx={{
              line: {
                stroke: "#ccc",
                strokeDasharray: "4 4",
              },
              zIndex: 0,
            }}
          />
        </BarChart>

      </Box>

      {/* Data Table Section */}
      <Box
        component="table"
        sx={{
          my: 4,
          p: 9,
          mx: 4,
          backgroundColor: "white",
          borderRadius: 2,

        }}
      >
        <DataTable
          actionType={DAILY_CASH_TABLE}
          endpoint={API_ENDPOINTS.SP.POST}
          tableName="Payment"
          procedureName="cashFlow"
          table_type="reports-cashFlowTable"
          filters={{}}
          isLoading={isLoading}
          search_visiblity={false}
          pagination={false}
          tableTitle="Daily Cash Update"
          onEdit={handleModal}
        />

        {isEdit && (
          <CashEntriesForm
          
            onClose={handleCloseForm}
            data={data}
            onSubmitSuccess={handleFormSubmitSuccess}
          />
        )}


      </Box>

    </>
  );
}

export default DaliyCashUpdate;
