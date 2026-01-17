import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Stack, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import SubTable from "../../../components/subTable/subTable";
import { SubIncomeForm } from "./subIncomeForm";
import { useSubIncome } from "./subIncomeHooks";
import StatusToggle from "../../../components/common/toggle";
import { formatDateTime } from "../../../utils/dateFormate";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";
import { useIncome } from "../createIncome/incomeHooks";

export default function SubIncomeTable() {
    const {
        subIncomes,
        loading,
        deleteSubIncome,
        fetchSubIncomeById,
        fetchTable,
        updateSubIncomeStatus,
    } = useSubIncome();

    const {
        page,
        rowsPerPage,
        totalCount,
        setTotalCount,
        onPageChange,
        onRowsPerPageChange,
    } = useTablePagination();

    const { search, setSearch, filters, setFilters } = useTableFilters();

    const { fetchIncomes, incomes } = useIncome();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedSubIncome, setSelectedSubIncome] = useState<any>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        fetchIncomes();
    }, []);

    useEffect(() => {
        onPageChange(null, 0);
    }, [search, filters]);

    // Fetch data
    useEffect(() => {
        fetchTable({
            page: page + 1,
            limit: rowsPerPage,
            search,
            filters,
        }).then(setTotalCount);
    }, [page, rowsPerPage, search, filters]);

    const handleEdit = async (row: any) => {
        const data = await fetchSubIncomeById(row._id);
        setSelectedSubIncome(data);
        setIsEdit(true);
        setIsFormOpen(true);
    };

    const handleDelete = (row: any) => {
        setSelectedSubIncome(row);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async (confirmed: boolean) => {
        setConfirmOpen(false);
        if (confirmed && selectedSubIncome) {
            await deleteSubIncome(selectedSubIncome._id);
        }
    };

    const handleToggleStatus = async (row: any) => {
        await updateSubIncomeStatus(row._id);
    };

    const columns = [
        { id: "id", label: "S.NO" },
        { id: "name", label: "Sub Income Name" },
        { id: "incomeName", label: "Income" },
        { id: "active", label: "Status" },
        { id: "createdAt", label: "Created At" },
    ];
    const tableData = subIncomes.map((item: any, index: number) => ({
        id: page * rowsPerPage + index + 1,
        _id: item._id,
        name: item.name,
        incomeName: item?.income?.incomeName,
        active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
        createdAt: formatDateTime(item.createdAt),
    }));


    return (
        <>
            <Helmet>
                <title>{`Sub Income - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <Stack flexGrow={1}>
                        <Breadcrumb
                            items={[
                                { label: "Income" },
                                { label: "Sub Income", active: true },
                            ]}
                        />
                    </Stack>

                    <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => setIsFormOpen(true)}
                    >
                        Add Sub Income
                    </Button>
                </Box>

                <Box bgcolor="#fff" p={2} borderRadius={1}>
                    <FilterBar
                        rows={[
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <FilterItem>
                                    <Search onSearch={(v) => setSearch(v)} loading={loading} />
                                </FilterItem>
                                <FilterItem>
                                    <DropDown
                                        label="Income"
                                        value={filters.incomeId}
                                        options={incomes}
                                        optionLabel="incomeName"
                                        optionValue="_id"
                                        onChange={(e) =>
                                            setFilters((prev: any) => ({
                                                ...prev,
                                                incomeId: e.target.value,
                                            }))
                                        }
                                        size="small"
                                    />
                                </FilterItem>
                            </Box>,
                        ]}
                    />
                    <SubTable
                        coloums={columns}
                        data={tableData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        loading={loading}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={totalCount}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                    />
                </Box>

                {isFormOpen && (
                    <SubIncomeForm
                        isEdit={isEdit}
                        subIncomeData={selectedSubIncome}
                        onClose={() => {
                            setIsFormOpen(false);
                            setIsEdit(false);
                            setSelectedSubIncome(null);
                        }}
                        onSubmitSuccess={() => {
                            setIsFormOpen(false);
                            setIsEdit(false);
                        }}
                    />
                )}

                <ConfirmationDialog
                    open={confirmOpen}
                    onClose={handleConfirmDelete}
                    title="Delete Sub Income"
                    message="Are you sure you want to delete this Sub Income?"
                    positiveButtonLabel="Delete"
                    negativeButtonLabel="Cancel"
                    showNegativeButton
                />
            </DashboardContent>
        </>
    );
}
