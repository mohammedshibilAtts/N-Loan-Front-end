import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../../config-global";
import { DataTable } from "../../../components/datatable/datatableComp";
import API_ENDPOINTS from "../../../services/endpoints";
import { LOAN_CLOSURE_TABLE } from "../../../store/actionTypes";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";

function LoanClosureHistory() {
  let navigate = useNavigate();

  // Handle view action
  const handleView = (row: { _id: string }) => {
    navigate(`/manageloan/loan-closure/${row._id}`);
  };

//   const handlePrint = (row: { _id: string }) => {
//     navigate(`/manageloan/loan-print/${row._id}`);
//   };

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
                  { label: "Loan Closure History", active: true },
                ]}
              />
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/manageloan/loanClosure")}
          >
            Loan Closure
          </Button>
        </Box>

        <DataTable
          actionType={LOAN_CLOSURE_TABLE}
          endpoint={API_ENDPOINTS.SP.POST}
          tableName="loanClosure"
          table_type= "loanClosureHistory"
          populateFields={["customerId", "loanId", "closedBy"]}
          filters={{}}
          onView={handleView}
        />
      </DashboardContent>
    </>
  );
}

export default LoanClosureHistory;
