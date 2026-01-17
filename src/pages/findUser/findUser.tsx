import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  InputAdornment,
  Button,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
// import { LoadingButton } from "@mui/lab";
import { Form, FormikProvider, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { apiClear, apiRequest } from "../../store/actions";
import API_ENDPOINTS from "../../services/endpoints";
import {
  BRANCH_LIST,
  CUSTOMER_LIST,
  LoanAccount_LIST,
} from "../../store/actionTypes";
import { useValidation } from "../../validations/useValidation";
import { ValidationField } from "../../validations/schemaBuilder";
import { Toast } from "../../components/toast/toast";

import Page from "../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { mobileLength } from "../../const";

// Configure dayjs
dayjs.locale("en");
const dateFormat = "DD/MM/YYYY";

export default function FindUser({
  title,
  handleCustomerId,
  handleBranch,
  handleLoanId,
  loanType = "findAll"
}: any) {
  const dispatch = useDispatch();
  // const isEdit = pathname.includes('edit');
  const designLibraryData = (null);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [branchData, setBranchData] = useState<
    { branchName: string; _id: string }[]
  >([]);
  const [loanData, setLoanData] = useState([]);

  useEffect(() => {
    dispatch(apiClear(BRANCH_LIST));
    dispatch(apiClear(CUSTOMER_LIST));
    dispatch(apiClear(LoanAccount_LIST));
    return () => {
      dispatch(apiClear(BRANCH_LIST));
      dispatch(apiClear(CUSTOMER_LIST));
      dispatch(apiClear(LoanAccount_LIST));
    };
  }, [dispatch]);

  const fields: ValidationField[] = [
    {
      name: "branchId",
      label: "Branch",
      required: true,
      type: "dropdown",
      placeHolder: "Select Branch",
    },
    {
      name: "mobile",
      label: "Mobile",
      required: true,
      max: 10,
      min: 10,
      type: "text",
      placeHolder: "Enter Mobile",
    },
    {
      name: "loanId",
      label: "Loan",
      required: true,
      type: "dropdown",
      placeHolder: "Select Loan",
    },
  ];

  const { branchList, customerFind, loanList } = useSelector((states: any) => ({
    branchList: states[BRANCH_LIST]?.data,
    customerFind: states[CUSTOMER_LIST]?.data,
    loanList: states[LoanAccount_LIST]?.data,
  }));

  useEffect(() => {
    if (branchList?.success) {
      setBranchData(branchList.data.data);
    }
  }, [branchList]);

  useEffect(() => {
    dispatch(
      apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "branch" },
      })
    );
  }, []);

  const getInitialValues = () => {
    return Object.fromEntries(
      fields?.map(({ name, value }: any) => {
        let fieldValue: any = designLibraryData?.[name] || "";
        if (fieldValue === undefined) {
          fieldValue = value !== undefined ? value : "";
        }

        // Special handling for date fields if any
        if (name === "dateField" && fieldValue) {
          fieldValue = dayjs(fieldValue, dateFormat);
        }

        return [name, fieldValue];
      })
    );
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    onSubmit: async () => { },
    enableReinitialize: true,
  });


  const handleSubmit = () => {
    if (!formik.values.branchId) {
      Toast.show({ message: "Branch is required", type: "error" });
      return;
    }

    if (String(formik.values.mobile).length !== mobileLength) {
      Toast.show({
        message: `Mobile Number should be ${mobileLength} digits `,
        type: "error",
      });
      return;
    }
    setIsSearching(true);
    dispatch(
      apiRequest(CUSTOMER_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "customer",
          filters: {
            branchId: formik.values.branchId,
            mobile: formik.values.mobile,
          },
        },
      })
    );
    setLoanData([]);
  };

  useEffect(() => {
    if (customerFind?.success && isSearching) {
      setIsSearching(false);
      if (customerFind.data.data.length >= 1) {
        Toast.show({ message: "Customer Found Successfuly", type: "success" });
        handleCustomerId(customerFind.data.data[0]);
        dispatch(
          apiRequest(LoanAccount_LIST, "post", API_ENDPOINTS.SP.POST, {
            procedureName: loanType,
            params: {
              tableName: "loanAccount",
              filters: {
                loanStatus: 0,
                branchId: formik.values.branchId,
                customerId: customerFind.data.data[0]._id,
              },
            },
          })
        );
      } else {
        handleCustomerId("");
        Toast.show({ message: "Customer not found", type: "error" });
      }
    }
  }, [customerFind, isSearching]);

  useEffect(() => {
    if (loanList?.success) {
      setLoanData(loanList.data.data);
    } else {
      console.log(loanList);
    }
  }, [loanList]);

  return (
    <>
      <Page>
        <Box alignItems={"center"}>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <Card sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                  {title}
                </Typography>
                <Grid container spacing={6}>
                  {/* Branch Dropdown */}
                  <Grid item xs={12} md={6}>
                    <InputLabel
                      required
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        color: "black",
                        marginBottom: "12px",
                      }}
                    >
                      Branch
                    </InputLabel>
                    <Autocomplete
                      options={branchData?.map((branch) => ({
                        label: branch.branchName,
                        value: branch._id,
                      })) ?? []}
                      value={
                        branchData?.map((branch) => ({
                          label: branch.branchName,
                          value: branch._id,
                        }))
                          .find(
                            (option) => option.value === formik.values.branchId
                          ) || null
                      }
                      onChange={(_, newValue) => {
                        formik.setFieldValue("branchId", newValue?.value || "");
                        handleBranch(newValue?.value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          placeholder="Select branch"
                          error={
                            formik.touched.branchId &&
                            Boolean(formik.errors.branchId)
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px", // Set desired height
                              borderRadius: "8px",
                              paddingRight: 0,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Phone Number with Search */}
                  <Grid item xs={12} md={6}>
                    <InputLabel
                      required
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        color: "black",
                        marginBottom: "12px",
                      }}
                    >
                      Phone Number
                    </InputLabel>

                    <TextField
                      fullWidth
                      name="mobile"
                      size="medium"
                      placeholder="Search phone number"
                      value={formik.values.mobile}
                      onChange={(e) => {
                        const input = e.target.value;
                        // Allow only numbers and max 10 digits
                        if (/^\d{0,10}$/.test(input)) {
                          formik.setFieldValue("mobile", input);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.mobile && Boolean(formik.errors.mobile)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ fontSize: "16px", px: 1 }}
                          >
                            +91
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end" sx={{ p: 0 }}>
                            <Button
                              disableElevation
                              variant="contained"
                              size="small"
                              sx={{
                                height: "48px",
                                borderRadius: "0px 8px 8px 0px",
                                backgroundColor: "black",
                                color: "#fff",
                                px: 2,
                                ml: 1,
                                minWidth: 0,
                                boxShadow: "none",
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                  backgroundColor: "#333",
                                },
                              }}
                              onClick={handleSubmit}
                            >
                              Search
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "48px",
                          borderRadius: "8px",
                          paddingRight: 0,
                        },
                      }}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                    />
                  </Grid>

                  {/* Loan ID Dropdown */}
                  <Grid item xs={12} md={6}>
                    <InputLabel
                      required
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        color: "black",
                        marginBottom: "12px",
                      }}
                    >
                      Loan Id
                    </InputLabel>

                    <Autocomplete
                      options={loanData?.map((item: any) => ({
                        label: `${item.loanNo} (${item.principalAmt})`, // show both loanNo + principalAmt
                        value: item._id,
                      })) ?? []}
                      value={
                        loanData?.map((item: any) => ({
                          label: `${item.loanNo} (${item.principalAmt})`, // again use same mapping
                          value: item._id,
                        }))
                          .find(
                            (option) => option.value === formik.values.loanId
                          ) || null
                      }
                      onChange={(_, newValue) => {
                        formik.setFieldValue("loanId", newValue?.value || "");
                        handleLoanId(newValue?.value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          placeholder="Select Loan"
                          error={
                            formik.touched.loanId &&
                            Boolean(formik.errors.loanId)
                          }
                          helperText={
                            formik.touched.loanId && typeof formik.errors.loanId === "string"
                              ? formik.errors.loanId
                              : ""
                          }

                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px",
                              borderRadius: "8px",
                              paddingRight: 0,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Form>
          </FormikProvider>
        </Box>
      </Page>
    </>
  );
}
