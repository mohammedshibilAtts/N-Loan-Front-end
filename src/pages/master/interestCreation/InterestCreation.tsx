// import { Autocomplete, Grid, Button, InputLabel, TextField, Typography, Box, InputAdornment, Stack } from '@mui/material';
// import { useFormik } from 'formik';
// import { useEffect, useState } from 'react'
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ValidationField } from "../../../validations/schemaBuilder";
// import { useValidation } from "../../../validations/useValidation";
// import { useDispatch, useSelector } from 'react-redux';

// import {
//     MARKET_RATE_LIST,
//     INTEREST_CREATE_RES,
//     INTEREST_UPDATE_RES,
//     INTEREST_EDIT_RES,
//     INTEREST_TABLE,
//     INTEREST_DELETE_RES,
// } from "../../../store/actionTypes";
// import API_ENDPOINTS from "../../../services/endpoints";
// import { apiClear, apiRequest } from "../../../store/actions";
// import { DataTable } from '../../../components/datatable/datatableComp';
// import { ConfirmationDialog } from '../../../layouts/components/confirmationDialog';
// import { CircularProgress } from '@mui/material';
// import { Percent } from 'lucide-react';
// import { Breadcrumb } from '../../../components/breadCrumbComp';
// import { Toast } from '../../../components/toast/toast';


// function InterestCreation() {

//     const dispatch = useDispatch();
//     const [isLoading, setIsLoading] = useState(false);
//     const [isEdit, setEdit] = useState(false);
//     const [interstId, setInterestId] = useState<string | null>(null);
//     const [interestData, setInterestData] = useState(null);
//     const [marketRates, setmarketRates] = useState<{ marketRateName: string; _id: string; princiAllowMin: number; princiAllowMax: number }[]>(
//         []
//     );
//     const [selectedOption, setSelectedOption] = useState<{ marketRateName: string; _id: string; princiAllowMin: number; princiAllowMax: number } | null>(null);
//     // const [princiAllowMin, setPrinciAllowMin] = useState<number | string>('');
//     // const [princiAllowMax, setPrinciAllowMax] = useState<number | string>('');
//     const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
//     const [interestToDelete, setInterestToDelete] = useState<any>(null);
//     const [confirmationDialogConfig, setConfirmationDialogConfig] = useState({
//         title: '',
//         message: '',
//         positiveButtonLabel: "Delete",
//         negativeButtonLabel: "Cancel",
//         showNegativeButton: true,
//     });


//     const fields: ValidationField[] = [
//         {
//             name: 'interestName',
//             label: 'Interest Name',
//             type: 'string',
//             required: true
//         },
//         {
//             name: 'marketRate',
//             label: 'Market Value',
//             // options: marketRates,
//             type: 'dropdown',
//         },
//         {
//             name: "princiAllowMin",
//             label: "Principal Allowance (Min)",
//             placeHolder: "Enter min allowance",
//             type: "number",
//             min: selectedOption?.princiAllowMin,
//             max: selectedOption?.princiAllowMax,
//             required: true,
//         },
//         {
//             name: "princiAllowMax",
//             label: "Principal Allowance (Max)",
//             placeHolder: "Enter max allowance",
//             type: "number",
//             min: selectedOption?.princiAllowMin,
//             max: selectedOption?.princiAllowMax,
//             required: true,
//         },
//         {
//             name: "interestMin",
//             label: "Interest Value(Min)",
//             placeHolder: "Enter min allowance",
//             type: "number",
//             required: true,
//         },
//         {
//             name: "interestMax",
//             label: "Interest Value(Max)",
//             placeHolder: "Enter max allowance",
//             type: "number",
//             required: true,
//         },
//     ];


//     const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
//         (e.target as HTMLInputElement).blur();
//         e.preventDefault();
//     }

//     const { InterestCreateResponse, editResponse, updateResponse, marketRate, deleteResponse } = useSelector(
//         (states: any) => ({
//             InterestCreateResponse: states[INTEREST_CREATE_RES]?.data,
//             marketRate: states[MARKET_RATE_LIST]?.data,
//             updateResponse: states[INTEREST_UPDATE_RES]?.data,
//             editResponse: states[INTEREST_EDIT_RES]?.data,
//             deleteResponse: states[INTEREST_DELETE_RES]?.data,

//         })
//     );


