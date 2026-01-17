export type Column = {
    id: string;
    label: string;
    align?: "left" | "center" | "right";
    type?: string;
    formatValue?: string;
    render?: (value: any, row: any) => React.ReactNode;
    isFilterable?: boolean;
    joinFields: any;
    formatNumber: any;
    staticValue: any;
    format?: string;
    search_visiblity?: boolean;
};

export type DataTableProps = {
    procedureName?: string;
    endpoint: string;
    actionType: string;
    tableName: string;
    filters?: Record<string, any>;
    defaultSort?: { field: string; order: "asc" | "desc" };
    exportOptions?: boolean;
    onView?: (row: any) => void;
    onAuction?: (row: any) => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onPrint?: (row: any) => void;
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

export interface StatusStyle {
    bg: string;
    text: string;
}
