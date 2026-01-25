import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button, Chip, Stack } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";

import { BranchForm } from "./branchForm";
import { useBranch } from "./branchHooks";
import SubTable from "../../../components/subTable/subTable";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";
import { formatDateTime } from "../../../utils/dateFormate";

const branchTypeOptions = [
  { value: 1, label: "Head Office" },
  { value: 2, label: "Sub Branch" },
];

export default function BranchTable() {
  const {
    branches,
    loading,
    fetchTable,
    deleteBranch,
    fetchBranchById,
    selectedBranch,
    setSelectedBranch,
  } = useBranch();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters, setFilters } = useTableFilters();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<any>(null);

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
    await fetchBranchById(row._id);
    setIsFormOpen(true);
  };

  /* ------------------ DELETE ------------------ */
  const handleDelete = (row: any) => {
    setBranchToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && branchToDelete) {
      await deleteBranch(branchToDelete._id);
    }
  };

  /* ------------------ FORM ------------------ */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedBranch(null);
  };

  const handleSubmitSuccess = () => {
    handleCloseForm();
  };

  const BranchTypeBadge = (stockType: number) => {
    const config: Record<
      number,
      { label: string; color: "success" | "error" | "default" }
    > = {
      1: { label: "Head Office", color: "default" },
      2: { label: "Sub Branch", color: "default" },
    };

    const { label, color } = config[stockType] || {
      label: "N/A",
      color: "default",
    };

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{
          width: 80, // 🔒 fixed width
          height: 26, // 🔒 fixed height
          fontSize: "11px",
          fontWeight: 600,
          textAlign: "center",
          "& .MuiChip-label": {
            padding: 0,
            width: "100%",
            px: 1,
          },
        }}
      />
    );
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "branchName", label: "Name" },
    { id: "branchType", label: "Branch Type" },
    // { id: "active", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = branches.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    branchName: item.name,
    branchType: BranchTypeBadge(item.branchType),
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Branch - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[{ label: "Settings" }, { label: "Branch", active: true }]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Branch
          </Button>
        </Box>

        <Box bgcolor="#ffffff" px={2} py={1} sx={{ borderRadius: 1 }}>
          <FilterBar
            rows={[
              <Box display="flex" gap={1} flexWrap="wrap">
                <FilterItem>
                  <Search onSearch={(v) => setSearch(v)} loading={loading} />
                </FilterItem>
                <FilterItem>
                  <DropDown
                    label="Branch Type"
                    value={filters.branchType}
                    options={branchTypeOptions}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        branchType: e.target.value,
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
          <BranchForm
            isEdit={isEdit}
            branchData={selectedBranch}
            onClose={handleCloseForm}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmDelete}
          title="Delete Branch"
          message="Are you sure you want to delete this branch?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