//     useEffect(() => {
//         dispatch(apiClear(MARKET_RATE_LIST));
//         dispatch(apiClear(INTEREST_CREATE_RES));
//         dispatch(apiClear(INTEREST_UPDATE_RES));
//         dispatch(apiClear(INTEREST_EDIT_RES));
//         dispatch(apiClear(INTEREST_DELETE_RES));

//         return () => {
//             dispatch(apiClear(MARKET_RATE_LIST));
//             dispatch(apiClear(INTEREST_CREATE_RES));
//             dispatch(apiClear(INTEREST_UPDATE_RES));
//             dispatch(apiClear(INTEREST_EDIT_RES));
//             dispatch(apiClear(INTEREST_DELETE_RES));
//             formik.resetForm();
//             setInterestId(null);
//         };
//     }, [dispatch]);


//     useEffect(() => {
//         if (marketRate?.success) {
//             const data = marketRate?.data?.data;
//             setmarketRates(data)
//         }
//     }, [marketRate]);


//     useEffect(() => {
//         if (deleteResponse?.success) {
//             Toast.show({message:"Interest Deleted Successfully",type:"success"})
//             // dispatch(refetchTable());
//             setIsLoading(false);
//         }
//     }, [deleteResponse]);



//     const getInitialValues = () => {
//         return Object.fromEntries(
//             fields.map(({ name }) => {
//                 let fieldValue = isEdit && interestData?.[name] || "";
//                 if (fieldValue === undefined) {
//                     fieldValue = "";
//                 }
//                 return [name, fieldValue];
//             })
//         );
//     };



//     // Handle edit action
//     const handleEdit = (row: any) => {
//         setEdit(true);
//         getInterestById(row);
//         // setIsFormOpen(true);
//     };


//     const getInterestById = (data: any) => {
//         const body = {
//             procedureName: "findById",
//             params: {
//                 tableName: "Interest",
//                 id: data._id,
//             },
//         };
//         dispatch(apiRequest(INTEREST_EDIT_RES, "post", API_ENDPOINTS.SP.POST, body));
//         // setIsLoading(true);
//     };


//     useEffect(() => {
//         dispatch(apiRequest(MARKET_RATE_LIST, 'post', API_ENDPOINTS.SP.POST, {
//             procedureName: 'find', params: {
//                 tableName: 'marketRate', checkWith: ["marketRateName"],
//                 data: { active: true }
//             },
//         }));

//     }, [dispatch]);


//     useEffect(() => {
//         if (editResponse?.success) {
//             setInterestData(editResponse.data);
//             setSelectedOption(editResponse.data.marketRate)
//             setIsLoading(false);
//             formik.setValues(getInitialValues());
//             setInterestId(editResponse.data._id);
//         }
//     }, [editResponse]);


//     useEffect(() => {
//         if (updateResponse?.success !== undefined) {
//             if (updateResponse.success) {
          
//                 Toast.show({message:updateResponse.message,type:"success"})
//                 // dispatch(refetchTable());
//                 // formik.resetForm({
//                 //     values: Object.fromEntries(
//                 //         fields.map(({ name }) => [name, ""])
//                 //     )
//                 // });

//                 setEdit(false);
//                 setInterestId(null);
//                 setIsLoading(false);
//                 formik.resetForm();

//             } else {
//                 Toast.show({message:updateResponse.message,type:"error"})
              
//             }
//             setIsLoading(false);
//         }
//     }, [updateResponse]);




//     useEffect(() => {
//         if (InterestCreateResponse?.success !== undefined) {
//             if (InterestCreateResponse.success) {
//                 // dispatch(refetchTable());
//                 setInterestData(null)
//                 setIsLoading(false)
//                 formik.resetForm()
                
//                 Toast.show({message:InterestCreateResponse.message,type:"success"})
//             } else {
              
//                 Toast.show({message:InterestCreateResponse.message,type:"error"})
//             }
//             setIsLoading(false);
//         }
//     }, [InterestCreateResponse]);

//     // Handle delete action
//     const handleDelete = (row: any) => {
//         setInterestToDelete(row); // Set the metal to delete

//         // Configure the confirmation dialog
//         setConfirmationDialogConfig({
//             title: 'Delete Interest',
//             message: 'Are you sure you want to delete this Interest? You will not be able to recover this record!',
//             positiveButtonLabel: "Delete",
//             negativeButtonLabel: "Cancel",
//             showNegativeButton: true,
//         });

//         setConfirmationDialogOpen(true); // Open the confirmation dialog
//     };

//     // Handle confirmation dialog close
//     const handleConfirmationDialogClose = (confirmed: boolean) => {
//         setConfirmationDialogOpen(false); // Close the dialog

