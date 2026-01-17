// import {
//   Autocomplete,
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   InputAdornment,
//   InputLabel,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import {
//   METAL_RATE_CREATE_RES,
//   METAL_RATE_EDIT_RES, // METAL_RATE_LIST,
//   PURITY_LIST,
//   BRANCH_LIST,
// } from "../../../store/actionTypes";

// import { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { formatNumber } from "../../../utils/commonFunction";
// import API_ENDPOINTS from "../../../services/endpoints";
// import { apiRequest } from "../../../store/actions";
// import { useFormik } from "formik";
// import { ValidationField } from "../../../validations/schemaBuilder";
// import { useValidation } from "../../../validations/useValidation";
// import { IndianRupee } from "lucide-react";

// import { Breadcrumb } from "../../../components/breadCrumbComp";
// import { Toast } from "../../../components/toast/toast";
// import { usePurity } from "../purity/purityhooks";
// import { useBranch } from "../../settings/branch/branchHooks";

// interface PurityItem {
//   _id: string;
//   purityName: string;
//   metalId: {
//     _id: string;
//     metalName: string;
//   };
//   branchId?: {
//     _id?: string;
//   };
// }

// function MetalRate() {
//   let metals = [
//     { label: "Gold 22K", name: "22", value: "", image: gold24 },
//     { label: "Gold 24K", name: "24", value: "", image: gold24 },
//     { label: "Gold 18K", name: "18", value: "", image: gold24 },
//     { label: "Silver 999", name: "999", value: "", image: silver },
//   ];

//   const { fetchPurities, purities } = usePurity();
//   const { branches, fetchBranches } = useBranch();

//   const [purityData, setPurityData] = useState<PurityItem[]>([]);
//   const [metalRateData, setMetalRateData] = useState<any[]>([]);
//   const [metalValue, setMetalValue] = useState<any[]>(metals);
//   const [formData, setFormData] = useState<any[]>([]);
//   const [updatedData, setUpdatedData] = useState<any[]>([]);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [branchId, setBranchId] = useState<string>("");
//   const [branchList, setBranchList] = useState<any>([]);
//   const [loading, setIsLoading] = useState<boolean>(false);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     fetchBranches();
//     fetchPurities();
//   }, []);

//   useEffect(() => {
//     if (!purityData?.length) return;

//     const result = purityData.map((rateItem: any) => {
//       if (!metalRateData.length) {
//         return {
//           ...rateItem,
//           rate: "",
//         };
//       }

//       // Find matching metal rate
//       const purityId = rateItem?._id;
//       const matchingPurity = metalRateData.find(
//         (p: any) => p.purity?._id === purityId
//       );

//       return {
//         ...rateItem,
//         branchId: matchingPurity ? (matchingPurity.branchId ?? "") : "",
//         rate: matchingPurity ? (matchingPurity.rate ?? "") : "",
//       };
//     });

//     setUpdatedData(result);
//     // setFormData(result);
//   }, [purityData, metalRateData]);

//   useEffect(() => {
//     if (!updatedData?.length) return;

//     const updatedFormIds = updatedData.map((data) => ({
//       purity: data?.purity?._id || data._id,
//       material_type_id: data?.material_type_id?._id || data?.metalId?._id,
//       rate: data?.rate ?? "",
//       branchId: data?.branchId || branchId,
//     }));

//     setFormData(updatedFormIds);
//   }, [updatedData]);

//   const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
//     (e.target as HTMLInputElement).blur();
//     e.preventDefault();
//   };

//   const handleNumberInputKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (["+", "-", "e", "E"].includes(e.key)) {
//       e.preventDefault();
//     }
//   };

//   // Fetch branch and purity data on component mount
//   useEffect(() => {
//     dispatch(
//       apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
//         procedureName: "find",
//         params: {
//           tableName: "branch",
//           checkWith: [""],
//           data: { active: true },
//         },
//       })
//     );

