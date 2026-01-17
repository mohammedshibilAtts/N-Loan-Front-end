import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../config-global";

import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";

import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import SubTable from "../../../components/subTable/subTable";
import { useLoanAccount } from "../customer/loanAccountHooks";
import { useEffect } from "react";

function ViewLoan() {
  let navigate = useNavigate();

  const { fetchLoans, loading, loans } = useLoanAccount();

  // Handle view action
  const handleView = (row: { _id: string }) => {
    navigate(`/manageloan/viewexistingloan/${row._id}`);
  };

  // const handlePrint = (row: { _id: string }) => {
  //   navigate(`/manageloan/loan-print/${row._id}`);
  // };

  useEffect(() => {
    fetchLoans();
  }, []);

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "loanNo", label: "Loan No" },
    { id: "name", label: "Customer Name" },
    { id: "mobile", label: "Mobile" },
    { id: "loanId", label: "Loan Type" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = loans.map((item: any, index: number) => ({
    id: index + 1,
    _id: item._id,
    loanNo: item.loanNo,
    name: item.customerId,
    mobile: item.customerId,
    loanId: item.loanId,
    createdAt: item.createdAt,
  }));

  return (
    <>
      <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" mb={3} flexGrow={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Breadcrumb
                items={[
                  { label: "Manage Loan" },
                  { label: "Existing Loan", active: true },
                ]}
              />
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/manageloan/new-loan")}
          >
            Add Loans
          </Button>
        </Box>

        <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
          <SubTable
            coloums={columns}
            data={tableData}
            loading={loading}
            onView={handleView}
          />
        </Box>
      </DashboardContent>
    </>
  );
}

export default ViewLoan;
