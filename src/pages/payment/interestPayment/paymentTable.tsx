import { Helmet } from "react-helmet-async"
import { DashboardContent } from "../../../layouts/dashboard"
import { Stack } from "@mui/material"
import { Button, Box } from "@mui/material"
import { Iconify } from "../../../components/iconify"
import { DataTable } from "../../../components/datatable/datatableComp"
import { CONFIG } from '../../../config-global';
import { useNavigate } from "react-router-dom"
import { PAYMENT_TABLE } from "../../../store/actionTypes";
import API_ENDPOINTS from "../../../services/endpoints";
import { Breadcrumb } from "../../../components/breadCrumbComp"



interface PaymentTableProps {
  filterBasis?: number;
}

function PaymentTable({ filterBasis }: PaymentTableProps) {

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" flexGrow={1} >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Breadcrumb
                items={[
                  { label: "Payment" },
                  { label: "Manage Payment", active: true },
                ]}
              />
            </Stack>
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/payment/interest-payment")}
          >
            Add Payment
          </Button>
        </Box>

        <DataTable
          actionType={PAYMENT_TABLE}
          endpoint={API_ENDPOINTS.SP.POST}
          tableName="Payment"
          populateFields={["customerId"]}
          table_type={"Payment_Table"}
          filters={filterBasis ? { paymentBasis: filterBasis } : {}}
        // onDelete={handleDelete}
        // onView={handleView}
        // onEdit={handleEdit}
        />


      </DashboardContent>
    </>
  )
}

export default PaymentTable