import React from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Icon } from "@iconify/react";
import searchIcon from "@iconify/icons-eva/search-fill";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

// Filter Imports
import { ItemWiseFilter } from "../../../../reports/inventory reports/ItemWiseReports";
import { ExpenseEntriesFilter } from "../../../../pages/expense/expenseEntries/expenseEntriesTable";
import { BranchWiseFilter } from "../../../../reports/inventory reports/MetalWiseReports";
import { LoanHistoryFilter } from "../../../../reports/inventory reports/LoanHistory";
import { LoanReportFilter } from "../../../../reports/accounts reports/LoanReports";
import { InterestCollectionFilter } from "../../../../reports/accounts reports/InterestCollection";
import { TransactionFilter } from "../../../../reports/accounts reports/transactionReports";

import ExportDropdown from "../../../export/Export";
import { Column } from "../types";

interface TableToolbarProps {
    tableTitle?: string;
    search: string;
    handleSearch: (val: string) => void;
    search_visiblity?: boolean;
    table_type?: string | null;
    tableName: string;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    handleStartDateChange: (date: Dayjs | null) => void;
    handleEndDateChange: (date: Dayjs | null) => void;
    handleDropdownChange: (field: string, val: any) => void;
    exportOptions?: boolean;
    data: any[];
    columns: Column[];
    printRef: React.RefObject<HTMLTableElement>;
    anchorElMap: any;
    setAnchorElMap: any;
    page: number;
    rowsPerPage: number;
}

