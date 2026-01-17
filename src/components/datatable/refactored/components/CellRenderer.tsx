import React from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import moment from "moment";
import { apiRequest } from "../../../../store/actions";
import API_ENDPOINTS from "../../../../services/endpoints";
import { closedThrough } from "../../../../const";
import { formatNumber } from "../../../../utils/commonFunction";
import { Column, StatusStyle } from "../types";

interface CellRendererProps {
    column: Column;
    row: any;
    index: number;
    page: number;
    rowsPerPage: number;
    statusType?: string;
    tableName: string;
    table_type?: string | null;
}

const statusStyles: Record<string, StatusStyle> = {
    Open: { bg: "#12B76A38", text: "#12B76A" },
    Closed: { bg: "#FF000038", text: "#FF0000" },
};

export const CellRenderer: React.FC<CellRendererProps> = ({
    column,
    row,
    index,
    page,
    rowsPerPage,
    statusType,
    tableName,
    table_type,
}) => {
    const dispatch = useDispatch();

    const getNestedValue = (obj: any, path: any) => {
        return (
            path?.split(".").reduce((acc: any, key: any) => (acc && acc[key] ? acc[key] : ""), obj) || ""
        );
    };

    const generateSerialNumber = () => page * rowsPerPage + index + 1;

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

    const joinFields = (row: any, column: Column) => {
        if (column.joinFields?.length > 0) {
            return (
                getNestedValue(row, column.id) +
                (column.formatValue || "") +
                "" +
                column.joinFields.map((data: any) => {
                    return ` ${data.symbol} ` + getNestedValue(row, data.field) + (column.formatValue || "");
                }).join("")
            );
        }
        return "";
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

    const formatDate = (date: string, formatValue: string) => {
        const parsedDate = moment(date);
        return parsedDate.isValid() ? parsedDate.format(formatValue) : date;
    };

    // --- Render Logic ---

    if (column.type === "auto") {
        return <>{generateSerialNumber()}</>;
    }

    if (column.id === "status") {
        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={row.status === true}
                    onChange={() => changeStatus(row)}
                />
                <div
                    className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-black ${row.status === true
                            ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                            : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
                        } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95`}
                ></div>
            </label>
        );
    }

    if (column.id === "loanStatus") {
        const status = Number(row?.loanStatus);
        const status_name = status === 0 ? "Open" : "Closed";
        const styles = statusStyles[status_name] || { bg: "bg-gray-200", text: "text-gray-700" };

        return (
            <Box
                sx={{
                    width: "55px",
                    height: "32px",
                    borderRadius: 1,
                    py: "4px",
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

    if (column.id === "closingType" || (column.id === "close" && table_type === "reports-cashFlowTable")) {
        const status_name =
            row?.closingType === 0
                ? closedThrough[0]?.label
                : row?.closingType === 1
                    ? closedThrough[1]?.label
                    : "";
        return <>{status_name}</>;
    }

    if (column.type === "image") {
        return (
            <img
                style={{
                    height: "60px",
                    width: "60px",
                    objectFit: "contain",
                    borderRadius: "8px",
                }}
                alt={row.img}
                src={row.img}
            />
        )
    }

    // Generic formatting
    if (column.joinFields?.length > 0) {
        return <>{joinFields(row, column)}</>;
    }

    switch (column.type) {
        case "date":
            if (column.formatValue) {
                return <>{formatDate(getNestedValue(row, column.id), column.formatValue)}</>;
            }
            break;
        case "percentage":
            // handled by joinFields usually, but fallback
            break;
        case "amt":
        case "number":
        case "wt":
            if (column.format && column.formatNumber && Object.entries(column.formatNumber).length > 0) {
                return <>{formatNum(row, column)}</>
            }
            break;
        case "static":
            // Already handled specific static cases above, generic static ignored in original code
            return null;
    }

    return <>{getNestedValue(row, column.id)}</>;
};