//         if (confirmed) {
//             // If the user confirmed, delete the Metal
//             deleteInterest(interestToDelete._id);
//         }
//     };

//     // Call the API to delete the Metal
//     const deleteInterest = (id: string) => {
//         const data = {
//             procedureName: "delete",
//             params: {
//                 tableName: "Interest",
//                 id: id,
//             },
//         };
//         dispatch(apiRequest(INTEREST_DELETE_RES, "post", API_ENDPOINTS.SP.POST, data))
//         setIsLoading(true);
//     };



//     const validate = (values: Record<string, any>): Record<string, string> => {
//         const errors: Record<string, string> = {};


//         const selectedOption = marketRates.find(
//             (option) => option._id === values.marketRate
//         );

//         if (selectedOption) {
//             const minLimit = Number(selectedOption.princiAllowMin);
//             const maxLimit = Number(selectedOption.princiAllowMax);

//             const minValue = Number(values.princiAllowMin);
//             const maxValue = Number(values.princiAllowMax);

//             if (isNaN(minValue) || minValue < minLimit || minValue > maxLimit) {
//                 errors.princiAllowMin = `Must be between ${minLimit} and ${maxLimit}`;
//             }

//             if (isNaN(maxValue) || maxValue > maxLimit) {
//                 errors.princiAllowMax = `Must be between ${minLimit} and ${maxLimit}`;
//             }

//             if (!isNaN(minValue) && !isNaN(maxValue) && ((minValue > maxValue) || (maxValue < minValue))) {
//                 errors.princiAllowMin = `Minimum${minLimit} - Maximum${maxLimit}`;
//                 errors.princiAllowMax = `Minimum${minLimit} - Maximum${maxLimit}`;
//             }
//         }

//         return errors;
//     };


//     const handleMarketSelection = (selectedId: string) => {
//         const selected = marketRates.find(option => option._id === selectedId);
//         if (selected) {
//             setSelectedOption(selected);
//             //   setPrinciAllowMin(selected.princiAllowMin);
//             //   setPrinciAllowMax(selected.princiAllowMax);
//         }
//     };

//     const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;

//         // console.log("Max-",maxLimit);
//         const minValue = Number(value);

//         formik.setFieldValue('princiAllowMin', value);
//         // setPrinciAllowMin(value);

//         if (selectedOption) {
//             const minLimit = selectedOption.princiAllowMin;
//             const maxLimit = selectedOption.princiAllowMax;

//             if (value !== '' && isNaN(minValue)) {
//                 formik.setFieldError('princiAllowMin', 'Please enter a valid number');
//                 return;
//             }

//             if ((minValue < minLimit) || (minValue > maxLimit)) {
//                 formik.setFieldError('princiAllowMin', `Minimum${minLimit} - Maximum${maxLimit}`);
//                 return;
//             }

//             formik.setFieldError('princiAllowMin', '');
//         }
//     };



//     const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         const maxValue = Number(value);

//         formik.setFieldValue('princiAllowMax', value);
//         // setPrinciAllowMax(value);

//         if (selectedOption) {
//             const minLimit = selectedOption.princiAllowMin;
//             const maxLimit = selectedOption.princiAllowMax;

//             if (value !== '' && isNaN(maxValue)) {
//                 formik.setFieldError('princiAllowMax', 'Please enter a valid number');
//                 return;
//             }

//             if ((maxValue > minLimit) && (maxValue < maxLimit)) {
//                 formik.setFieldError('princiAllowMax', `Minimum${minLimit} - Maximum${maxLimit}`);
//                 return;
//             }

//             formik.setFieldError('princiAllowMax', '');
//         }
//     };



//     const handleFieldChange = (e: React.ChangeEvent<HTMLElement>, fieldName: string) => {
//         // const value = (e.target as HTMLInputElement).value;

//         if (fieldName === 'princiAllowMin') {
//             handleMinChange(e as React.ChangeEvent<HTMLInputElement>);
//         } else if (fieldName === 'princiAllowMax') {
//             handleMaxChange(e as React.ChangeEvent<HTMLInputElement>);
//         } else {
//             formik.handleChange(e);
//         }
//     };


//     // Formik initialization
//     const formik = useFormik({
//         initialValues: getInitialValues(),
//         validationSchema: useValidation(fields),
//         validateOnChange: true,
//         validate,
//         onSubmit: async (values) => {
//             validate(values);
//             setIsLoading(true);
//             try {
//                 const data = {
//                     procedureName: isEdit ? "update" : "create",
//                     params: {
//                         tableName: "Interest",
//                         ...(isEdit && { id: interstId }),
//                         data: {
//                             ...values,
//                         },
//                         checkWith: ["interestName"],
//                     },
//                 };