export const TableToolbar = ({
    tableTitle,
    search,
    handleSearch,
    search_visiblity,
    table_type,
    tableName,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleDropdownChange,
    exportOptions,
    data,
    columns,
    printRef,
    anchorElMap,
    setAnchorElMap,
    page,
    rowsPerPage,
}: TableToolbarProps) => {

    const filterValues = (): React.ReactNode => {
        switch (table_type) {
            case "reports-itemWise":
                return <ItemWiseFilter onFilterChange={handleDropdownChange} />;
            case "expenseEntries-table":
                return <ExpenseEntriesFilter onFilterChange={handleDropdownChange} />;
            case "reports-loanHistory":
                return <LoanHistoryFilter onFilterChange={handleDropdownChange} />;
            case "reports-loanReport":
                return <LoanReportFilter onFilterChange={handleDropdownChange} />;
            case "reports-interstCollectionreport":
                return <InterestCollectionFilter onFilterChange={handleDropdownChange} />;
            case "reports-transactionreports":
                return <TransactionFilter onFilterChange={handleDropdownChange} />;
            default:
                return null;
        }
    };

    const branchValues = (): React.ReactNode => {
        const filterTypes = [
            "reports-metalWise",
            "reports-stockLedger",
            "reports-recoveryItem",
            "reports-overDue",
            "reports-itemHistory",
            "reports-customerReport",
            "reports-cashFlow",
            "reports-loanAccountReport",
            "reports-paymentModeLedger",
            "lockers",
        ];

        if (typeof table_type === "string" && filterTypes.includes(table_type)) {
            return <BranchWiseFilter onFilterChange={handleDropdownChange} />;
        }
        return null;
    };

    const getNestedValue = (obj: any, path: any) => {
        return path?.split(".").reduce((acc: any, key: any) => (acc && acc[key] ? acc[key] : ""), obj) || "";
    };

    // const closedThrough = [
    //     { label: "By Customer", value: 0 },
    //     { label: "By Auction", value: 1 },
    // ];
    // Assuming closedThrough is same as in const.ts, I should probably import it instead of redefining
    // But to keep this pure function here I'll use logic. actually best to import closedThrough from consts if possible, or duplicate for now safely.

    const getFormattedExportData = () => {
        const cleanCurrency = (value: any) => {
            if (typeof value === "string") {
                return value.replace(/[₹¹²³⁴⁵⁶⁷⁸⁹⁰,]/g, "").trim();
            }
            return value;
        };

        return data.map((row: any, index: number) => {
            const formattedRow: Record<string, any> = {};

            columns.forEach((column: Column) => {
                let value: any;

                if (column.type === "auto") {
                    value = page * rowsPerPage + index + 1;
                } else if (column.id === "status") {
                    value = row.status ? "Active" : "Inactive";
                } else if (column.id === "loanStatus") {
                    const status = Number(row?.loanStatus);
                    value = status === 0 ? "Open" : "Closed";
                } else if (
                    column.id === "closingType" ||
                    (column.id === "close" && table_type === "reports-cashFlowTable")
                ) {
                    // Basic fallback mapping if imported constant is not available here easily without prop drilling
                    // ideally we import it.
                    value = row?.closingType === 0 ? "By Customer" : row?.closingType === 1 ? "By Auction" : "";
                } else {
                    // We can't reuse CellRenderer logic easily here without exporting it as a helper
                    // For now we use getNestedValue. The original key logic was handleFormat. 
                    // Ideally handleFormat should be a helper function in a utils file.
                    // For simplicity, we just dump the raw value or simple nested value
                    value = getNestedValue(row, column.id);
                }

                if (
                    column.type === "currency" ||
                    column.id.toLowerCase().includes("amount") ||
                    column.id.toLowerCase().includes("balance") ||
                    column.id.toLowerCase().includes("paid")
                ) {
                    value = cleanCurrency(value);
                }

                formattedRow[column.label || column.id] = value;
            });

            return formattedRow;
        });
    };

    const showDateFilters =
        table_type?.includes("reports") ||
        table_type === "expenseEntries-table" ||
        tableName === "locker";

    return (
        <>
            {tableTitle && (
                <Box
                    sx={{
                        display: "flex",
                        flex: "6",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        px: 1,
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "black",
                            textAlign: "start",
                            fontSize: "18px",
                            fontWeight: "semi-bold",
                        }}
                    >
                        {tableTitle}
                    </Typography>
                </Box>
            )}

            <Box mx={3} mt={3}>
                {filterValues()}
            </Box>

            {showDateFilters ? (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                    gap={2}
                >
                    <Box my={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    <DatePicker
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: "medium", sx: { width: 156 } } }}
                                    />
                                    <Typography>to</Typography>
                                    <DatePicker
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: "medium", sx: { width: 156 } } }}
                                    />
                                </Box>
                            </Box>
                        </LocalizationProvider>
                    </Box>

                    <Box my={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                            {(table_type?.includes("reports") || tableName === "locker") && (
                                <Box sx={{ width: "200px" }}>{branchValues()}</Box>
                            )}

                            {search_visiblity && (
                                <TextField
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    InputProps={{
                                        sx: { height: "54px" },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Icon icon={searchIcon} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ maxWidth: 300 }}
                                />
                            )}

                            {(table_type?.includes("reports") ||
                                table_type?.includes("expenseEntries")) &&
                                exportOptions && (
                                    <ExportDropdown
                                        data={getFormattedExportData()}
                                        tableName={tableName}
                                        columns={columns}
                                        anchorElMap={anchorElMap}
                                        setAnchorElMap={setAnchorElMap}
                                        printRef={printRef}
                                    />
                                )}
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="end" my={3} gap={2}>
                    {search_visiblity && (
                        <TextField
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            InputProps={{
                                sx: { height: "50px" },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Icon icon={searchIcon} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ maxWidth: 300 }}
                        />
                    )}

                    {table_type?.includes("reports") && exportOptions && (
                        <ExportDropdown
                            data={getFormattedExportData()}
                            tableName={tableName}
                            columns={columns}
                            anchorElMap={anchorElMap}
                            setAnchorElMap={setAnchorElMap}
                            printRef={printRef}
                        />
                    )}
                </Box>
            )}
        </>
    );
};
