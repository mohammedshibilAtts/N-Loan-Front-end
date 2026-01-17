
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

export default function BranchTable() {
  const {
    branches,
    loading,
    fetchBranches,
    deleteBranch,
    fetchBranchById,
    selectedBranch,
    setSelectedBranch,
  } = useBranch();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<any>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

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
            px:1
          },
        }}
      />
    );
  };



  const columns = [
    { id: "id", label: "S.NO" },
    { id: "branchName", label: "Name" },
    { id: "branchType", label: "Third Party" },
    // { id: "active", label: "Status" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = branches.map((item: any, index: number) => ({
    id: index + 1,
    _id: item._id,
    branchName: item.branchName,
    branchType:BranchTypeBadge(item.branchType),
    //  active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
    createdAt: item.createdAt,
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

        <SubTable
          coloums={columns}
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

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
