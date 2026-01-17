import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { ITEM_TABLE,BRANCH_LIST } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Autocomplete, Box, TextField, Typography} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../store/actions';
import { ValidationField } from "../../validations/schemaBuilder";
// import { Grid } from '@mui/material';


interface FilterProps {
    onFilterChange: (fieldName: string, value: any) => void;
  }


function metalWiseReports() {

   
    
  return (
       <>
    <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
    </Helmet>

    <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h6" flexGrow={1} marginLeft={2}>
            <span className='text-[#737791]'>Inventory</span> / Metal Wise Report
            </Typography>
        </Box>

        <DataTable
            actionType={ITEM_TABLE}
            endpoint={API_ENDPOINTS.SP.POST}
            table_type= "reports-metalWise"
            tableName="itemDetail"
            isPopulated={false}
            populateFields={["accountId","itemId","purityId","metalId"]}
            aggregateFields={{
              targetField: "netWt"
        }}
        exportOptions={true}
        search_visiblity={false}
        />
    </DashboardContent>
   </>
  )
}

export default metalWiseReports



export const BranchWiseFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  
    const [branch, setBranch] = useState<{ branchName: string; _id: string }[]>([]);
  
    const { branchList} = useSelector((state: any) => ({
     
      branchList: state[BRANCH_LIST]?.data,

    }));
  
    const dispatch = useDispatch();
  
    useEffect(() => {
     
      if (branchList?.success) setBranch(branchList.data.data);
    }, [branchList]);
  
    useEffect(() => {
    
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
      { name: "branchId", label: "Branch", placeHolder: "Select Branch" }
    ];
  
    return (
       <Box sx={{
        // mx:2,
       }}>
      
        {fields.map((field) => (
      
            <Autocomplete
              options={getOptionsForField(field.name)}
              getOptionLabel={(option) => option.label}
              value={getCurrentValue(field.name)}
              onChange={(_, value) => handleDropdownChange(field.name, value)}
              renderInput={(params) => (
                <TextField {...params} placeholder={field.placeHolder} variant="outlined" />
              )}
            />
      
        ))}
    
       </Box> 
    );
  };