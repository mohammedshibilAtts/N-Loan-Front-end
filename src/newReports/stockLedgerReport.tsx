import { Helmet } from "react-helmet-async";
import { CONFIG } from "../config-global";
import { DashboardContent } from "../layouts/dashboard";
import { Box, Card, Chip, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../components/subTable/subTable";
import { apiRequest } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINTS from "../services/endpoints";
import {
  ITEM_LIST,
  LOAN_ACC_REPORT,
  METAL_LIST,
  PURITY_LIST,
} from "../store/actionTypes";
import dayjs from "dayjs";
import { spliceDecimals } from "../const";
import DropDown from "../components/dropdown/dropdown";
import Search from "../components/search/search";
import DateRange from "../components/dateRange/dateRange";
import ImportButton from "../components/importButton/importButton";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;

const status = [
  { _id: 1, label: "IN" },
  { _id: 2, label: "OUT" },
];

export default function StockLedgerReport() {
  const dispatch = useDispatch();
  const [stockLedgerData, setStockLedgerData] = useState<any[]>([]);
  const [metals, setMetals] = useState([]);
  const [purities, setPurities] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedStockType, setSelectedSelectedStockType] = useState(null);

  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedPurity, setSelectedPurity] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { loanAccountResData, metalList, purityList, itemList } = useSelector(
    (states: any) => ({
      loanAccountResData: states[LOAN_ACC_REPORT]?.data,
      metalList: states[METAL_LIST]?.data,
      purityList: states[PURITY_LIST]?.data,
      itemList: states[ITEM_LIST]?.data,
    })
  );

  useEffect(() => {
    dispatch(
      apiRequest(METAL_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "metal",
          filters: {
            active: true,
          },
          aggregationPipeline: [{ $project: { metalName: 1, _id: 1 } }],
        },
      })
    );
    dispatch(
      apiRequest(PURITY_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "purity",
          filters: {
            active: true,
          },
          aggregationPipeline: [{ $project: { purityName: 1, _id: 1 } }],
        },
      })
    );
    dispatch(
      apiRequest(ITEM_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "items",
          filters: {
            active: true,
          },
          aggregationPipeline: [{ $project: { itemName: 1, _id: 1 } }],
        },
      })
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(
      apiRequest(LOAN_ACC_REPORT, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "Reports",
        params: {
          tableName: "stockLedgerReport",
          filters: {
            metalId: selectedMetal,
            purityId: selectedPurity,
            stockType: selectedStockType,
            itemId: selectedItem,
          },
          page: page + 1,
          limit: rowsPerPage,
          search,
          fromDate: dateRange.startDate,
          toDate: dateRange.endDate,
        },
      })
    );
  }, [
    selectedStockType,
    selectedMetal,
    selectedPurity,
    selectedItem,
    search,
    dateRange,
    rowsPerPage,
    page,
  ]);

  useEffect(() => {
    if (loanAccountResData?.success) {
      setStockLedgerData(loanAccountResData.data.data);
      setTotalCount(loanAccountResData.data.pagination.totalRecords || 0);
      setLoading(false);
    } else {
      setLoading(false);
    }
    if (metalList?.success) {
      setMetals(metalList.data.data);
    }
    if (purityList?.success) {
      setPurities(purityList.data.data);
    }
    if (itemList?.success) {
      setItems(itemList.data.data);
    }
  }, [loanAccountResData, metalList, purityList, itemList]);

  const wtDecimal = (amount: number) => {
    return spliceDecimals(amount, 3);
  };

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "loanNo", label: "Loan No" },
    { id: "customerName", label: "Customer Name" },
    { id: "tagId", label: "Tag No" },
    { id: "metalName", label: "Metal Name" },
    { id: "purityName", label: "Purity Name" },
    { id: "itemName", label: "Item Name" },
    { id: "stockType", label: "Stock Type" },
    { id: "grossWt", label: "Gross Wt" },
    { id: "netWt", label: "Net Wt" },
    { id: "createdAt", label: "Created Date" },
  ];

  const stockTypeBadge = (stockType: number) => {
    const config: Record<
      number,
      { label: string; color: "success" | "error" | "default" }
    > = {
      1: { label: "IN", color: "success" },
      2: { label: "OUT", color: "error" },
    };

    const { label, color } = config[stockType] || {
      label: "N/A",
      color: "default",
    };

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{
          width: 64, // 🔒 fixed width
          height: 26, // 🔒 fixed height
          fontSize: "11px",
          fontWeight: 600,
          textAlign: "center",
          "& .MuiChip-label": {
            padding: 0,
            width: "100%",
          },
        }}
      />
    );
  };

  const columnsData = stockLedgerData?.map((item: any, index: any) => ({
    id: (page * rowsPerPage) + index + 1,
    loanNo: item.loanNo,
    customerName: item.customerName,
    tagId: item.tagId,
    metalName: item.metalName,
    purityName: item.purityName,
    itemName: item.itemName,
    stockType: stockTypeBadge(item.stockType),
    grossWt: `${wtDecimal(item.grossWt)}g`,
    netWt: `${wtDecimal(item.netWt)}g`,
    createdAt: item.createdAt
      ? dayjs(item.createdAt).format("DD/MM/YYYY")
      : "-",
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
            tableName: "exportStockLedgerReport",
            filters: {
              metalId: selectedMetal,
              purityId: selectedPurity,
              stockType: selectedStockType,
              itemId: selectedItem,
            },
            search,
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
      a.download = "StockLedgerReport.xlsx";
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
            <span className="text-[#737791]">Reports</span> / Stock Ledger
            Report
          </Typography>
        </Box>

        <Card sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                  Stock Ledger Report
                </Typography>

                <Box>
                  <Box display="flex" gap={0.6} mt={1} flexWrap="wrap">
                    <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
                      <DropDown
                        label="Metal"
                        value={selectedMetal}
                        options={metals}
                        optionLabel="metalName"
                        optionValue="_id"
                        onChange={(e) => setSelectedMetal(e.target.value)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
                      <DropDown
                        label="Purity"
                        value={selectedPurity}
                        options={purities}
                        optionLabel="purityName"
                        optionValue="_id"
                        onChange={(e) => setSelectedPurity(e.target.value)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ minWidth: "250px", maxWidth: "300px" }}>
                      <DropDown
                        label="Item"
                        value={selectedItem}
                        options={items}
                        optionLabel="itemName"
                        optionValue="_id"
                        onChange={(e) => setSelectedItem(e.target.value)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ minWidth: "200px", maxWidth: "200px" }}>
                      <DropDown
                        label="Stock Type"
                        value={selectedStockType}
                        options={status}
                        optionLabel="label"
                        optionValue="_id"
                        onChange={(e) =>
                          setSelectedSelectedStockType(e.target.value)
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
                      {stockLedgerData.length > 0 && (
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
