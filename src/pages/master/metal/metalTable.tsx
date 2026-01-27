import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Stack } from "@mui/material";
import { MetalForm } from "./metalForm";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import Addbutton from "../../../components/addButton/addbutton";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { useMetal } from "./metalhooks";
import SubTable from "../../../components/subTable/subTable";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import { formatDateTime } from "../../../utils/dateFormate";
import Search from "../../../components/search/search";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";

export default function MetalTable() {
  const { metals, loading, deleteMetal, fetchMetalTable } = useMetal();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [metalToDelete, setMetalToDelete] = useState<any>(null);
  const [selectedMetal, setSelectedMetal] = useState<any>(null);

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters } = useTableFilters();

  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search, filters]);

  // Fetch data
  useEffect(() => {
    fetchMetalTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
      filters,
    }).then(setTotalCount);
  }, [page, rowsPerPage, search, filters,isFormOpen]);

  const handleEdit = async (row: any) => {
    setIsEdit(true);
    setIsFormOpen(true);
    setSelectedMetal(row);
  };
  const handleFormSubmitSuccess = () => {
    setIsFormOpen(false);
    setIsEdit(false);
  };
  // Delete
  const handleDelete = (row: any) => {
    console.log(row);
    setMetalToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && metalToDelete) {
      await deleteMetal(metalToDelete._id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedMetal(null);
  };

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "metalName", label: "Metal Name" },
    { id: "createdAt", label: "Created At" },
  ];

  const columnsData = metals?.map((item: any, index: any) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    metalName: item.metalName,
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Metal - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[{ label: "Masters" }, { label: "Metal", active: true }]}
            />
          </Stack>

          <Addbutton
            title="Add Metal"
            onClick={() => setIsFormOpen(true)}
            mainMenu="Masters"
            subMenu="Metal"
          />
        </Box>

        <Box bgcolor={"#ffffff"} px={2} py={1} sx={{ borderRadius: 1 }}>
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
            coloums={coloums}
            data={columnsData}
            onDelete={handleDelete}
            onEdit={handleEdit}
            loading={loading}
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>

        {isFormOpen && (
          <MetalForm
            isEdit={isEdit}
            onSubmitSuccess={handleFormSubmitSuccess}
            onClose={handleFormClose}
            metalData={selectedMetal}
          />
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmDelete}
          title="Delete Metal"
          message="Are you sure you want to delete this Metal?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
