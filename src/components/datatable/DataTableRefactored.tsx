import { useRef, useState } from "react";
import {
    Card,
    Table,
    TableContainer,
    TablePagination,
    Box,
    Typography,
    LinearProgress,
    linearProgressClasses,
} from "@mui/material";
import { ToastContainer } from "react-toastify";

import { useDataTable } from "./refactored/hooks/useDataTable";
import { TableHeader } from "./refactored/components/TableHeader";
import { TableBody } from "./refactored/components/TableBody";
import { TableToolbar } from "./refactored/components/TableToolbar";
import { DataTableProps } from "./refactored/types";

export function DataTableRefactored(props: DataTableProps) {
    const {
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
        // isStatus,
        handleSort,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearch,
        handleStartDateChange,
        handleEndDateChange,
        handleDropdownChange,
    } = useDataTable(props);

    const printRef = useRef<HTMLTableElement>(null);
    const [anchorElMap, setAnchorElMap] = useState<Record<string, HTMLElement | null>>({});

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

    return (
        <Card sx={{ ...props.style }}>
            <TableToolbar
                tableTitle={props.tableTitle}
                search={search}
                handleSearch={handleSearch}
                search_visiblity={props.search_visiblity}
                table_type={props.table_type}
                tableName={props.tableName}
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                handleDropdownChange={handleDropdownChange}
                exportOptions={props.exportOptions}
                data={data}
                columns={columns}
                printRef={printRef}
                anchorElMap={anchorElMap}
                setAnchorElMap={setAnchorElMap}
                page={page}
                rowsPerPage={rowsPerPage}
            />

            <ToastContainer className={"mt-16"} />

            <TableContainer sx={{ padding: "", overflowX: "auto" }}>
                <Table className="overflow-hidden " ref={printRef}>
                    <TableHeader
                        columns={columns}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleSort}
                        actions={actions}
                        action={props.action}
                    />
                    <TableBody
                        data={data}
                        columns={columns}
                        actions={actions}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        statusType={props.statusType}
                        tableName={props.tableName}
                        table_type={props.table_type}
                        onView={props.onView}
                        onEdit={props.onEdit}
                        onDelete={props.onDelete}
                        onAuction={props.onAuction}
                        onPrint={props.onPrint}
                    />
                </Table>
            </TableContainer>

            {data?.length > 0 && props.pagination !== false && (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                >
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Showing {page * rowsPerPage + 1} to{" "}
                        {Math.min((page + 1) * rowsPerPage, total)} of {total} entries
                    </Typography>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            )}
        </Card>
    );
}
