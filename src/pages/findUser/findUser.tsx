import { useState, useEffect } from "react";
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
import { Form, FormikProvider, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useValidation } from "../../validations/useValidation";
import { ValidationField } from "../../validations/schemaBuilder";
import { Toast } from "../../components/toast/toast";

import Page from "../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { mobileLength } from "../../const";
import { useBranch } from "../settings/branch/branchHooks";
import { useCustomer } from "../customer overview/customerHooks";
import { useLoanAccount } from "../manageLoan/customer/loanAccountHooks";

// Configure dayjs
dayjs.locale("en");
const dateFormat = "DD/MM/YYYY";

export default function FindUser({
  title,
  handleCustomerId,
  handleBranch,
  handleLoanId,
  loanType = 0,
}: any) {
  const designLibraryData = null;
  const [loanData, setLoanData] = useState<any[]>([]);

  const { branches, fetchBranches } = useBranch();
  const { fetchCustomerBysearch } = useCustomer();
  const { findAccByCustomers, loans } = useLoanAccount()

  useEffect(() => {
    fetchBranches();
  }, []);

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

  const handleSubmit = async () => {
    setLoanData([]);
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

    const findCustomer = await fetchCustomerBysearch({
      branchId: formik.values.branchId,
      mobile: formik.values.mobile,
    });
    if (findCustomer) {
      handleCustomerId(findCustomer);
      findAccByCustomers({ mobile: formik.values.mobile, status: loanType })
    } else {
      handleCustomerId("");
    }
    setLoanData([]);
  };


  useEffect(() => {
    if (loans) {
      setLoanData(loans);
    }
  }, [loans]);

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
                      options={
                        branches?.map((branch) => ({
                          label: branch.branchName,
                          value: branch._id,
                        })) ?? []
                      }
                      value={
                        branches
                          ?.map((branch) => ({
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
                      // loading={loading} // Removed loading prop as it was coming from Redux or wasn't used correctly
                      options={
                        loanData?.map((item: any) => ({
                          label: `${item.loanNo} (${item.principalAmt})`, // show both loanNo + principalAmt
                          value: item._id,
                        })) ?? []
                      }
                      value={
                        loanData
                          ?.map((item: any) => ({
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
                            formik.touched.loanId &&
                              typeof formik.errors.loanId === "string"
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