//     dispatch(
//       apiRequest(PURITY_LIST, "post", API_ENDPOINTS.SP.POST, {
//         procedureName: "findAll",
//         params: {
//           tableName: "purity",
//           checkWith: [""],
//           filter: {
//             "metalId.active": true,
//           },
//           populateFields: ["metalId"],
//           data: { active: true },
//         },
//       })
//     );
//   }, []);

//   const { metalRateCreate, editRes, purityRes } = useSelector(
//     (states: any) => ({
//       metalRateCreate: states[METAL_RATE_CREATE_RES]?.data,
//       editRes: states[METAL_RATE_EDIT_RES]?.data,
//       purityRes: states[PURITY_LIST]?.data,
//     })
//   );

//   // Update purity data when received
//   useEffect(() => {
//     if (purityRes?.success) {
//       setPurityData(purityRes.data.data);
//     }
//   }, [purityRes]);

//   // Fetch metal rates when branchId or purityData changes
//   useEffect(() => {
//     if (!branchId || !purityData.length) return;

//     dispatch(
//       apiRequest(METAL_RATE_EDIT_RES, "post", API_ENDPOINTS.SP.POST, {
//         procedureName: "find",
//         params: {
//           tableName: "metalRate",
//           checkWith: [""],
//           populateFields: ["purity", "material_type_id", "branchId"],
//           filters: { branchId },
//           filter: {
//             "material_type_id.active": true,
//             "purity.active": true,
//           },
//           data: { active: true },
//         },
//       })
//     );
//   }, [branchId, purityData]);

//   // Update metal value display when editRes changes
//   // useEffect(() => {
//   //     if (editRes?.success) {

//   //         const value = editRes?.data?.data;
//   //         setMetalRateData(value);

//   //         const desiredOrder: string[] = ['22k', '24k', '18k', '999'];
//   //         const latestRecords = value.reduce((acc: any, item: any) => {
//   //             const purityKey = item?.purity?.purityName;
//   //             if (!purityKey) return acc;

//   //             if (!acc[purityKey] || new Date(item.updatedAt) > new Date(acc[purityKey].updatedAt)) {
//   //                 acc[purityKey] = item;
//   //             }
//   //             return acc;
//   //         }, {});

//   //         const formattedFields = Object.values(latestRecords).map((item: any) => ({
//   //             label: `${item?.material_type_id?.metalName || 'Metal'} ${item?.purity?.purityName ?? ''}`,
//   //             name: item?.purity?.purityName,
//   //             value: item?.rate,
//   //             type: 'number',
//   //             required: true,
//   //         }));

//   //         const filteredAndOrdered = desiredOrder
//   //             .map(name => formattedFields.find(item => item.name.toLowerCase() === name.toLowerCase()))
//   //             .filter(Boolean);

//   //         setMetalValue(filteredAndOrdered);
//   //     }
//   // }, [editRes]);

//   useEffect(() => {
//     if (!editRes?.success) return;

//     const value = editRes?.data?.data;
//     setMetalRateData(value);

//     // const desiredOrder = ['22k', '24k', '18k', '999'];

//     const latestRecords: Record<string, any> = {};

//     value.forEach((item: any) => {
//       const purity = item?.purity?.purityName?.toLowerCase();
//       if (!purity) return;

//       const matchedMetal = metals.find((metal) => {
//         const metalName = metal.name.replace(/[^0-9]/g, "");
//         const purityNumber = purity.replace(/[^0-9]/g, "");
//         return purityNumber && metalName.includes(purityNumber);
//       });

//       if (!matchedMetal) return;

//       const key = matchedMetal.name;

//       if (
//         !latestRecords[key] ||
//         new Date(item.updatedAt) > new Date(latestRecords[key].updatedAt)
//       ) {
//         latestRecords[key] = item;
//       }
//     });

//     const metalValues = metals.map((metal) => ({
//       ...metal,
//       value: latestRecords[metal.name]?.rate ?? "",
//     }));

//     setMetalValue(metalValues);
//   }, [editRes]);

