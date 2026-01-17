import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Typography, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { CommonView } from "../../../layouts/components/CommonView";

import ExpenseEntriesView from "./ExpenseEntriesView";
import { ExpenseEntriesForm } from "./expenseEntriesForm";
import { useExpenseEntries } from "./expenseEntriesHook";
import SubTable from "../../../components/subTable/subTable";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";
import { useExpense } from "../createExpense/expensehooks";
import { formatDateTime } from "../../../utils/dateFormate";
import { useSubExpense } from "../subExpense/subexpenseHooks";
import { usePaymentMethod } from "../../../hooks/commonhooks/paymentMethod";

export default function ExpenseEntriesTable() {
  const {
    entries,
    selectedEntry,
    deleteEntry,
    fetchById,
    loading,
    fetchTable,
  } = useExpenseEntries();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters, setFilters } = useTableFilters();
  const {fetchExpenses,expenses} = useExpense()
  const {fetchSubExpenseByExpenseId,subExpenses}=useSubExpense()
  const {paymentModes}=usePaymentMethod()
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<any>(null);

  useEffect(()=>{
    fetchExpenses()
  },[])
  useEffect(()=>{
    if(!filters.expense) return
    fetchSubExpenseByExpenseId(filters.expense)
  },[filters.expense])

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

  const handleView = async (row: any) => {
    await fetchById(row._id);
    setIsView(true);
  };

  //   const handleEdit = async (row: any) => {
  //     await fetchById(row._id);
  //     setIsEdit(true);
  //     setIsFormOpen(true);
  //   };

  const handleDelete = (row: any) => {
    setToDelete(row);
    setConfirmOpen(true);
  };

  const confirmDelete = (ok: boolean) => {
    setConfirmOpen(false);
    if (ok && toDelete) deleteEntry(toDelete._id);
  };

  const columns = [
    { id: "id", label: "S.No" },
    { id: "createdAt", label: "Expense Date" },
    { id: "expense", label: "Expense" },
    { id: "subExpense", label: "Sub Expense" },
    { id: "paymentMethod", label: "Payment Method" },
    { id: "paymentProvider", label: "Payment Provider" },
    { id: "amount", label: "Amount" },
  ];

  const tableData = entries.map((item, index) => ({
    id: index + 1,
    _id: item?._id,
    createdAt: formatDateTime(item.createdAt),
    expense: item?.expenses?.expenseName,
    subExpense: item?.subExpenses?.name,
    paymentMethod: item?.paymentmode?.mode,
    paymentProvider: item?.paymentProviders?.providerName,
    amount: item.amount,
  }));

  return (
    <>
      <Helmet>
        <title>{`Expense Entries - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h4" flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Expense" },
                { label: "Expense Entries", active: true },
              ]}
            />
          </Typography>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              setIsEdit(false);
              setIsFormOpen(true);
            }}
          >
            Add Expense Entry
          </Button>
        </Box>

        <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
          <FilterBar
            rows={[
              <Box display="flex" gap={1} flexWrap="wrap">
                <FilterItem>
                  <Search onSearch={(v) => setSearch(v)} loading={loading} />
                </FilterItem>
                <FilterItem>
                  <DropDown
                    label="Expense"
                    value={filters.expense}
                    options={expenses}
                    optionLabel="expenseName"
                    optionValue="_id"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        expense: e.target.value,
                      }))
                    }
                    size="small"
                  />
                </FilterItem>
                
                <FilterItem>
                  <DropDown
                    label="Sub Expense"
                    value={filters.subExpense}
                    options={subExpenses}
                    optionLabel="name"
                    optionValue="_id"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        subExpense: e.target.value,
                      }))
                    }
                    size="small"
                  />
                </FilterItem>
                <FilterItem>
                  <DropDown
                    label="Payment Mode"
                    value={filters.paymentMethod}
                    options={paymentModes}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        paymentMethod: e.target.value,
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
            loading={loading}
            // onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>

        {isFormOpen && (
          <ExpenseEntriesForm
            isEdit={isEdit}
            onClose={() => setIsFormOpen(false)}
            onSubmitSuccess={() => setIsFormOpen(false)}
          />
        )}

        {isView && selectedEntry && (
          <CommonView
            open
            onClose={() => setIsView(false)}
            title="View Expense"
            maxWidth="sm"
          >
            <ExpenseEntriesView data={selectedEntry} />
          </CommonView>
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onClose={confirmDelete}
          title="Delete Expense Entry"
          message="Are you sure you want to delete this entry?"
          positiveButtonLabel="Yes"
          negativeButtonLabel="No"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
