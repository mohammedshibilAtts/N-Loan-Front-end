import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { ITEM_TABLE,LOAN_LIST,BRANCH_LIST } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Autocomplete, Box, Grid, Typography} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../../store/actions';
import { ValidationField } from "../../validations/schemaBuilder";
import { TextField } from '@mui/material';

interface FilterProps {
  onFilterChange: (fieldName: string, value: any) => void;
}


function LoanHistory() {



  return (
    <>
    <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
    </Helmet>

    <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className='text-[#737791]'>Inventory</span> / Loan History
            </Typography>
        </Box>

        <DataTable
            actionType={ITEM_TABLE}
            procedureName="loanHistory"
            endpoint={API_ENDPOINTS.SP.POST}
            table_type= "reports-loanHistory"
            tableName="itemDetail"
            isPopulated={false}
            populateFields={["accountId"]}
            aggregateFields={{
              targetField: "netWt",
              filters:{
                loanStatus:0
              }
        }}
        exportOptions={true}
        />
    </DashboardContent>
   </>
  )
}

export default LoanHistory

export const LoanHistoryFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  
    const [loan, setLoan] = useState<{ loanName: string; _id: string }[]>([]);
    const [branch, setBranch] = useState<{ branchName: string; _id: string }[]>([]);
  
    const { branchList, loanList } = useSelector((state: any) => ({
    
      branchList: state[BRANCH_LIST]?.data,
      loanList: state[LOAN_LIST]?.data,
    }));
  
    const dispatch = useDispatch();
  
    useEffect(() => {
     
      if (loanList?.success) setLoan(loanList.data.data);
      if (branchList?.success) setBranch(branchList.data.data);
    }, [ loanList, branchList]);
  
    useEffect(() => {
     
      dispatch(
        apiRequest(LOAN_LIST, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAll",
          params: { tableName: "loans" },
        })
      );
      dispatch(
        apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAll",
          params: { tableName: "branch" },
        })
      );
    }, [dispatch]);
  
    const getOptionsForField = (fieldName: string) => {
      switch (fieldName) {
        
        case "branchId":
          return branch.map((b) => ({ label: b.branchName, value: b._id }));
     
        case "loan":
        case "loanId":
          return loan.map((i) => ({ label: i.loanName, value: i._id }));
        default:
          return [];
      }
    };
  
    
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  
    const getCurrentValue = (fieldName: string) => {
      const value = formValues[fieldName];
      if (value === null || value === undefined || value === "") return null;
      const options = getOptionsForField(fieldName);
      return options.find((opt) => opt.value === value) || null;
    };
  
    const handleDropdownChange = (fieldName: string, selectedOption: any) => {
      const value = selectedOption?.value || "";
   
      setFormValues((prev) => ({ ...prev, [fieldName]: value }));
      
      onFilterChange(fieldName, value);
    };
  
    const fields:ValidationField[] = [
      { name: "branchId", label: "Branch", placeHolder: "Select Branch" },
      { name: "loanId", label: "Select loan", placeHolder: "Select loan" },
    ];
  
    return (
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <Autocomplete
              options={getOptionsForField(field.name)}
              getOptionLabel={(option) => option.label}
              value={getCurrentValue(field.name)}
              onChange={(_, value) => handleDropdownChange(field.name, value)}
              renderInput={(params) => (
                <TextField {...params} placeholder={field.placeHolder} variant="outlined" />
              )}
            />
          </Grid>
        ))}
      </Grid>
    );
  };