//   useEffect(() => {
//     if (metalRateCreate?.success !== undefined) {
//       if (metalRateCreate.success) {
//         if (branchId) {
//           dispatch(
//             apiRequest(METAL_RATE_EDIT_RES, "post", API_ENDPOINTS.SP.POST, {
//               procedureName: "find",
//               params: {
//                 tableName: "metalRate",
//                 checkWith: [""],
//                 populateFields: ["purity", "material_type_id", "branchId"],
//                 filters: { branchId },
//                 data: { active: true },
//               },
//             })
//           );
//         }
//       }
//       setIsLoading(false);
//     }
//   }, [metalRateCreate]);

//   const purityfields: ValidationField[] = useMemo(() => {
//     return updatedData?.map((item) => {
//       const purityName = item?.purity?.purityName || item?.purityName;
//       const metalName =
//         item?.material_type_id?.metalName || item?.metalId?.metalName;

//       return {
//         label: `${metalName} ${purityName}`,
//         name: `['${purityName}']`,
//         value: item.rate ?? "",
//         type: "number",
//         required: true,
//         _id: item?._id,
//         minLength: 0,
//         maxLength: 8,
//       };
//     });
//   }, [updatedData]);

//   const getInitialValues = () => {
//     const initial: Record<string, any> = {};
//     updatedData.forEach((item) => {
//       const name = item?.purity?.purityName || item?.purityName;
//       if (name) {
//         initial[name] = item.rate ?? "";
//       }
//     });
//     initial.branchId = branchId || "";
//     return initial;
//   };

//   const handleSubmit = () => {
//     const errors: Record<string, string> = {};

//     formData.forEach((item) => {
//       const purityField = purityfields.find(
//         (field) => field._id === item.purity
//       );

//       if (!purityField) {
//         return;
//       }

//       const purityName = purityField.name;

//       if (item.rate === undefined || item.rate === "" || item.rate === null) {
//         errors[purityName] = "This field is required";
//       }
//     });

//     setFormErrors(errors);

//     if (Object.keys(errors).length === 0) {
//       setIsLoading(true);
//       try {
//         const data = {
//           procedureName: "createMany",
//           params: {
//             tableName: "metalRate",
//             data: [...formData],
//             checkWith: [""],
//           },
//         };

//         dispatch(
//           apiRequest(METAL_RATE_CREATE_RES, "post", API_ENDPOINTS.SP.POST, data)
//         );
//         Toast.show({
//           message: "Metal Rate updated successfully",
//           type: "success",
//         });
//       } catch (error) {
//         console.error("Error saving:", error);
//         // toast.error("An error occurred while saving the metal rates.");
//         setIsLoading(false);
//       }
//     }
//   };

//   // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //     const { name, value } = e.target;
//   //     const updatedRate = Number(value);
//   //     if (isNaN(updatedRate)) return;

//   //     formik.setFieldValue(name, value);

//   //     console.log("formik-values----",formik.values)

//   //     const purityItem = purityData.find((item) => item.purityName === name);
//   //     console.log("purityItem--",purityItem)

//   //     if (!purityItem) return;

//   //     setFormData((prev) => {
//   //         const existingIndex = prev.findIndex((i) => i.purity === purityItem._id);

//   //         const updatedRates = [...prev];
//   //         console.log("purityItem--",updatedRates)

//   //         if (existingIndex !== -1) {
//   //             const updatedRateData = {
//   //                 ...updatedRates[existingIndex],
//   //                 rate: updatedRate,
//   //                 branchId: branchId,
//   //             };
//   //             updatedRates[existingIndex] = updatedRateData;
//   //         } else {
//   //             updatedRates.push({
//   //                 purity: purityItem._id,
//   //                 material_type_id: purityItem?.metalId?._id,
//   //                 rate: updatedRate,
//   //                 branchId: branchId,
//   //             });
//   //         }

//   //         return updatedRates;
//   //     });
//   // };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     const rateValue = Number(value);

//     if (isNaN(rateValue)) return;

//     const purityname = name.replace(/^\['(.+)'\]$/, "$1");

//     const purityItem = purityData.find(
//       (item) => item.purityName === purityname
//     );

//     if (!purityItem) return;

//     formik.setFieldValue(name, value);

