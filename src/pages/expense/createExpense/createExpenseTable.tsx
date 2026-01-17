import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button, Stack } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import SubTable from "../../../components/subTable/subTable";
import { ExpenseForm } from "./expenseForm";
import { useExpense } from "./expensehooks";
import { useEffect, useState } from "react";
import StatusToggle from "../../../components/common/toggle";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { formatDateTime } from "../../../utils/dateFormate";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";

export default function ExpenseTable() {
  const {
    expenses,
    loading,
    deleteExpense,
    fetchExpenseById,
    selectedExpense,
    setSelectedExpense,
    fetchTable,
    updateExpenseStatus,
  } = useExpense();

    const {
      page,
      rowsPerPage,
      totalCount,
      setTotalCount,
      onPageChange,
      onRowsPerPageChange,
    } = useTablePagination();
  
    const { search, setSearch, filters } = useTableFilters();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

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


  /* ------------------ EDIT ------------------ */
  const handleEdit = async (row: any) => {
    setIsEdit(true);
    await fetchExpenseById(row._id);
    setIsFormOpen(true);
  };

  /* ------------------ DELETE ------------------ */
  const handleDelete = (row: any) => {
    setExpenseToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && expenseToDelete) {
      await deleteExpense(expenseToDelete._id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedExpense(null);
  };

  const handleToggleStatus = async (row: any) => {
    await updateExpenseStatus(row._id);
  };

  const columns = [
    { id: "id", label: "S.No" },
    { id: "expenseName", label: "Expense Name" },
    { id: "active", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = expenses.map((item, index) => ({
    id:page * rowsPerPage + index + 1,
    _id: item._id,
    expenseName: item.expenseName,
    active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Expense - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Expense" },
                { label: "Expense Creation", active: true },
              ]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Expense
          </Button>
        </Box>

        <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
          <FilterBar
            rows={[
              <Box display="flex" gap={1} flexWrap="wrap">
                <FilterItem>
                  <Search onSearch={(v) => setSearch(v)} loading={loading} />
                </FilterItem>
              </Box>,
            ]}
          />
          <SubTable
            coloums={columns}
            data={tableData}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>

        {isFormOpen && (
          <ExpenseForm
            isEdit={isEdit}
            expenseData={selectedExpense}
            onClose={handleFormClose}
            onSubmitSuccess={handleFormClose}
          />
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmDelete}
          title="Delete Expense"
          message="Are you sure you want to delete this expense?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