//                 dispatch(
//                     apiRequest(
//                         isEdit ? INTEREST_UPDATE_RES : INTEREST_CREATE_RES,
//                         "post",
//                         API_ENDPOINTS.SP.POST,
//                         data
//                     )
//                 );

//             } catch (error) {
//                 console.error("Error saving:", error);
//                 toast.error("An error occurred while saving the interest.");
//                 setIsLoading(false);
//             }
//         },
//         enableReinitialize: true,
//     });


//     return (
//         <>
//             <Box px={5}>
//                 <Stack direction="row" alignItems="center" mb={1} flexGrow={1} >
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                         <Breadcrumb
//                             items={[
//                                 { label: "Masters" },
//                                 { label: "Interest Creation", active: true },
//                             ]}
//                         />
//                     </Stack>
//                 </Stack>
//             </Box>
//             <Box
//                 component="form"
//                 onSubmit={formik.handleSubmit}

//                 sx={{
//                     mt: 3,
//                     p: 5,
//                     mx: 5,
//                     backgroundColor: 'white',
//                     borderRadius: 2,
//                 }}
//             >
//                 <Typography
//                     variant="h5"
//                     sx={{ mb: 3, fontWeight: 600 }}
//                 >
//                     Interest Creations
//                 </Typography>

//                 <Grid container spacing={2}>

//                     {/* Interest Name Field */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel htmlFor="interestName" className="mb-2 flex items-center gap-1 text-sm font-medium">
//                             Interest Name
//                             <span className="text-[#F04438] text-lg">*</span>
//                         </InputLabel>
//                         <TextField
//                             fullWidth
//                             placeholder="Enter Interest name"
//                             name="interestName"
//                             value={formik.values.interestName}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             error={formik.touched.interestName && Boolean(formik.errors.interestName)}
//                             helperText={formik.errors.interestName}
//                         />
//                     </Grid>

//                     {/* Market Value Dropdown */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel htmlFor="marketRate" className="mb-2 flex items-center gap-1 text-sm font-medium">
//                             Market Value
//                             <span className="text-[#F04438] text-lg">*</span>
//                         </InputLabel>
//                         <Autocomplete
//                             options={marketRates.map((option: { marketRateName: string; _id: string }) => ({
//                                 label: option.marketRateName,
//                                 value: option._id,
//                             }))}
//                             value={(() => {
//                                 const selectedOption = marketRates.find(
//                                     (option) => option._id === formik.values.marketRate
//                                 );
//                                 return selectedOption
//                                     ? { label: selectedOption.marketRateName, value: selectedOption._id }
//                                     : null;
//                             })()}
//                             isOptionEqualToValue={(option, value) => option.value === value.value}
//                             onChange={(_, value) => {
//                                 formik.setFieldValue("marketRate", value?.value || "");
//                                 handleMarketSelection(value?.value || "");
//                             }}


//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     placeholder="Select market value"
//                                     error={formik.touched.marketRate && Boolean(formik.errors.marketRate)}
//                                     helperText={formik.touched.marketRate && formik.errors.marketRate}
//                                 />
//                             )}
//                         />
//                     </Grid>

//                     {/* Min/Max Fields with % Suffix */}
//                     {fields
//                         .filter((field) => field.name !== "marketRate" && field.name !== "interestName")
//                         .map((field) => (
//                             <Grid item xs={12} md={3} key={field.name}>
//                                 <InputLabel htmlFor={field.name} className="mb-2 flex items-center gap-1 text-sm font-medium">
//                                     {field.label}
//                                     <span className="text-[#F04438] text-lg">*</span>
//                                 </InputLabel>
//                                 <TextField
//                                     fullWidth
//                                     type="number"
//                                     placeholder={field.placeHolder}
//                                     name={field.name}
//                                     value={formik.values[field.name]}
//                                     onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
//                                         const value = e.target.value.replace(/[^0-9.]/g, '');
//                                         formik.setFieldValue(field.name, value);
//                                         handleFieldChange(e, field.name)
//                                     }}
//                                     onWheel={handleWheel}
//                                     onBlur={formik.handleBlur}
//                                     error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
//                                     helperText={formik.touched[field.name] && formik.errors[field.name]}

//                                     InputProps={{

