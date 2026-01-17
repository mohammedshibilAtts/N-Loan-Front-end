import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { CUSTOMER_REPORTS_TABLE } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Box, Typography} from '@mui/material';

function CustomerHistory() {
  return (
    
      <>
     <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
    </Helmet>

    <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className='text-[#737791]'>Accounts</span> / Customer Report
            </Typography>
        </Box>

        <DataTable
            actionType={CUSTOMER_REPORTS_TABLE}
            endpoint={API_ENDPOINTS.SP.POST}
            table_type= "reports-customerReport"
            procedureName = "customerReport"
            tableName="loanAccount"
            isPopulated={false}
            exportOptions={true}
        />
     </DashboardContent>
    </>
  
  )
}

export default CustomerHistory