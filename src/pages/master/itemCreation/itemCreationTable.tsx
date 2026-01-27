import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { Iconify } from "../../../components/iconify";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { ItemCreationForm } from "./itemCreationForm";
import { useItem } from "./itemhooks";
import SubTable from "../../../components/subTable/subTable";
import StatusToggle from "../../../components/common/toggle";
import { useTablePagination } from "../../../hooks/commonhooks/paginationHooks";
import { formatDateTime } from "../../../utils/dateFormate";
import { useTableFilters } from "../../../hooks/commonhooks/tableFilterHooks";
import FilterBar from "../../../components/filterLayout/filterLayout";
import FilterItem from "../../../components/filterLayout/filterItem";
import Search from "../../../components/search/search";
import DropDown from "../../../components/dropdown/dropdown";
import { useMetal } from "../metal/metalhooks";
import { usePurity } from "../purity/purityhooks";

export default function ItemCreationTable() {
  const {
    items,
    loading,
    fetchItemById,
    deleteItem,
    selectedItem,
    setSelectedItem,
    updateItemStaus,
    fetchTable,
  } = useItem();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch, filters,setFilters } = useTableFilters();
  const {fetchMetals,metals}=useMetal()
  const {fetchPuritiesByMetal,purities} = usePurity()

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  useEffect(()=>{
    fetchMetals()
  },[])

  useEffect(()=>{
    fetchPuritiesByMetal(filters.metalId)
  },[filters.metalId])
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
  }, [page, rowsPerPage, search, filters,isFormOpen]);

  /* ------------------ EDIT ------------------ */
  const handleEdit = async (row: any) => {
    await fetchItemById(row._id);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  /* ------------------ DELETE ------------------ */
  const handleDelete = (row: any) => {
    setItemToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && itemToDelete) {
      await deleteItem(itemToDelete._id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEdit(false);
    setSelectedItem(null);
  };

  const handleToggleStatus = async (row: any) => {
    await updateItemStaus(row._id);
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "itemName", label: "Item Name" },
    { id: "metalName", label: "Metal" },
    { id: "purityName", label: "Purity" },
    { id: "active", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const data = items.map((item: any, index: number) => ({
    id: page * rowsPerPage + index + 1,
    _id: item._id,
    itemName: item.itemName,
    metalName: item.metal?.metalName,
    purityName: item.purity?.purityName,
    active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
    createdAt: formatDateTime(item.createdAt),
  }));
  return (
    <>
      <Helmet>
        <title>{`Item Creation - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "Item Creation", active: true },
              ]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Item
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
                 <FilterItem>
                  <DropDown
                    label="Purity"
                    value={filters.purityId}
                    options={purities}
                    optionLabel="purityName"
                    optionValue="_id"
                    onChange={(e) =>
                      setFilters((prev: any) => ({
                        ...prev,
                        purityId: e.target.value,
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
            data={data}
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
          <ItemCreationForm
            isEdit={isEdit}
            itemData={selectedItem} // ✅ ONLY findById data
            onClose={handleCloseForm}
            onSubmitSuccess={handleCloseForm}
          />
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onClose={handleConfirmDelete}
          title="Delete Item"
          message="Are you sure you want to delete this Item?"
          positiveButtonLabel="Delete"
          negativeButtonLabel="Cancel"
          showNegativeButton
        />
      </DashboardContent>
    </>
  );
}