//     setFormData((prev) => {
//       const updated = [...prev];
//       const existingIndex = updated.findIndex(
//         (i) => i.purity === purityItem._id
//       );
//       const rateEntry = {
//         purity: purityItem._id,
//         material_type_id: purityItem.metalId._id,
//         rate: rateValue,
//         branchId,
//       };

//       if (existingIndex !== -1) {
//         updated[existingIndex] = rateEntry;
//       } else {
//         updated.push(rateEntry);
//       }

//       return updated;
//     });
//   };

//   const handleClear = () => {
//     setBranchId("");
//     setFormErrors({});
//     formik.resetForm();
//   };

//   const formik = useFormik({
//     initialValues: getInitialValues(),
//     validationSchema: useValidation(purityfields),
//     validateOnChange: false,
//     onSubmit: handleSubmit,
//     enableReinitialize: true,
//   });

//   useEffect(()=>{
//   const branchOptions = branches.map((branch) => ({
//     id: branch._id,
//     label: branch.branchName,
//     ...branch,
//   }));
//   setBranchList(branchOptions)
//   setBranchId(branches[0]?._id)
//   },[branches])

//   return (
//     <>
//       <Box>
//         <Box px={4}>
//           <Stack direction="row" alignItems="center" mb={1} flexGrow={1}>
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <Breadcrumb
//                 items={[
//                   { label: "Masters" },
//                   { label: "Metal Rate", active: true },
//                 ]}
//               />
//             </Stack>
//           </Stack>
//         </Box>
//         <Grid container spacing={2} mt={2} p={3}>
//           {metalValue.slice(0, 4).map((e, i) => (
//             <Grid item xs={12} sm={6} md={3} key={i}>
//               <Box
//                 p={2}
//                 borderRadius={2}
//                 border={1}
//                 borderColor="#F2F2F9"
//                 bgcolor={"white"}
//               >
//                 <Box
//                   component="img"
//                   src={e.name !== "999" ? gold24 : silver}
//                   alt="metal"
//                   sx={{
//                     width: 100,
//                     height: 100,
//                   }}
//                 />

//                 <Typography variant="h6">{`${e.label || ""}/g`}</Typography>
//                 <Typography fontWeight={500}>
//                   {formatNumber({ value: e.value, decimalPlaces: 0 })}
//                 </Typography>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>

//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           sx={{ mt: 3, p: 3, mx: 2, backgroundColor: "white", borderRadius: 2 }}
//         >
//           <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
//             Update Metal Rate
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <InputLabel htmlFor="branchId">
//                 Branch <span className="text-[#F04438]">*</span>
//               </InputLabel>
//               <Autocomplete
//                 options={branchList}
//                 onChange={(_, value) => {
//                   if (value) {
//                     setBranchId(value.value);
//                     formik.setFieldValue("branchId", value.value);
//                   }
//                 }}
//                 value={
//                   branchList.find((option:any) => option.value === branchId) ||
//                   null
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Enter branch"
//                     error={Boolean(
//                       formik.touched.branchId && formik.errors.branchId
//                     )}
//                     helperText={
//                       formik.touched.branchId && formik.errors.branchId
//                         ? (formik.errors.branchId as string)
//                         : ""
//                     }
//                   />
//                 )}
//                 sx={{ mb: 3 }}
//               />
//             </Grid>

//             {purityfields.map((field) => (
//               <Grid item xs={12} md={6} key={field.name}>
//                 <InputLabel htmlFor={field.name}>
//                   {field.label} <span className="text-[#F04438]">*</span>
//                 </InputLabel>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   name={field.name}
//                   value={
//                     formik.values?.[field.name.replace(/^\['(.+)'\]$/, "$1")] ||
//                     ""
//                   }
//                   onChange={formik.handleChange}
//                   onBlur={handleBlur}
//                   error={Boolean(formErrors[field.name])}
//                   helperText={
//                     typeof formErrors[field.name] === "string"
//                       ? formErrors[field.name]
//                       : ""
//                   }
//                   onWheel={handleWheel}
//                   onKeyDown={handleNumberInputKeyDown}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <IndianRupee size={18} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   inputProps={{
//                     min: field.min,
//                     max: field.max,
//                   }}
//                 />
//               </Grid>
//             ))}

