import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button, Stack } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../../components/breadCrumbComp";

import SubTable from "../../../components/subTable/subTable";
import { useEmployee } from "./employeeHooks";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { formatDateTime } from "../../../utils/dateFormate";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";

function ViewEmployee() {
  const navigate = useNavigate();

  const { employees, loading, deleteEmployee, fetchTable } = useEmployee();
  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters } = useTableFilters();

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);

  // Reset page on search/filter change
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

  /* ---------- ACTIONS ---------- */
  const handleView = (row: any) => {
    navigate(`/masters/viewemployee/${row._id}`);
  };

  const handleEdit = (row: any) => {
    navigate(`/masters/editemployee/${row._id}`);
  };

  const handleDelete = (row: any) => {
    setEmployeeToDelete(row);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = async (confirmed: boolean) => {
    setConfirmationDialogOpen(false);

    if (confirmed && employeeToDelete?._id) {
      await deleteEmployee(employeeToDelete._id);
    }
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "username", label: "Name" },
    { id: "mobile", label: "Mobile Number" },
    { id: "userRoleId", label: "Role" },
    { id: "department", label: "Department" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = employees.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    username: item.username,
    mobile: item.mobile,
    userRoleId: item?.role?.roleName,
    department: item?.department?.departmentName,
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Employees - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "View Employee", active: true },
              ]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/masters/createemployee")}
          >
            Add Employee
          </Button>
        </Box>

        {/* ---------- TABLE ---------- */}
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
            onView={handleView}
            onDelete={handleDelete}
            onEdit={handleEdit}
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>

        {/* ---------- CONFIRMATION ---------- */}
        <ConfirmationDialog
          open={confirmationDialogOpen}
          onClose={handleConfirmationDialogClose}
          title="Delete Employee"
          message="Are you sure you want to delete this employee? This action cannot be undone."
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}

export default ViewEmployee;
