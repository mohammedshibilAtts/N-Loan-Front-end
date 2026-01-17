import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { INTEREST_COLLECTION_REPORTS ,BRANCH_LIST,PAYMENT_MODE_LIST} from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Autocomplete, Box, TextField, Typography} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../../store/actions';
import { ValidationField } from "../../validations/schemaBuilder";
import { Grid } from '@mui/material';
 
 
 
interface FilterProps {
  onFilterChange: (fieldName: string, value: any) => void;
}
 
 
 
export default function InterestCollection() {
  return (
    <>
    <Helmet>
       <title>{`Users - ${CONFIG.appName}`}</title>
   </Helmet>
 
   <DashboardContent>
       <Box display="flex" alignItems="center" mb={5}>
       <Typography variant="h6" flexGrow={1} marginLeft={2}>
           <span className='text-[#737791]'>Accounts</span> / InterestCollection Report
           </Typography>
       </Box>
 
       <DataTable
           actionType={INTEREST_COLLECTION_REPORTS}
           endpoint={API_ENDPOINTS.SP.POST}
           table_type= "reports-interstCollectionreport"
           procedureName = "interestCollection"
           tableName="loanAccount"
           isPopulated={false}
           exportOptions={true}
       />
    </DashboardContent>
   </>
  )
}
 
 
export const InterestCollectionFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
 
    const [mode, setMode] = useState<{ mode: string; _id: string }[]>([]);
    const [branch, setBranch] = useState<{ branchName: string; _id: string }[]>([]);
 
    const { branchList, modeList } = useSelector((state: any) => ({
   
      branchList: state[BRANCH_LIST]?.data,
      modeList: state[PAYMENT_MODE_LIST]?.data,
    }));
 
    const dispatch = useDispatch();
 
    useEffect(() => {
     
      if (modeList?.success) setMode(modeList.data.data);
      if (branchList?.success) setBranch(branchList.data.data);
    }, [ modeList, branchList]);
 
    useEffect(() => {
     
      dispatch(
        apiRequest(PAYMENT_MODE_LIST, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAll",
          params: { tableName: "paymentMode" },
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
     
        case "mode":
          return mode.map((i) => ({ label: i.mode, value: i._id }));
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
      { name: "mode", label: "Select mode", placeHolder: "Select mode" },
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
 