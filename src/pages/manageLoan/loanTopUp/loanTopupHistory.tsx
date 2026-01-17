import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../config-global";
import { DataTable } from "../../../components/datatable/datatableComp";
import API_ENDPOINTS from "../../../services/endpoints";
import {
  LOAN_ACC_UPDATE_FIELD_RES,
  LOAN_TOP_UP_TABLE,
} from "../../../store/actionTypes";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button } from "@mui/material";
import { Iconify } from "../../../components/iconify";
// import { useDispatch } from 'react-redux';
// import { apiRequest } from '../../store/actions';

import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";

function LoanTopUpHistory() {
  // const [isFormOpen, setIsFormOpen] = useState(false);
  // const [isEdit, setEdit] = useState<any>(false);

  // const dispatch = useDispatch();
  let navigate = useNavigate();

  // Handle view action
  const handleView = (row: { _id: string }) => {
    navigate(`/manageloan/viewexistingloan/${row._id}`);
  };

  // Handle edit action
  // const handleEdit = (row: any) => {
  // navigate(`/manageloan/viewexistingloan/${row._id}`)
  // };

  const handlePrint = (row: { _id: string }) => {
    navigate(`/manageloan/loan-print/${row._id}`);
  };

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
                  { label: "Loan Top Up History", active: true },
                ]}
              />
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/manageloan/topup")}
          >
            Loan Top Up
          </Button>
        </Box>

        <DataTable
          actionType={LOAN_TOP_UP_TABLE}
          endpoint={API_ENDPOINTS.SP.POST}
          tableName="loanTopup"
          populateFields={["customerId", "loanId","loanAccId"]}
          filters={{}}
          onView={handleView}
          onPrint={handlePrint}
          // onEdit={handleEdit}
          statusType={LOAN_ACC_UPDATE_FIELD_RES}
        />
      </DashboardContent>
    </>
  );
}

export default LoanTopUpHistory;
