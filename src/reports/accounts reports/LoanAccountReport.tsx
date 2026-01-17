import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { LOANACC_REPORTS } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Box, Typography} from '@mui/material';

export default function LoanAccountReport() {
  return (
    <>
    <Helmet>
       <title>{`Users - ${CONFIG.appName}`}</title>
   </Helmet>
 
   <DashboardContent>
       <Box display="flex" alignItems="center" mb={5}>
       <Typography variant="h6" flexGrow={1} marginLeft={2}>
           <span className='text-[#737791]'>Accounts</span> / LoanAccount Report
           </Typography>
       </Box>
 
       <DataTable
           actionType={LOANACC_REPORTS}
           endpoint={API_ENDPOINTS.SP.POST}
           table_type= "reports-loanAccountReport"
           procedureName = "loanAccountReport"
           tableName="loanAccount"
           isPopulated={false}
           exportOptions={true}
       />
    </DashboardContent>
   </>
   
  )
}
