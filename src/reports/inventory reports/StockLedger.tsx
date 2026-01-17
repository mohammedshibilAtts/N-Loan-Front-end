import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { STOCK_LEDGER } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Box, Typography} from '@mui/material';

export default function StockLedger() {
  return (
    <>
    <Helmet>
       <title>{`Users - ${CONFIG.appName}`}</title>
   </Helmet>
 
   <DashboardContent>
       <Box display="flex" alignItems="center" mb={5}>
       <Typography variant="h6" flexGrow={1} marginLeft={2}>
           <span className='text-[#737791]'>Inventory</span> / Stock Ledger
           </Typography>
       </Box>
 
       <DataTable
           actionType={STOCK_LEDGER}
           endpoint={API_ENDPOINTS.SP.POST}
           table_type= "reports-stockLedger"
           procedureName = "stockLedger"
           tableName="loanAccount"
           isPopulated={false}
           exportOptions={true}
       />
    </DashboardContent>
   </>
  )
}
