import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import { Toast } from "../../../toast/toast";
import { DataTableProps, Column } from "../types";
import { apiRequest, apiClear } from "../../../../store/actions";

export const useDataTable = (props: DataTableProps) => {
    const {
        endpoint,
        actionType,
        tableName,
        procedureName = "find",
        filters = {},
        defaultSort = { field: "createdAt", order: "desc" },
        table_type,
        search_visiblity = true,
        populateFields = [""],
        aggregateFields = {},
        isPopulated,
        statusType,
        isLoading: externalLoading, // Alias to avoid conflict with local loading state
    } = props;

    // Stabilize props to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stablePopulateFields = useMemo(() => populateFields, [JSON.stringify(populateFields)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stableAggregateFields = useMemo(() => aggregateFields, [JSON.stringify(aggregateFields)]);


    const dispatch = useDispatch();

    // State
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<"asc" | "desc">(defaultSort.order);
    const [orderBy, setOrderBy] = useState<string>(defaultSort.field);
    const [search, setSearch] = useState<string>("");
    const [actions, setActions] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "month"));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
    const [tablefilters, setTableFilters] = useState(filters || {});
    const [loading, setLoading] = useState(false);
    const [dropdownfilters, setDropdownFilters] = useState<Record<string, any>>({});
    const [isStatus, setIsStatus] = useState<boolean | null>(false);

    // Redux Selectors
    const dataTableResult = useSelector((state: any) => state[actionType]?.data);
    const updateFields = useSelector((state: any) =>
        statusType ? state[statusType]?.data : undefined
    );
    const refetchTable = useSelector((state: any) => state?.refetchTable);

    // Filter Logic Effect
    useEffect(() => {
        const newFilters = { ...dropdownfilters, ...stableFilters };

        if (table_type?.includes("reports")) {
            if (startDate) newFilters.fromDate = dayjs(startDate).startOf("day").toISOString();
            if (endDate) newFilters.toDate = dayjs(endDate).endOf("day").toISOString();
        } else if (table_type?.includes("expenseEntries")) {
            newFilters.expenseDate = {};
            if (startDate) newFilters.expenseDate.$gte = dayjs(startDate).startOf("day").toISOString();
            if (endDate) newFilters.expenseDate.$lte = dayjs(endDate).endOf("day").toISOString();
        } else if (tableName == "locker") {
            newFilters.createdAt = {
                $gte: dayjs(startDate).endOf("day").toISOString(),
                $lte: dayjs(endDate).endOf("day").toISOString(),
            };
        }

        // Only update if filters have actually changed to prevent infinite loops
        if (JSON.stringify(newFilters) !== JSON.stringify(tablefilters)) {
            setTableFilters(newFilters);
        }
    }, [startDate, endDate, dropdownfilters, table_type, stableFilters, tableName, tablefilters]);

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true); // if not needed remove this line. Optional: manage local loading state more explicitly if needed
            const requestData = {
                procedureName: procedureName,
                params: {
                    tableName,
                    table_type,
                    filters: { ...(tablefilters || {}) },
                    sort: { [orderBy]: order === "asc" ? 1 : -1 },
                    page: page + 1,
                    limit: rowsPerPage,
                    search,
                    populateFields: stablePopulateFields,
                    aggregateFields: stableAggregateFields,
                    isPopulated,
                },
            };

            dispatch(apiRequest(actionType, "post", endpoint, requestData));
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    }, [
        dispatch,
        endpoint,
        tableName,
        table_type,
        tablefilters,
        search,
        orderBy,
        order,
        page,
        rowsPerPage,
        actionType,
        stablePopulateFields,
        stableAggregateFields,
        isPopulated,
        procedureName
    ]);

    // Handle Data Result
    useEffect(() => {
        if (dataTableResult?.success) {
            setLoading(false);
            let tblHeader = dataTableResult?.tblHeader;

            // Expense Special case
            if (tableName === "expense") {
                tblHeader = tblHeader?.filter(
                    (item: any) => item.tableName === "expense" || item.title === "Expense"
                );
            }

            let apiData = dataTableResult?.data?.data;

            // Payment CashFlow special case
            if (tableName === "Payment" && table_type === "reports-cashFlowTable") {
                apiData = dataTableResult.data.summary;
            }

            if (tblHeader && tblHeader[0]) {
                let dynamicColumns = tblHeader[0]?.columns.map((col: any) => ({
                    id: col.column_name,
                    label: col.column_heading,
                    align: col.align || "left",
                    type: col.type,
                    formatValue: col.formatValue,
                    isFilterable: col.is_filter,
                    format: col.format,
                    joinFields: col.joinFields,
                    formatNumber: col.formatNumber,
                    search_visiblity: (col.search_visiblity && search_visiblity) ?? true,
                }));

                if (table_type === "reports-overDue" && tableName === "loanAccount") {
                    dynamicColumns = dynamicColumns.map((col: any) => ({
                        ...col,
                        search_visiblity: false,
                    }));
                }

                if (tblHeader[0]?.action) {
                    setActions(tblHeader[0].action.split(","));
                }

                if (tblHeader[0]?.show_action && table_type === "reports" && tableName === "loanAccount") {
                    setIsStatus(true);
                }

                setColumns(dynamicColumns);
            }

            setData(apiData || []);
            setTotal(dataTableResult.data.totalCount || 0);
        }
    }, [dataTableResult, tableName, table_type, search_visiblity]);

    // Handle Update Fields Response
    useEffect(() => {
        if (!updateFields) return;
        if (updateFields?.success) {
            Toast.show({ message: "Status changed successfully", type: "success" });
            fetchData(); // Refetch on status change
        } else {
            Toast.show({ message: "Failed to change status", type: "error" });
        }

        if (statusType) {
            dispatch(apiClear(statusType));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateFields]);

    // Refetch when dependencies change
    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, orderBy, order, tablefilters, search, refetchTable, fetchData, externalLoading]);


    // Event Handlers
    const handleSort = useCallback((id: string) => {
        setOrder((prevOrder) => (orderBy === id && prevOrder === "asc" ? "desc" : "asc"));
        setOrderBy(id);
    }, [orderBy]);

    const handleChangePage = useCallback((_: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setPage(0);
    }, []);

    const handleStartDateChange = useCallback((newValue: Dayjs | null) => setStartDate(newValue), []);
    const handleEndDateChange = useCallback((newValue: Dayjs | null) => setEndDate(newValue), []);

    const handleDropdownChange = useCallback((fieldName: string, value: any) => {
        setDropdownFilters((prev) => {
            const newFilters = { ...prev };
            if (value === null || value === "") {
                delete newFilters[fieldName];
            } else {
                newFilters[fieldName] = value;
            }
            return newFilters;
        });
    }, []);

    return {
        data,
        columns,
        total,
        page,
        rowsPerPage,
        order,
        orderBy,
        search,
        actions,
        startDate,
        endDate,
        loading,
        isStatus,
        handleSort,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearch,
        handleStartDateChange,
        handleEndDateChange,
        handleDropdownChange,
        fetchData,
    };
};
