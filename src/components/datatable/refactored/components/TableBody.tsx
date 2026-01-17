import {
    TableBody as MuiTableBody,
    TableRow,
    TableCell,
    Box,
    Tooltip,
    IconButton,
    Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Column } from "../types";
import { CellRenderer } from "./CellRenderer";
import norecords from "../../../../../src-tauri/icons/norecords.svg";

interface TableBodyProps {
    data: any[];
    columns: Column[];
    actions: string[];
    page: number;
    rowsPerPage: number;
    statusType?: string;
    tableName: string;
    table_type?: string | null;
    onView?: (row: any) => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onAuction?: (row: any) => void;
    onPrint?: (row: any) => void;
}

export const TableBody = ({
    data,
    columns,
    actions,
    page,
    rowsPerPage,
    statusType,
    tableName,
    table_type,
    onView,
    onEdit,
    onDelete,
    onAuction,
    onPrint,
}: TableBodyProps) => {
    if (!data || data.length === 0) {
        return (
            <MuiTableBody>
                <TableRow>
                    <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)}>
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
            </MuiTableBody>
        );
    }

    return (
        <MuiTableBody>
            {data.map((row, index) => (
                <TableRow
                    key={row._id || index}
                    hover
                    className="border"
                    sx={{
                        "&:hover": {
                            backgroundColor: "action.hover",
                        },
                    }}
                >
                    {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            align={column.align || "left"}
                            sx={{
                                padding: "8px",
                                textWrap: "nowrap",
                            }}
                        >
                            <Box px={2}>
                                <CellRenderer
                                    column={column}
                                    row={row}
                                    index={index}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    statusType={statusType}
                                    tableName={tableName}
                                    table_type={table_type}
                                />
                            </Box>
                        </TableCell>
                    ))}

                    {actions.length > 0 && (
                        <TableCell>
                            <Box display="flex" gap={2}>
                                {actions.includes("V") && (
                                    <Tooltip
                                        title="View"
                                        sx={{
                                            border: "1px solid #F2F2F9",
                                            borderRadius: "100%",
                                            padding: "6.5px",
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => onView?.(row)}
                                        >
                                            <Icon icon="eva:eye-outline" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {actions.includes("E") && (
                                    <Tooltip
                                        title="Edit"
                                        sx={{
                                            border: "1px solid #F2F2F9",
                                            borderRadius: "100%",
                                            padding: "6.5px",
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => onEdit?.(row)}
                                        >
                                            <Icon icon="eva:edit-outline" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {actions.includes("Au") && (
                                    <Tooltip
                                        title="Move to Auction"
                                        sx={{
                                            border: "1px solid #F2F2F9",
                                            borderRadius: "100%",
                                            padding: "6.5px",
                                        }}
                                    >
                                        <IconButton onClick={() => onAuction?.(row)}>
                                            <Icon icon="mdi:gavel" width={20} height={20} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {actions.includes("D") && (
                                    <Tooltip
                                        title="Delete"
                                        sx={{
                                            border: "1px solid #F2F2F9",
                                            borderRadius: "100%",
                                            padding: "6.5px",
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => onDelete?.(row)}
                                        >
                                            <Icon icon="eva:trash-2-outline" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {actions.includes("Pr") && (
                                    <Tooltip
                                        title="print"
                                        sx={{
                                            border: "1px solid #F2F2F9",
                                            borderRadius: "100%",
                                            padding: "6.5px",
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => onPrint?.(row)}
                                        >
                                            <Icon icon="eva:printer-outline" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {actions.includes("P") && (
                                    <Button
                                        onClick={() => onEdit?.(row)}
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
            ))}
        </MuiTableBody>
    );
};
