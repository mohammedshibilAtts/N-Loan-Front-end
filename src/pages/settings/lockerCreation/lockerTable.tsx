import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../../components/breadCrumbComp";

import type { Locker } from "./api.locker";
import { useLocker } from "./lockerHooks";
import SubTable from "../../../components/subTable/subTable";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { formatDateTime } from "../../../utils/dateFormate";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";

export default function LockerTable() {
  const navigate = useNavigate();
  const { lockers, loading, deleteLocker, fetchTable } = useLocker();

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [lockerToDelete, setLockerToDelete] = useState<Locker | null>(null);

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch } = useTableFilters();

  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search]);

  // Fetch data
  useEffect(() => {
    fetchTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
    }).then(setTotalCount);
  }, [page, rowsPerPage, search]);

  /* ---------- ACTIONS ---------- */

  const handleEdit = (row: Locker) => {
    navigate(`/locker/editlocker/${row._id}`);
  };

  const handleDelete = (row: Locker) => {
    setLockerToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmClose = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && lockerToDelete) {
      await deleteLocker(lockerToDelete._id);
      setLockerToDelete(null);
    }
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "lockerName", label: "Name" },
    { id: "licenseNo", label: "LIC NO" },
    { id: "mobile", label: "Mobile" },
    { id: "BranchName", label: "Branch" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = lockers.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    lockerName: item.name,
    licenseNo: item.licenseNo,
    mobile: item.mobile,
    BranchName: item.branchName,
    createdAt: formatDateTime(item.createdAt),
  }));

  console.log(lockers);

  return (
    <>
      <Helmet>
        <title>{`Lockers - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Box flexGrow={1} px={2}>
            <Breadcrumb
              items={[{ label: "Locker" }, { label: "Lockers", active: true }]}
            />
          </Box>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/locker/locker-creation")}
          >
            Add Locker
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
        <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmClose}
          title="Delete Locker"
          message="Are you sure you want to delete this locker? You will not be able to recover it."
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