//                                         endAdornment: (
//                                             <InputAdornment position="end">
//                                                 <Percent size={18} />
//                                             </InputAdornment>
//                                         ),
//                                     }}

//                                     onKeyDown={(e) => {
//                                         if (!/^\d$/.test(e.key) && e.key !== '.' && e.key !== 'tab' && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
//                                             e.preventDefault();
//                                         }
//                                     }}
//                                 />
//                             </Grid>
//                         ))}

//                     {/* Buttons */}
//                     <Grid item xs={12} className="flex justify-end gap-4 mt-4 ">
//                         <Button
//                             sx={{
//                                 backgroundColor: '#F5F5F5',
//                                 color: '#000',
//                                 textTransform: 'none',
//                                 px: 3,

//                             }}
//                             type="button"
//                             // variant="outlined"
//                             onClick={() => {
//                                 setInterestData(null)
//                                 formik.resetForm()
//                             }}
//                             className="border-2 border-gray-800 text-[#344054] font-medium"
//                         >
//                             Clear
//                         </Button>
//                         <Button
//                             sx={{
//                                 backgroundColor: '#000',
//                                 color: '#fff',
//                                 textTransform: 'none',
//                                 px: 3,
//                                 '&:hover': {
//                                     backgroundColor: '#333',
//                                 },
//                             }}
//                             type="submit"
//                             // variant="contained"
//                             disabled={isLoading}

//                             startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}

//                             className="bg-black text-white font-medium px-6"
//                         >
//                             {isLoading ? '' : !isEdit ? 'Save' : 'Update'}
//                         </Button>
//                     </Grid>
//                 </Grid>

//             </Box>

//             <Box
//                 component="table"
//                 sx={{
//                     mt: 3,
//                     p: 5,
//                     mx: 5,
//                     backgroundColor: 'white',
//                     borderRadius: 2,
//                 }}>
//                 <DataTable
//                     actionType={INTEREST_TABLE}
//                     endpoint={API_ENDPOINTS.SP.POST}
//                     tableName="Interest"
//                     filters={{}}
//                     isLoading={isLoading}
//                     // onView={handleView}
//                     populateFields={["marketRate"]}
//                     onEdit={handleEdit}
//                     onDelete={handleDelete}
//                 />
//             </Box>

//             <ConfirmationDialog
//                 open={confirmationDialogOpen}
//                 onClose={handleConfirmationDialogClose}
//                 title={confirmationDialogConfig.title}
//                 message={confirmationDialogConfig.message}
//                 positiveButtonLabel={confirmationDialogConfig.positiveButtonLabel}
//                 negativeButtonLabel={confirmationDialogConfig.negativeButtonLabel}
//                 showNegativeButton={confirmationDialogConfig.showNegativeButton}
//             />
//         </>

//     )
// }

// export default InterestCreation


import {
  Autocomplete,
  Grid,
  Button,
  InputLabel,
  TextField,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Percent } from "lucide-react";

import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";


import { useInterest } from "./interestHook";
import { useMarketRate } from "../../../hooks/commonhooks/marketRateHook";
import SubTable from "../../../components/subTable/subTable";

