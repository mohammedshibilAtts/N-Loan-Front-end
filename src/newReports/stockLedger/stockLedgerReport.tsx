import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../config-global";
import { DashboardContent } from "../../layouts/dashboard";
import { Box, Card, Chip, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubTable from "../../components/subTable/subTable";
import dayjs from "dayjs";
import { spliceDecimals } from "../../const";
import DropDown from "../../components/dropdown/dropdown";
import Search from "../../components/search/search";
import DateRange from "../../components/dateRange/dateRange";
import ImportButton from "../../components/importButton/importButton";
import { useStockLedger } from "./useStockLedger";

const status = [
    { _id: 1, label: "IN" },
    { _id: 2, label: "OUT" },
];

export default function StockLedgerReport() {
    const {
        stockLedgerData,
        loading,
        totalCount,
        metalsList,
        puritiesList,
        itemsList,
        fetchStockLedgerReport,
        exportStockLedgerExcel,
    } = useStockLedger();

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

    useEffect(() => {
        const payload = {
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
            fromDate: dateRange.startDate ? dayjs(dateRange.startDate).format("YYYY-MM-DD") : null,
            toDate: dateRange.endDate ? dayjs(dateRange.endDate).format("YYYY-MM-DD") : null,
        };
        fetchStockLedgerReport(payload);
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
                    width: 64,
                    height: 26,
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

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleExport = () => {
        const payload = {
            tableName: "exportStockLedgerReport",
            filters: {
                metalId: selectedMetal,
                purityId: selectedPurity,
                stockType: selectedStockType,
                itemId: selectedItem,
            },
            search,
            fromDate: dateRange.startDate ? dayjs(dateRange.startDate).format("YYYY-MM-DD") : null,
            toDate: dateRange.endDate ? dayjs(dateRange.endDate).format("YYYY-MM-DD") : null,
        };
        exportStockLedgerExcel(payload);
    };

    return (
        <>
            <Helmet>
                <title>{`Reports - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent>
                <Box display="flex" alignItems="center" mb={5}>
                    <Typography variant="h6" flexGrow={1} marginLeft={2}>
                        <span className="text-[#737791]">Reports</span> / Stock Ledger Report
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
                                                options={metalsList}
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
                                                options={puritiesList}
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
                                                options={itemsList}
                                                optionLabel="itemName"
                                                optionValue="_id"
                                                onChange={(e) => setSelectedItem(e.target.value)}
                                                size="small"
                                            />
                                        </Box>
                                        <Box sx={{ minWidth: "250px", maxWidth: "200px" }}>
                                            <DropDown
                                                label="Stock Type"
                                                value={selectedStockType}
                                                options={status}
                                                optionLabel="label"
                                                optionValue="_id"
                                                onChange={(e) => setSelectedSelectedStockType(e.target.value)}
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
