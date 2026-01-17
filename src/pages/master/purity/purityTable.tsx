import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Stack, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { Breadcrumb } from "../../../components/breadCrumbComp";
// import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { PurityForm } from "./purityForm";
import SubTable from "../../../components/subTable/subTable";
import { usePurity } from "./purityhooks";
import { formatDateTime } from "../../../utils/dateFormate";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";
import { useMetal } from "../metal/metalhooks";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";

export default function PurityTable() {
  const { purities, loading,  fetchPuritiesTable } = usePurity();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPurity, setSelectedPurity] = useState<any>(null);
  // const [confirmOpen, setConfirmOpen] = useState(false);
  // const [purityToDelete, setPurityToDelete] = useState<any>(null);

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters, setFilters } = useTableFilters();
  const { fetchMetals, metals } = useMetal();

  useEffect(() => {
    fetchMetals();
  }, []);
  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search, filters]);

  // Fetch data
  useEffect(() => {
    fetchPuritiesTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
      filters,
    }).then(setTotalCount);
  }, [page, rowsPerPage, search, filters]);

  /* ------------------ EDIT ------------------ */
  // const handleEdit = (row: any) => {
  //   setSelectedPurity(row); // already have data
  //   setIsEdit(true);
  //   setIsFormOpen(true);
  // };

  /* ------------------ DELETE ------------------ */
  // const handleDelete = (row: any) => {
  //   setPurityToDelete(row);
  //   setConfirmOpen(true);
  // };

  // const handleConfirmDelete = async (confirmed: boolean) => {
  //   setConfirmOpen(false);
  //   if (confirmed && purityToDelete) {
  //     await deletePurity(purityToDelete._id);
  //   }
  // };

  /* ------------------ FORM ------------------ */
  const handleFormClose = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedPurity(null);
  };

  const handleFormSubmitSuccess = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedPurity(null);
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "purityName", label: "Purity Name" },
    { id: "metalId", label: "Metal" },
    { id: "createdAt", label: "Created At" },
  ];

  const columnsData = purities.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    purityName: item.purityName,
    metalId: item.metal?.metalName || "-",
    createdAt: formatDateTime(item.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`Purity - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[{ label: "Masters" }, { label: "Purity", active: true }]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Purity
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
                    label="Metal"
                    value={filters.metalId}
                    options={metals}
                    optionLabel="metalName"
                    optionValue="_id"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        metalId: e.target.value,
                      }))
                    }
                    size="small"
                  />
                </FilterItem>
              </Box>
              
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
          />
        </Box>

        {isFormOpen && (
          <PurityForm
            isEdit={isEdit}
            purityData={selectedPurity}
            onClose={handleFormClose}
            onSubmitSuccess={handleFormSubmitSuccess}
          />
        )}

        {/* <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmDelete}
          title="Delete Purity"
          message="Are you sure you want to delete this Purity?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        /> */}
      </DashboardContent>
    </>
  );
}
