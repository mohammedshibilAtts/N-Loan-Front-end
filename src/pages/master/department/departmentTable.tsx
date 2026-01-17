import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button, Stack } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { DepartmentForm } from "./departmentForm";

import SubTable from "../../../components/subTable/subTable";
import { useDepartment } from "./departmenthooks";
import StatusToggle from "../../../components/common/toggle";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import { formatDateTime } from "../../../utils/dateFormate";

export default function DepartmentTable() {
  const {
    departments,
    loading,
    deleteDepartment,
    updateDepartmentStatus,
    fetchDepartmentTable,
  } = useDepartment();

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
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<any>(null);

  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search, filters]);

  // Fetch data
  useEffect(() => {
    fetchDepartmentTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
      filters,
    }).then(setTotalCount);
  }, [page, rowsPerPage, search, filters]);

  /* ------------------ EDIT ------------------ */
  const handleEdit = (row: any) => {
    setSelectedDepartment(row);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  /* ------------------ DELETE ------------------ */
  const handleDelete = (row: any) => {
    setDepartmentToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && departmentToDelete) {
      await deleteDepartment(departmentToDelete._id);
    }
  };

  /* ------------------ FORM ------------------ */
  const handleFormClose = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedDepartment(null);
  };

  const handleFormSubmitSuccess = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedDepartment(null);
  };

  const handleToggleStatus = async (row: any) => {
    await updateDepartmentStatus(row._id);
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "departmentName", label: "Department Name" },
    { id: "active", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const columnsData = departments.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    departmentName: item.departmentName,
    active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Department - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "Department", active: true },
              ]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Department
          </Button>
        </Box>

        <Box bgcolor="#ffffff" px={2} py={1} sx={{ borderRadius: 1 }}>
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
            data={columnsData}
            loading={loading}
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
        {isFormOpen && (
          <DepartmentForm
            isEdit={isEdit}
            departmentData={selectedDepartment}
            onClose={handleFormClose}
            onSubmitSuccess={handleFormSubmitSuccess}
          />
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmDelete}
          title="Delete Department"
          message="Are you sure you want to delete this Department?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
