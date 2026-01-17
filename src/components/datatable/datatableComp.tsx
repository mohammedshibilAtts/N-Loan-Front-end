import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { METAL_LIST, PURITY_LIST, ITEM_LIST, BRANCH_LIST } from '../../store/actionTypes';
import "jspdf-autotable";
import { Icon } from "@iconify/react";
import { closedThrough } from "../../const";
import searchIcon from "@iconify/icons-eva/search-fill";
import arrowUpward from "@iconify/icons-eva/arrow-upward-fill";
import arrowDownward from "@iconify/icons-eva/arrow-downward-fill";
// import excelIcon from "@iconify/icons-mdi/microsoft-excel";
// import csvIcon from "@iconify/icons-mdi/file-delimited";
// import pdfIcon from "@iconify/icons-mdi/file-pdf-box";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import norecords from "../../../src-tauri/icons/norecords.svg";
// import View from "../../../public/assets/icons/view.svg";
// import Edit from "../../../public/assets/icons/edit.svg";
// import Delete from "../../../public/assets/icons/delete.svg";
import ExportDropdown from "../export/Export";
import dayjs from "dayjs";
// import {itemWise} from "./ReportFields"

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Button,
  LinearProgress,
  linearProgressClasses,
  // Autocomplete,
  // Grid
} from "@mui/material";

// Redux actions and selectors
import { apiRequest, apiClear } from "../../store/actions";
import API_ENDPOINTS from "../../services/endpoints";
import { ToastContainer } from "react-toastify";
import { formatNumber } from "../../utils/commonFunction";
import { ItemWiseFilter } from "../../reports/inventory reports/ItemWiseReports";
// import { ExpenseEntriesFilter } from "../../pages/expense/expenseEntries/expenseEntriesTable";
import { BranchWiseFilter } from "../../reports/inventory reports/MetalWiseReports";
import { LoanHistoryFilter } from "../../reports/inventory reports/LoanHistory";
import { LoanReportFilter } from "../../reports/accounts reports/LoanReports";
import { InterestCollectionFilter } from "../../reports/accounts reports/InterestCollection";
import { ItemCreationFilter } from "../../pages/master/itemCreation/ItemCreationFilter";
import { TransactionFilter } from "../../reports/accounts reports/transactionReports";
import { Toast } from "../toast/toast";
import DateRange from "../dateRange/dateRange";
import CustomPagination from "../pagination/pagination";
// import { GET_USER_ACCESS } from "../../store/actionTypes";
// import { useLocation } from "react-router-dom";
// import { ChevronDown } from "lucide-react";

// ----------------------------------------------------------------------
interface StatusStyle {
  bg: string;
  text: string;
}

type Column = {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  type?: string; // Column type (e.g., 'date', 'text', etc.)
  formatValue?: string; // Format for date columns (e.g., 'DD-MM-YYYY HH:MM:SS')
  render?: (value: any, row: any) => React.ReactNode; // Custom render function for the column
  isFilterable?: boolean; // Enable individual column filter
  joinFields: any;
  formatNumber: any;
  staticValue: any;
  format?: string;
};

type DataTableProps = {
  procedureName?: string; //customized procedureName
  endpoint: string; // API endpoint for fetching data
  actionType: string;
  tableName: string; // Table name for the API call
  filters?: Record<string, any>; // Initial filters
  defaultSort?: { field: string; order: "asc" | "desc" }; // Default sorting
  exportOptions?: boolean; // Enable export options
  onView?: (row: any) => void; // Function to handle view action
  onAuction?: (row: any) => void; // Function to handle view action
  onEdit?: (row: any) => void; // Function to handle edit action
  onDelete?: (row: any) => void; // Function to handle delete action
  onPrint?: (row: any) => void; // Function to handle delete action
  populateFields?: any[];
  aggregateFields?: Record<string, any>;
  isPopulated?: boolean;
  statusType?: string;
  action?: boolean;
  isLoading?: boolean;
  activeStatus?: boolean | null;
  table_type?: string | null;
  search_visiblity?: boolean;
  style?: any;
  tableTitle?: string;
  pagination?: boolean;
};