//             <Grid item xs={12} className="flex justify-end gap-4 mt-4">
//               <Button
//                 sx={{
//                   backgroundColor: "#F5F5F5",
//                   color: "#000",
//                   textTransform: "none",
//                   px: 3,
//                 }}
//                 type="button"
//                 onClick={handleClear}
//                 className="border-2 border-gray-800 text-[#344054] font-medium"
//               >
//                 Clear
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 sx={{
//                   backgroundColor: "#000",
//                   color: "#fff",
//                   "&:hover": {
//                     backgroundColor: "#000",
//                     color: "#fff",
//                   },
//                 }}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <CircularProgress size={24} sx={{ color: "white" }} />
//                 ) : (
//                   "Update"
//                 )}
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </>
//   );
// }

// export default MetalRate;

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useBranch } from "../../settings/branch/branchHooks";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { useMetalRate } from "./metalRateHooks";
import gold24 from "../../../../src-tauri/icons/Gold 24.svg";
import silver from "../../../../src-tauri/icons/silver.svg";
import { spliceDecimals } from "../../../const";
function MetalRate() {
  const { branches, fetchBranches } = useBranch();
  const { fetchMetalRates, metalRates, updateMetalRates, loading } =
    useMetalRate();
  const [branchId, setBranchId] = useState<string>("");
  const [branchList, setBranchList] = useState<any[]>([]);
  const [rateValues, setRateValues] = useState<Record<string, string>>({});

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch metal rates when branchId changes
  useEffect(() => {
    if (branchId) {
      fetchMetalRates({ branchId });
    }
  }, [branchId]);

  // Initialize rate values when metalRates data changes
  useEffect(() => {
    if (metalRates && metalRates.length > 0) {
      const initialValues: Record<string, string> = {};
      metalRates.forEach((rate: any) => {
        const key = `${rate.metalName}-${rate.purityName}`;
        initialValues[key] = rate.rate?.toString() || "";
      });
      setRateValues(initialValues);

      // Update formik values
      formik.setValues({
        branchId,
        ...initialValues,
      });
    }
  }, [metalRates]);

  // Transform branches data for Autocomplete
  useEffect(() => {
    if (branches.length > 0) {
      const branchOptions = branches.map((branch) => ({
        id: branch._id,
        label: branch.branchName,
        value: branch._id,
      }));
      setBranchList(branchOptions);
      // Set default branch (first one)
      const defaultBranchId = branches[0]?._id || "";
      setBranchId(defaultBranchId);
      formik.setFieldValue("branchId", defaultBranchId);
    }
  }, [branches]);

  // Prevent scroll wheel from changing number input values
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
    e.preventDefault();
  };

  // Prevent invalid characters in number input
  const handleNumberInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Prevent 'e', 'E', '+', '-' characters
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Handle rate input change with validation
  const handleRateChange = (key: string, value: string) => {
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setRateValues((prev) => ({
      ...prev,
      [key]: sanitizedValue,
    }));
    formik.setFieldValue(key, sanitizedValue);
  };

  // Handle form clear
  const handleClear = () => {
    setBranchId("");
    setRateValues({});
    formik.resetForm();
  };

  // Formik initialization
  const formik: any = useFormik({
    initialValues: {
      branchId: "",
      ...rateValues,
    },
    enableReinitialize: true,
    onSubmit: (values: any) => {
      // Validate all rate fields
      let hasErrors = false;
      const errors: Record<string, string> = {};

      Object.keys(values).forEach((key) => {
        if (key !== "branchId") {
          const value = values[key];
          if (!value || value === "") {
            errors[key] = "This field is required";
            hasErrors = true;
          } else if (isNaN(parseFloat(value))) {
            errors[key] = "Please enter a valid number";
            hasErrors = true;
          }
        }
      });

      if (hasErrors) {
        formik.setErrors(errors);
        return;
      }

      // Prepare data for submission
      const submitData = {
        data: metalRates.map((rate: any) => {
          const key = `${rate.metalName}-${rate.purityName}`;
          return {
            branchId: branchId,
            purity: rate.purityId,
            purityNo: rate.purityNo,
            metalId: rate.metalId,
            rate: parseFloat(values[key]) || 0,
            purityName: rate.purityName,
            metalName: rate.metalName,
          };
        }),
      };

      updateMetalRates(submitData,branchId);
    },
  });

  // Handle branch selection
  const handleBranchChange = (_: any, value: any) => {
    if (value) {
      setBranchId(value.value);
      formik.setFieldValue("branchId", value.value);
    } else {
      setBranchId("");
      formik.setFieldValue("branchId", "");
      setRateValues({});
    }
  };

  return (
    <Box>
      <Box px={4}>
        <Stack direction="row" alignItems="center" mb={1} flexGrow={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "Metal Rate", active: true },
              ]}
            />
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={2} mt={2} p={3}>
        {metalRates.map((e, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Box
              p={2}
              borderRadius={2}
              border={1}
              borderColor="#F2F2F9"
              bgcolor={"white"}
            >
              <Box
                component="img"
                src={e.metalNo==1 ? gold24 : silver}
                alt="metal"
                sx={{
                  width: 100,
                  height: 100,
                }}
              />

              <Typography variant="h6">{`${e.purityName || ""}/g`}</Typography>
              <Typography fontWeight={500}>
                ₹{spliceDecimals(e.rate, 2)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ mt: 3, p: 3, mx: 2, backgroundColor: "white", borderRadius: 2 }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Update Metal Rate
        </Typography>

        <Grid container spacing={2}>
          {/* Branch Selection */}
          <Grid item xs={12} md={6}>
            <InputLabel htmlFor="branchId">
              Branch <span className="text-[#F04438]">*</span>
            </InputLabel>
            <Autocomplete
              options={branchList}
              getOptionLabel={(option) => option.label || ""}
              onChange={handleBranchChange}
              value={
                branchList.find((option) => option.value === branchId) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select branch"
                  error={Boolean(
                    formik.touched.branchId && formik.errors.branchId
                  )}
                  helperText={
                    formik.touched.branchId && formik.errors.branchId
                      ? (formik.errors.branchId as string)
                      : ""
                  }
                />
              )}
              sx={{ mb: 3 }}
            />
          </Grid>

          {/* Metal Rate Fields */}
          {metalRates && metalRates.length > 0 && (
            <>
              {metalRates.map((rate: any) => {
                const key = `${rate.metalName}-${rate.purityName}`;
                return (
                  <Grid item xs={12} md={6} key={rate.purityId}>
                    <InputLabel htmlFor={key}>
                      {rate.metalName} {rate.purityName}{" "}
                      <span className="text-[#F04438]">*</span>
                    </InputLabel>
                    <TextField
                      fullWidth
                      id={key}
                      name={key}
                      value={rateValues[key] || ""}
                      onChange={(e) => handleRateChange(key, e.target.value)}
                      onWheel={handleWheel}
                      onKeyDown={handleNumberInputKeyDown}
                      placeholder={`Enter ${rate.purityName} rate`}
                      error={Boolean(formik.touched[key] && formik.errors[key])}
                      helperText={
                        formik.touched[key] && formik.errors[key]
                          ? (formik.errors[key] as string)
                          : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: "0",
                        step: "0.01",
                        inputMode: "decimal",
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                );
              })}
            </>
          )}

          {/* Submit Buttons */}
          <Grid item xs={12} className="flex justify-end gap-4 mt-4">
            <Button
              sx={{
                backgroundColor: "#F5F5F5",
                color: "#000",
                textTransform: "none",
                px: 3,
              }}
              type="button"
              onClick={handleClear}
              className="border-2 border-gray-800 text-[#344054] font-medium"
            >
              Clear
            </Button>
            <Button
              type="submit"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#fff",
                },
              }}
              disabled={loading || !branchId}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MetalRate;
