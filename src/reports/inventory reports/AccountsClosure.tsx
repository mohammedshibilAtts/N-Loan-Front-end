import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { ITEM_TABLE } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Box, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';


function AccountsClosure() {
    const navigate = useNavigate()
     const handlePrint =(row:{loanAccountId:string})=>{
        console.log("---------------------------------------------",row)
        navigate(`/manageloan/print-closure/${row.loanAccountId}`)
    }
  return (
    <>
    <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
    </Helmet>

    <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className='text-[#737791]'>Inventory</span> / Accounts Closure
            </Typography>
        </Box>

        <DataTable
            actionType={ITEM_TABLE}
            procedureName="accountClosure"
            endpoint={API_ENDPOINTS.SP.POST}
            table_type= "reports-accountClosure"
            tableName="itemDetail"
            exportOptions={true}
            onPrint={handlePrint}
        />
    </DashboardContent>
   </>
  )
}

export default AccountsClosure