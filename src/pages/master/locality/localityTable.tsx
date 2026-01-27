import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import Addbutton from "../../../components/addButton/addbutton";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import SubTable from "../../../components/subTable/subTable";
import { LocalityForm } from "./localityForm";
import { useLocality } from "./localityhooks";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import FilterItem from "../../../components/filterLayout/filterItem";
import FilterBar from "../../../components/filterLayout/filterLayout";
import Search from "../../../components/search/search";
import { formatDateTime } from "../../../utils/dateFormate";

export default function LocalityTable() {
  const {
    localities,
    loading,
    deleteLocality,
    selectedLocality,
    setSelectedLocality,
    fetchTable,
  } = useLocality();

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
  const [localityToDelete, setLocalityToDelete] = useState<any>(null);

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
  }, [page, rowsPerPage, search, filters,isFormOpen]);

  /* -------- EDIT -------- */
  const handleEdit = (row: any) => {
    setSelectedLocality(row);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  /* -------- DELETE -------- */
  const handleDelete = (row: any) => {
    setLocalityToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && localityToDelete) {
      await deleteLocality(localityToDelete._id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedLocality(null);
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "name", label: "Locality Name" },
    { id: "createdAt", label: "Created At" },
  ];

  const data = localities.map((item, index) => ({
    id:page * rowsPerPage + index + 1,
    _id: item._id,
    name: item.name,
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Locality - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "Locality", active: true },
              ]}
            />
          </Stack>

          <Addbutton
            title="Add Locality"
            onClick={() => setIsFormOpen(true)}
            mainMenu="Masters"
            subMenu="Locality"
          />
        </Box>

        <Box bgcolor="#fff" p={2} borderRadius={1}>
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
            data={data}
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
          <LocalityForm
            isEdit={isEdit}
            localityData={selectedLocality}
            onClose={handleCloseForm}
            onSubmitSuccess={handleCloseForm}
          />
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmDelete}
          title="Delete Locality"
          message="Are you sure you want to delete this locality?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
