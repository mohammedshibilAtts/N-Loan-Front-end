
import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { PAYMENT_LEDGER_RES } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Box, Typography} from '@mui/material';

export default function paymentLedger() {
  return (
    <>
    <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
    </Helmet>

    <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className='text-[#737791]'>Inventory</span> / Payment Mode Ledger
            </Typography>
        </Box>

        <DataTable
            actionType={PAYMENT_LEDGER_RES}
            procedureName="paymentModeLedger"
            endpoint={API_ENDPOINTS.SP.POST}
            table_type= "reports-paymentModeLedger"
            tableName="Payment"
            exportOptions={true}
            search_visiblity={false}
        />
    </DashboardContent>
   </>
  )
}
