import {
    TableHead,
    TableRow,
    TableCell,
    Box,
} from "@mui/material";
import { Icon } from "@iconify/react";
import arrowUpward from "@iconify/icons-eva/arrow-upward-fill";
import arrowDownward from "@iconify/icons-eva/arrow-downward-fill";
import { Column } from "../types";

interface TableHeaderProps {
    columns: Column[];
    order: "asc" | "desc";
    orderBy: string;
    onRequestSort: (id: string) => void;
    actions: string[];
    action?: boolean;
}

export const TableHeader = ({
    columns,
    order,
    orderBy,
    onRequestSort,
    actions,
    action = true,
}: TableHeaderProps) => {
    return (
        <TableHead>
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        onClick={() => onRequestSort(column.id)}
                        sx={{
                            padding: "8px",
                            textWrap: "nowrap",
                            cursor: "pointer",
                        }}
                    >
                        <div className="flex p-2 items-center">
                            {column.label}
                            {orderBy === column.id ? (
                                <Box component="span" sx={{ ml: 1 }}>
                                    {order === "asc" ? (
                                        <Icon icon={arrowUpward} fontSize="small" className="mt-1" />
                                    ) : (
                                        <Icon icon={arrowDownward} fontSize="small" className="mt-1" />
                                    )}
                                </Box>
                            ) : null}
                        </div>
                    </TableCell>
                ))}
                {actions.length > 0 && <TableCell>{action ? "Actions" : ""}</TableCell>}
            </TableRow>
        </TableHead>
    );
};