export function DataTable({
  endpoint,
  actionType,
  tableName,
  procedureName = "find",
  filters = {},
  defaultSort = { field: "createdAt", order: "desc" },
  exportOptions = false,
  isLoading,
  table_type,
  // activeStatus = null,
  onView,
  onEdit,
  onDelete,
  onAuction,
  onPrint,
  aggregateFields = {},
  isPopulated,
  populateFields = [""],
  statusType,
  action = true,
  search_visiblity = true,
  style,
  tableTitle,
  pagination = true,
}: DataTableProps) {
  const dispatch = useDispatch();
  // const location = useLocation();
  // const currentPath = location.pathname;
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  // const [isSearch, setIsSearch] = useState<boolean | null>(true);
  const [isStatus, setIsStatus] = useState<boolean | null>(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<"asc" | "desc">(defaultSort.order);
  const [orderBy, setOrderBy] = useState<string>(defaultSort.field);
  // const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>("");
  const [actions, setActions] = useState<string[]>([]); // Store actions (V, E, D)
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [tablefilters, setTableFilters] = React.useState(filters || {});
  // const [startDateError, setStartDateError] = useState<string | null>(null);
  // const [endDateError, setEndDateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  let [dropdownfilters, setDropdownFilters] = useState<Record<string, any>>({});

  const printRef = useRef<HTMLTableElement>(null);

  // Track anchorEl for each row
  const [anchorElMap, setAnchorElMap] = useState<
    Record<string, HTMLElement | null>
  >({});

  // checking permit like edit delete view
  // const [access, setAccess] = useState<any>([]);

  // const { accessData } = useSelector((states: any) => ({
  //   accessData: states[GET_USER_ACCESS]?.data,
  // }));

  // useEffect(() => {
  //   if (accessData?.success) {
  //     setAccess(accessData.data);
  //   }
  // }, [accessData]);
  useEffect(() => {
    const newFilters = { ...dropdownfilters, ...filters };

    if (table_type?.includes("reports")) {
      if (startDate)
        newFilters.fromDate = dayjs(startDate).startOf("day").toISOString();
      if (endDate)
        newFilters.toDate = dayjs(endDate).endOf("day").toISOString();
    } else if (table_type?.includes("expenseEntries")) {
      newFilters.expenseDate = {};
      if (startDate)
        newFilters.expenseDate.$gte = dayjs(startDate)
          .startOf("day")
          .toISOString();
      if (endDate)
        newFilters.expenseDate.$lte = dayjs(endDate).endOf("day").toISOString();
    }
    else if (tableName == "locker") {
      newFilters.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    setTableFilters(newFilters);
  }, [startDate, endDate, dropdownfilters, table_type]);

  // const matchedSubMenu = access
  //   ?.flatMap((menu: any) => menu.children || [])
  //   .find((child: any) => child.path === currentPath);

  // const canView = matchedSubMenu?.viewPermit;
  // const canEdit = matchedSubMenu?.editPermit;
  // const canDelete = matchedSubMenu?.deletePermit;
  const canView = true;
  const canEdit = true;
  const canDelete = true;
  const canPrint = true;

  const statusStyles: Record<string, StatusStyle> = {
    Open: {
      bg: "#12B76A38",
      text: "#12B76A",
    },
    Closed: {
      bg: "#FF000038",
      text: "#FF0000",
    },
  };

  // Redux state selector
  const { dataTableResult, updateFields } = useSelector((state: any) => ({
    dataTableResult: state[actionType]?.data,
    updateFields: statusType ? state[statusType]?.data : undefined,
  }));
  const refetchTable = useSelector((state: any) => state?.refetchTable);

  // Fetch data from the server using Redux
  const fetchData = useCallback(async () => {
    try {
      console.log({ tablefilters });
      const data = {
        procedureName: procedureName,
        params: {
          tableName,
          table_type: table_type === "itemCreation-table" ? "" : table_type,
          // filters: { ...(filters || {}), ...columnFilters },
          filters: { ...(tablefilters || {}) },
          sort: { [orderBy]: order === "asc" ? 1 : -1 },
          page: page + 1,
          limit: rowsPerPage,
          search,
          populateFields: populateFields,
          aggregateFields,
          isPopulated,
        },
      };

      dispatch(apiRequest(actionType, "post", endpoint, data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [
    dispatch,
    endpoint,
    tableName,
    table_type,
    tablefilters,
    // columnFilters,
    search,
    orderBy,
    order,
    page,
    rowsPerPage,
    actionType,
    populateFields,
    refetchTable,
  ]);

  // useEffect(() => {

  //   if (Object.keys(filters).length > 0 || Object.keys(columnFilters).length > 0 || search !== "") {
  //     fetchData();
  //   }
  // }, [filters,columnFilters,search])

  // Listen to Redux state changes
  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex="1 1 auto"
      >
        <LinearProgress
          sx={{
            width: 1,
            maxWidth: 320,
            [`& .${linearProgressClasses.bar}`]: { bgcolor: "text.primary" },
          }}
        />
      </Box>
    );
  }
  useEffect(() => {
    if (dataTableResult?.success) {
      console.log(
        "--------------------------------------------------------------"
      );
      setLoading(false);
      let tblHeader = dataTableResult?.tblHeader;
      console.log("tblHeader", tblHeader);

      if (tableName === "expense") {
        tblHeader = tblHeader?.filter(
          (item: any) =>
            item.tableName === "expense" || item.title === "Expense"
        );
      }

      let apiData = dataTableResult?.data?.data;

      if (tableName === "Payment" && table_type === "reports-cashFlowTable") {
        apiData = dataTableResult.data.summary;
      }

      // Extract columns from tblHeader
      let dynamicColumns = tblHeader?.[0]?.columns?.map((col: any) => ({
        id: col.column_name,
        label: col.column_heading,
        align: col.align || "left",
        type: col.type, // Add column type
        formatValue: col.formatValue, // Add formatValue for date columns
        isFilterable: col.is_filter,
        format: col.format,
        joinFields: col.joinFields,
        formatNumber: col.formatNumber,
        search_visiblity: (col.search_visiblity && search_visiblity) ?? true,
      })) || [];

      if (table_type === "reports-overDue" && tableName === "loanAccount") {
        dynamicColumns = dynamicColumns.map((col: any) => ({
          ...col,
          search_visiblity: false,
        }));
      }

      // Extract actions from tblHeader
      if (tblHeader?.[0]?.action) {
        setActions(tblHeader[0].action.split(",")); // Split "V,E,D" into ["V", "E", "D"]
      }

      // Extract search from tblHeader
      // if (tblHeader?.[0]) {
      //   setIsSearch(tblHeader[0]?.search_visiblity);
      // }

      if (
        tblHeader?.[0]?.show_action &&
        table_type === "reports" &&
        tableName === "loanAccount"
      ) {
        setIsStatus(true);
      }

      setColumns(dynamicColumns);
      setData(apiData);
      setTotal(dataTableResult.data.totalCount);
    }
  }, [dataTableResult]);

  useEffect(() => {
    if (!updateFields) return;
    if (updateFields?.success) {
      Toast.show({ message: "Status changed successfully", type: "success" });
    } else {
      Toast.show({ message: "Failed to change status", type: "error" });
    }

    if (statusType) {
      dispatch(apiClear(statusType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFields, dispatch]);

  // Fetch data when dependencies change

  useEffect(() => {
    fetchData();
  }, [
    page,
    rowsPerPage,
    orderBy,
    order,
    // columnFilters,
    tablefilters,
    search,
    updateFields,
    dispatch,
    isLoading,
    refetchTable,
  ]);
  // Handle sorting
  const handleSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  // Handle pagination
  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  // Handle global search
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(0);
  }, []);

  const formatDate = (date: string, formatValue: string) => {
    const parsedDate = moment(date);
    return parsedDate.isValid() ? parsedDate.format(formatValue) : date;
  };

  const getNestedValue = (obj: any, path: any) => {
    return (
      path
        ?.split(".")
        .reduce(
          (acc: any, key: any) => (acc && acc[key] ? acc[key] : ""),
          obj
        ) || ""
    );
  };

  // const getNestedValue = (obj: any, path: any) => {
  //   return path
  //     ?.split(".")
  //     .reduce((acc: any, key: any) => (acc && key in acc ? acc[key] : undefined), obj) ?? "";
  // };

  const generateSerialNumber = (
    page: number,
    rowsPerPage: number,
    index: number
  ): number => {
    return page * rowsPerPage + index + 1;
  };

  const changeStatus = (row: { status: boolean; _id: string }) => {
    if (statusType) {
      const data = {
        procedureName: "updateFields",
        params: {
          tableName: tableName,
          id: row._id,
          updateFields: { status: !row.status },
        },
      };
      dispatch(apiRequest(statusType, "post", API_ENDPOINTS.SP.POST, data));
    }
  };

  const renderCellValue = (column: Column, row: any, index: number) => {
    if (column.type == "auto") {
      return generateSerialNumber(page, rowsPerPage, index);
    }
    if (column.id == "status") {
      return (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row.status == true}
            onChange={() => changeStatus(row)}
          />
          <div
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-black ${row.status == true
              ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
              : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4  peer-hover:after:scale-95`}
          ></div>
        </label>
      );
    }

    if (column.id === "loanStatus") {
      const status = Number(row?.loanStatus);
      const status_name = status === 0 ? "Open" : "Closed";
      const styles = statusStyles[status_name] || {
        bg: "bg-gray-200",
        text: "text-gray-700",
      };

      return (
        <Box
          sx={{
            width: "55px",
            height: "32px",
            borderRadius: 1,
            py: "4px",
            px: 0,
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: styles.bg,
            color: styles.text,
          }}
        >
          {status_name}
        </Box>
      );
    }

    if (column.id === "closingType") {
      const status_name =
        row?.closingType === 0
          ? closedThrough[0].label
          : row?.closingType === 1
            ? closedThrough[1].label
            : "";
      return status_name;
    }

    if (column.id === "close" && table_type === "reports-cashFlowTable") {
      const status_name =
        row?.closingType === 0
          ? closedThrough[0].label
          : row?.closingType === 1
            ? closedThrough[1].label
            : "";
      return status_name;
    }
  };

  //  useEffect(() => {
  //    if(!statusType) return
  //    dispatch(apiClear(statusType));
  //    return () => {
  //      dispatch(apiClear(statusType));

  //    };
  //   }, [dispatch]);

  const joinFields = (row: any, column: Column) => {
    if (column.joinFields?.length > 0) {
      const data =
        getNestedValue(row, column.id) +
        (column.formatValue || "") +
        "" +
        column.joinFields.map((data: any) => {
          return (
            ` ${data.symbol} ` +
            getNestedValue(row, data.field) +
            (column.formatValue || "")
          );
        });
      return data;
    }
  };

  const formatNum = (row: any, column: Column) => {
    if (column.formatNumber && Object.entries(column.formatNumber).length > 0) {
      const formatted = formatNumber({
        value: getNestedValue(row, column.id),
        decimalPlaces: column.formatNumber.decimalPlaces || 0,
        locale: column.formatNumber.locale,
        currency: column.formatNumber.currency,
      });

      return formatted + (column.formatNumber.trials || "");
    }

    return getNestedValue(row, column.id);
  };

  const renderImage = (imgUrl: string) => {
    return (
      <img
        style={{
          height: "60px",
          width: "60px",
          objectFit: "contain",
          borderRadius: "8px",
        }}
        alt={imgUrl}
        src={imgUrl}
      />
    );
  };

  const handleFormat = (column: Column, row: any, _index: number) => {
    if (column.joinFields?.length > 0) {
      return joinFields(row, column);
    }

    switch (column.type) {
      case "date":
        if (column.formatValue) {
          return formatDate(getNestedValue(row, column.id), column.formatValue);
        }
        break;

      case "percentage":
        if (column.formatValue && column.joinFields?.length > 0) {
          return joinFields(row, column);
        }
        break;

      case "amt":
      case "number":
      case "wt":
        if (column.format && Object.entries(column.formatNumber).length > 0) {
          return formatNum(row, column);
        }
        break;

      // case "static":
      //   if (column.staticValue) {
      //     const value = getStaticValue(row, column.id);
      //     return column.staticValue[value?.toString()] || "-";
      //   }
      //   break;

      case "static":
        if (column.id === "closingType" || column.id === "loanStatus") {
          return;
        }
        break;

      case "image":
        return renderImage(row.img);
        break;

      default:
        return getNestedValue(row, column.id);
    }
  };

  // Handle menu click for a specific row
  // const handleMenuClick = (
  //   event: React.MouseEvent<HTMLElement>,
  //   rowId: string
  // ) => {
  //   setAnchorElMap((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  // };

  // Handle menu close for a specific row
  const handleMenuClose = (rowId: string) => {
    setAnchorElMap((prev) => ({ ...prev, [rowId]: null }));
  };

  const handleDropdownChange = (fieldName: string, value: any | null) => {
    setDropdownFilters((prev) => {
      const newFilters = { ...prev };
      if (value === null || value === "") {
        delete newFilters[fieldName];
      } else {
        newFilters[fieldName] = value;
      }
      return newFilters;
    });
  };

  const filterValues = (): React.ReactNode => {
    switch (table_type) {
      case "reports-itemWise":
        return <ItemWiseFilter onFilterChange={handleDropdownChange} />;
      case "expenseEntries-table":
        // return <ExpenseEntriesFilter onFilterChange={handleDropdownChange} />;
      case "reports-loanHistory":
        return <LoanHistoryFilter onFilterChange={handleDropdownChange} />;
      case "reports-loanReport":
        return <LoanReportFilter onFilterChange={handleDropdownChange} />;
      case "reports-interstCollectionreport":
        return (
          <InterestCollectionFilter onFilterChange={handleDropdownChange} />
        );
      case "reports-transactionreports":
        return <TransactionFilter onFilterChange={handleDropdownChange} />;

      case "itemCreation-table":
        return <ItemCreationFilter onFilterChange={handleDropdownChange} />;

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
          value = generateSerialNumber(page, rowsPerPage, index);
        } else if (column.id === "status") {
          value = row.status ? "Active" : "Inactive";
        } else if (column.id === "loanStatus") {
          const status = Number(row?.loanStatus);
          value = status === 0 ? "Open" : "Closed";
        } else if (
          column.id === "closingType" ||
          (column.id === "close" && table_type === "reports-cashFlowTable")
        ) {
          value =
            row?.closingType === 0
              ? closedThrough[0].label
              : row?.closingType === 1
                ? closedThrough[1].label
                : "";
        } else {
          const formatted = handleFormat(column, row, index);
          value =
            formatted !== undefined
              ? formatted
              : getNestedValue(row, column.id);
        }

        // Clean currency and similar numeric strings
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

  return (
    <Card sx={{ style }}>
      <>
        {tableTitle && (
          <>
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
          </>
        )}

        <Box mx={3} mt={3}>
          {filterValues()}
        </Box>

        {(table_type?.includes("reports") ||
          table_type === "expenseEntries-table" ||
          tableName == "locker") &&
          pagination ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              // my={5}
              gap={2}
            >
              <Box my={3}>
                <DateRange
                  value={{ startDate, endDate }}
                  onChange={(range) => {
                    setEndDate(range.endDate);
                    setStartDate(range.startDate);
                  }}
                />
              </Box>

              <Box my={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                >
                  {table_type?.includes("reports") ||
                    (tableName == "locker" && (
                      <>
                        <Box sx={{ width: "200px" }}>{branchValues()}</Box>
                      </>
                    ))}

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

                {/* {(startDateError || endDateError) && <Box mb={2}></Box>} */}
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="end"
              // p={2}
              my={3}
              gap={2}
            >
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
                  printRef={printRef}
                  setAnchorElMap={setAnchorElMap}
                />
              )}
            </Box>
          </>
        )}
      </>

      <ToastContainer className={"mt-16"} />
      <TableContainer sx={{ padding: "", overflowX: "auto" }}>
        {" "}
        <Table className="overflow-hidden " ref={printRef}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  onClick={() => handleSort(column.id)}
                  sx={{
                    padding: "8px",
                    textWrap: "nowrap",
                  }}
                >
                  <div className="flex p-2">
                    {column.label}
                    {orderBy === column.id ? (
                      <Box component="span">
                        {order === "asc" ? (
                          <Icon
                            icon={arrowUpward}
                            fontSize="small"
                            className="mt-1"
                          />
                        ) : (
                          <Icon
                            icon={arrowDownward}
                            fontSize="small"
                            className="mt-1"
                          />
                        )}
                      </Box>
                    ) : null}
                  </div>
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell>{action ? "Actions" : ""}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="300px"
                  >
                    <Box
                      component="img"
                      src={norecords}
                      alt="No records found"
                      loading="lazy"
                      sx={{
                        width: { xs: 120, sm: 100, md: 100 },
                        height: "auto",
                        mb: 2,
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data?.map((row, index) => (
                <TableRow
                  key={index}
                  hover // Add hover effect to table rows
                  className="border"
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover", // Use theme's hover color
                    },
                  }}
                >
                  {columns?.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "left"}
                      sx={{
                        padding: "8px",
                        textWrap: "nowrap",
                      }}
                    >
                      {isStatus ? (
                        <>
                          {handleFormat(column, row, index)}
                          <Box px={2}>
                            {renderCellValue(column, row, index)}
                          </Box>
                        </>
                      ) : (
                        <>
                          {handleFormat(column, row, index)}

                          <Box px={2}>
                            {renderCellValue(column, row, index)}
                          </Box>
                        </>
                      )}
                    </TableCell>
                  ))}

                  {actions.length > 0 && (
                    <TableCell>
                      <Box display="flex" gap={2}>
                        {actions.includes("V") && (
                          <Tooltip
                            title="View"
                            sx={{
                              border: "1px solid #F2F2F9", // light gray border
                              borderRadius: "100%", // makes it circular
                              padding: "6.5px", // optional: adjust padding
                            }}
                          >
                            {canView && (
                              <IconButton
                                onClick={() => {
                                  handleMenuClose(row._id);
                                  onView?.(row);
                                }}
                              >
                                <Icon icon="eva:eye-outline" />
                              </IconButton>
                            )}
                          </Tooltip>
                        )}
                        {actions.includes("E") && (
                          <Tooltip
                            title="Edit"
                            sx={{
                              border: "1px solid #F2F2F9", // light gray border
                              borderRadius: "100%", // makes it circular
                              padding: "6.5px", // optional: adjust padding
                            }}
                          >
                            {canEdit && (
                              <IconButton
                                onClick={() => {
                                  handleMenuClose(row._id);
                                  onEdit?.(row);
                                }}
                              >
                                <Icon icon="eva:edit-outline" />
                              </IconButton>
                            )}
                          </Tooltip>
                        )}
                        {actions.includes("Au") && (
                          <Tooltip
                            title="Move to Auction"
                            sx={{
                              border: "1px solid #F2F2F9", // light gray border
                              borderRadius: "100%", // makes it circular
                              padding: "6.5px", // optional: adjust padding
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                handleMenuClose(row._id);
                                onAuction?.(row);
                              }}
                            >
                              <Icon icon="mdi:gavel" width={20} height={20} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {actions.includes("D") && (
                          <Tooltip
                            title="Delete"
                            sx={{
                              border: "1px solid #F2F2F9", // light gray border
                              borderRadius: "100%", // makes it circular
                              padding: "6.5px", // optional: adjust padding
                            }}
                          >
                            {canDelete && (
                              <IconButton
                                onClick={() => {
                                  handleMenuClose(row._id);
                                  onDelete?.(row);
                                }}
                              >
                                <Icon icon="eva:trash-2-outline" />
                              </IconButton>
                            )}
                          </Tooltip>
                        )}
                        {actions.includes("Pr") && (
                          <Tooltip
                            title="print"
                            sx={{
                              border: "1px solid #F2F2F9", // light gray border
                              borderRadius: "100%", // makes it circular
                              padding: "6.5px", // optional: adjust padding
                            }}
                          >
                            {canPrint && (
                              <IconButton
                                onClick={() => {
                                  handleMenuClose(row._id);
                                  onPrint?.(row);
                                }}
                              >
                                <Icon icon="eva:printer-outline" />
                              </IconButton>
                            )}
                          </Tooltip>
                        )}
                        {actions.includes("P") && (
                          <Button
                            onClick={() => {
                              handleMenuClose(row._id);
                              onEdit?.(row);
                            }}
                            variant="contained"
                            disableElevation
                            disableRipple
                            disableFocusRipple
                            sx={{
                              all: "unset",
                              bgcolor: "black",
                              color: "white",
                              px: 2,
                              py: 1,
                              cursor: "pointer",
                              borderRadius: "4px",
                              display: "inline-block",
                              textAlign: "center",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                bgcolor: "#333",
                                color: "#f0f0f0",
                              },
                            }}
                          >
                            Pay
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {data?.length > 0 && pagination && (
        <>

          <CustomPagination
            count={total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Box></Box>
    </Card>
  );
}