function InterestCreation() {
  const { interests, loading, createInterest, updateInterest, deleteInterest } =
    useInterest();

    const {marketRates,fetchMarketRates} = useMarketRate()

  const [isEdit, setIsEdit] = useState(false);
  const [interestId, setInterestId] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<any>(null);

  /* -------------------- FORM FIELDS -------------------- */
  const fields: ValidationField[] = [
    { name: "interestName", label: "Interest Name", type: "string", required: true },
    { name: "marketRate", label: "Market Value", type: "dropdown", required: true },
    {
      name: "princiAllowMin",
      label: "Principal Allowance (Min)",
      type: "number",
      required: true,
    },
    {
      name: "princiAllowMax",
      label: "Principal Allowance (Max)",
      type: "number",
      required: true,
    },
    {
      name: "interestMin",
      label: "Interest Value (Min)",
      type: "number",
      required: true,
    },
    {
      name: "interestMax",
      label: "Interest Value (Max)",
      type: "number",
      required: true,
    },
  ];

  /* -------------------- MARKET RATE -------------------- */
  useEffect(() => {
    fetchMarketRates();
  }, []);

  /* -------------------- FORM -------------------- */
  const formik:any = useFormik({
    initialValues: {
      interestName: "",
      marketRate: "",
      princiAllowMin: "",
      princiAllowMax: "",
      interestMin: "",
      interestMax: "",
    },
    validationSchema: useValidation(fields),
    validate: (values:any) => {
      const errors: any = {};
      if (selectedMarket) {
        const min = Number(selectedMarket.princiAllowMin);
        const max = Number(selectedMarket.princiAllowMax);

        if (values.princiAllowMin < min || values.princiAllowMin > max)
          errors.princiAllowMin = `Must be between ${min}-${max}`;

        if (values.princiAllowMax < min || values.princiAllowMax > max)
          errors.princiAllowMax = `Must be between ${min}-${max}`;
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEdit && interestId) {
          await updateInterest(interestId, values);
        } else {
          await createInterest(values);
        }
        resetForm();
        setIsEdit(false);
        setInterestId(null);
      } catch {}
    },
  });

  /* -------------------- HANDLERS -------------------- */
  const handleEdit = (row: any) => {
    setIsEdit(true);
    setInterestId(row._id);
    setSelectedMarket(row.marketRate);
    formik.setValues({
      interestName: row.interestName,
      marketRate: row.marketRate?._id,
      princiAllowMin: row.princiAllowMin,
      princiAllowMax: row.princiAllowMax,
      interestMin: row.interestMin,
      interestMax: row.interestMax,
    });
  };

  const handleDelete = (row: any) => {
    setDeleteRow(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async (ok: boolean) => {
    setConfirmOpen(false);
    if (ok && deleteRow) {
      await deleteInterest(deleteRow._id);
    }
  };

    const columns = [
      { id: "id", label: "S.NO" },
      { id: "interestName", label: "Interest Name" },
      { id: "marketRate", label: "Market Rate" },
      { id: "principalAllowance", label: "Principal Allowance" },
      { id: "createdAt", label: "Created At" },
    ];
  
    const tableData = interests.map((item:any, index:number) => ({
      id: index + 1,
      _id: item._id,
      interestName: item.interestName,
      marketRate:marketRates.find((i:any)=>i._id==item.marketRate).marketRateName,
      principalAllowance:`${item.princiAllowMin}% - ${item.princiAllowMax}%`,
    //    active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
      createdAt: item.createdAt,
    }));

  /* -------------------- UI -------------------- */
  return (
    <>
      <Box px={5}>
        <Breadcrumb items={[{ label: "Masters" }, { label: "Interest Creation", active: true }]} />
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 5, mx: 5, mt: 3, bgcolor: "white" }}>
        <Typography variant="h5" mb={3}>Interest Creation</Typography>

        <Grid container spacing={2}>
          {/* Interest Name */}
          <Grid item xs={12} md={6}>
            <InputLabel>Interest Name *</InputLabel>
            <TextField fullWidth {...formik.getFieldProps("interestName")}
              error={Boolean(formik.errors.interestName)}
              helperText={formik.errors.interestName}
            />
          </Grid>

          {/* Market Rate */}
          <Grid item xs={12} md={6}>
            <InputLabel>Market Value *</InputLabel>
            <Autocomplete
              options={marketRates.map((m) => ({ label: m.marketRateName, value: m._id }))}
              value={
                marketRates.find((m) => m._id === formik.values.marketRate)
                  ? {
                      label: selectedMarket?.marketRateName,
                      value: formik.values.marketRate,
                    }
                  : null
              }
              onChange={(_, val) => {
                formik.setFieldValue("marketRate", val?.value || "");
                setSelectedMarket(marketRates.find((m) => m._id === val?.value));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>

          {/* Numeric Fields */}
          {fields
            .filter((f) => !["interestName", "marketRate"].includes(f.name))
            .map((f) => (
              <Grid item xs={12} md={3} key={f.name}>
                <InputLabel>{f.label} *</InputLabel>
                <TextField
                  type="number"
                  fullWidth
                  {...formik.getFieldProps(f.name)}
                  error={Boolean(formik.errors[f.name])}
                  helperText={formik.errors[f.name]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Percent size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

          {/* Buttons */}
          <Grid item xs={12} className="flex justify-end gap-3">
            <Button onClick={() => formik.resetForm()}>Clear</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : isEdit ? "Update" : "Save"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      <Box sx={{ p: 5, mx: 5, mt: 3, bgcolor: "white" }}>
       <SubTable
          coloums={columns}
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Box>

      <ConfirmationDialog
        open={confirmOpen}
        title="Delete Interest"
        message="Are you sure you want to delete?"
        onClose={confirmDelete}
      />
    </>
  );
}

export default InterestCreation;
