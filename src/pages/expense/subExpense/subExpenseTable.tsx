import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Stack, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import SubTable from "../../../components/subTable/subTable";
import { SubExpenseForm } from "./subExpenseForm";
import { useSubExpense } from "./subexpenseHooks";
import StatusToggle from "../../../components/common/toggle";
import { formatDateTime } from "../../../utils/dateFormate";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";
import { useExpense } from "../createExpense/expensehooks";

export default function SubExpenseTable() {
  const {
    subExpenses,
    loading,
    deleteSubExpense,
    fetchSubExpenseById,
    fetchTable,
    updateSubExpenseStatus,
  } = useSubExpense();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters, setFilters } = useTableFilters();

  const {fetchExpenses,expenses}=useExpense()

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedSubExpense, setSelectedSubExpense] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(()=>{
    fetchExpenses()
  },[])
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
    const data = await fetchSubExpenseById(row._id);
    setSelectedSubExpense(data);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  const handleDelete = (row: any) => {
    setSelectedSubExpense(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && selectedSubExpense) {
      await deleteSubExpense(selectedSubExpense._id);
    }
  };

  const handleToggleStatus = async (row: any) => {
    await updateSubExpenseStatus(row._id);
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "name", label: "Sub Expense Name" },
    { id: "expenseName", label: "Expense" },
    { id: "active", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = subExpenses.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    name: item.name,
    expenseName: item?.expense?.expenseName,
    active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Sub Expense - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Expense" },
                { label: "Sub Expense", active: true },
              ]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Sub Expense
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
                    label="Expense"
                    value={filters.expenseId}
                    options={expenses}
                    optionLabel="expenseName"
                    optionValue="_id"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        expenseId: e.target.value,
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
          <SubExpenseForm
            isEdit={isEdit}
            subExpenseData={selectedSubExpense}
            onClose={() => {
              setIsFormOpen(false);
              setIsEdit(false);
              setSelectedSubExpense(null);
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
          title="Delete Sub Expense"
          message="Are you sure you want to delete this Sub Expense?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
