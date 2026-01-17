import { useEffect, useRef } from "react";
import {
  Box,
  Card,
  Stack,
  Grid,
  TextField,
  Typography,
  Button,
  Container,
  Divider,
  Checkbox,
  InputAdornment,
  CircularProgress,
  InputLabel,
  Autocomplete,
  // InputLabel,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";
import { FormikProvider, useFormik } from "formik";

import dayjs from "dayjs";
import "dayjs/locale/en";

import Page from "../../components/Page";
import { ValidationField } from "../../validations/schemaBuilder";
// import { useValidation } from "../../validations/useValidation";
import { Breadcrumb } from "../../components/breadCrumbComp";
import { IndianRupee } from "lucide-react";
import { useValidation } from "../../validations/useValidation";
import { useCalculationTypes } from "../../hooks/commonhooks/calculationHook";
import { useLoan } from "./loanHooks";

type FileTypeOptions = {
  pdfs?: boolean;
};

// Configure dayjs
dayjs.locale("en");
// const dateFormat = "DD/MM/YYYY";

export default function LoanCreationForm() {
  const { fetchCalculationType, calculationTypeData } = useCalculationTypes();
  const { createLoan, loading } = useLoan();

  useEffect(() => {
    fetchCalculationType();
  }, []);



  const loanRef = useRef<HTMLInputElement>(null);
  const intiRef = useRef<HTMLInputElement>(null);

  // Generate initial values
  const getInitialValues = () => {
    const values: any = {};
    // fields.forEach(({ name, value }) => {
    //     values[name] = value || '';
    //     if (name === 'paymentReminders' || name === 'dueDateAlerts') {
    //         values[name] = false;
    //     }
    // });
    return values;
  };

  const fields: ValidationField[] = [
    // Basic Details
    {
      name: "loanName",
      label: "Loan Name",
      placeHolder: "Enter loan name",
      required: true,
      type: "text",
      max: 100,
    },
    {
      name: "loanCode",
      label: "Loan Code",
      placeHolder: "Enter loan code",
      required: true,
      type: "text",
      max: 50,
    },
    {
      name: "loanAgreement",
      label: "Loan Agreement (PDF)",
      required: true,
      type: "file",
    },
    // { name: 'loanAgreement', label: 'Loan Agreement (PDF)', required: true, type: 'file', accept: '.pdf' },
    {
      name: "intimationLetter",
      label: "Intimation Letter (PDF)",
      required: true,
      type: "file",
    },
    {
      name: "itemDescription",
      label: "Item Description",
      placeHolder: "Enter item description",
      required: true,
      type: "text",
      max: 500,
    },
    {
      name: "legalDisclosures",
      label: "Legal Disclosures",
      placeHolder: "Enter legal disclosures",
      required: true,
      type: "text",
      max: 1000,
    },

    // { name: 'intimationLetter', label: 'Intimation Letter (PDF)', required: true, type: 'file', accept: '.pdf' }, // todo
    {
      name: "conditionReport",
      label: "Condition Report",
      placeHolder: "Enter condition report",
      required: true,
      type: "text",
      max: 1000,
    },

    // Charges
    {
      name: "processingFee",
      label: "Processing Fee",
      placeHolder: "Enter processing fee",
      required: true,
      type: "number",
      min: 0,
    },
    {
      name: "additionalCharges",
      label: "Additional Charges",
      placeHolder: "Enter additional charges",
      required: true,
      type: "number",
      min: 0,
    },
    {
      name: "calculationType",
      label: "Calculation Type",
      placeHolder: "Select interest calculation",
      required: true,
      type: "dropdown",
    },
    {
      name: "lateFine",
      label: "Late Fine",
      placeHolder: "Enter late fine",
      required: true,
    },
    {
      name: "maturityPeriod",
      label: "Maturity Period",
      placeHolder: "Enter maturity months",
      required: true,
      type: "number",
      min: 1,
      max: 86,
    },
    {
      name: "paymentReminders",
      label: "Payment Reminders",
      required: false,
      type: "checkbox",
    },
    {
      name: "dueDateAlerts",
      label: "Due Date Alerts",
      required: false,
      type: "checkbox",
    },
  ];

  const formik = useFormik({
    initialValues: getInitialValues(),
    validateOnMount: true,
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      const formData = new FormData();

      // Append all values to formData
      Object.keys(values).forEach((key) => {
        if (key === "loanAgreement" || key === "intimationLetter") {
          if (values[key]) {
            formData.append(key, values[key]);
          }
        }
      });

      formData.append("data", JSON.stringify({ ...values }));

      try {
         await createLoan(formData)
      } catch (error) {
        console.error("Error creating loan:", error);
        toast.error("An error occurred while creating the loan.");
      }
    },
    enableReinitialize: true,
  });

  // Helper to get field details
  const getElementDetails = (name: string) => {
    return fields.find((field) => field.name === name);
  };

  const handleLoanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loanRef.current) {
      loanRef.current.value = "";
    }
    loanRef.current?.click();
  };

  const handleIntiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (intiRef.current) {
      intiRef.current.value = "";
    }

    intiRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    allowedTypes: FileTypeOptions = { pdfs: true }
  ) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      formik.setFieldValue(fieldName, "");
      return;
    }

    const fileType = file.type;
    let isValid = false;

    if (allowedTypes.pdfs && fileType === "application/pdf") {
      isValid = true;
    }

    if (!isValid) {
      const allowedTypesList = [
        ...(allowedTypes.pdfs ? ["application/pdf"] : []),
      ];

      const readableTypes = allowedTypesList.map((type) => {
        if (type === "application/pdf") return "PDF";
        return type;
      });

      const errorMessage = `Invalid file type. Allowed types: ${readableTypes.join(", ")}`;
      toast.error(errorMessage);
      formik.setFieldError(fieldName, errorMessage);
      return;
    }

    formik.setFieldError(fieldName, "");
    formik.setFieldValue(fieldName, file);
  };

  return (
    <Page title="Create Loan ">
      <ToastContainer />
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          {/* Breadcrumb Navigation */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "Loan Creation", active: true },
              ]}
            />
          </Stack>
        </Stack>

        <FormikProvider value={formik}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Loan Creation
                </Typography>
              </Stack> */}

                  {/* Basic Details Section */}
                  <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                    Basic Details
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {/* Loan Name */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        style={{ color: "#09090F" }}
                      >
                        {getElementDetails("loanName")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        placeholder={getElementDetails("loanName")?.placeHolder}
                        {...formik.getFieldProps("loanName")}
                        error={Boolean(
                          formik.touched.loanName && formik.errors.loanName
                        )}
                        helperText={
                          formik.touched.loanName && formik.errors.loanName
                            ? (formik.errors.loanName as string)
                            : ""
                        }
                      />
                    </Grid>

                    {/* Loan Code */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        style={{ color: "#09090F" }}
                      >
                        {getElementDetails("loanCode")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        placeholder={getElementDetails("loanCode")?.placeHolder}
                        {...formik.getFieldProps("loanCode")}
                        error={Boolean(
                          formik.touched.loanCode && formik.errors.loanCode
                        )}
                        helperText={
                          formik.touched.loanCode && formik.errors.loanCode
                            ? (formik.errors.loanCode as string)
                            : ""
                        }
                      />
                    </Grid>

                    {/* Loan Agreement */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        Loan Agreement(PDF)
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <Box mb={2} onClick={handleLoanClick}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="loanAgreement"
                          value={
                            formik.values.loanAgreement?.name ||
                            (formik.values.loanAgreement as string) ||
                            ""
                          }
                          placeholder="Browse"
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  variant="contained"
                                  component="span"
                                  onClick={handleLoanClick}
                                  sx={{
                                    backgroundColor: "#F5F5F5",
                                    color: "#737791",
                                    padding: "10px 10px",
                                    fontWeight: 500,
                                    textTransform: "none",
                                    "&:hover": {
                                      backgroundColor: "#e0e0e0",
                                    },
                                  }}
                                  size="small"
                                >
                                  Choose File
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                          error={Boolean(
                            formik.touched.loanAgreement &&
                              formik.errors.loanAgreement
                          )}
                          helperText={
                            formik.errors.loanAgreement
                              ? (formik.errors.loanAgreement as string)
                              : ""
                          }
                        />
                        <input
                          accept=".pdf"
                          style={{ display: "none" }}
                          id="loanAgreement"
                          ref={loanRef}
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, "loanAgreement", { pdfs: true })
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Box>
                    </Grid>

                    {/* Intimation Letter */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        Intimation Letter(PDF)
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <Box mb={2} onClick={handleIntiClick}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="intimationLetter"
                          value={
                            formik.values.intimationLetter?.name ||
                            (formik.values.intimationLetter as string) ||
                            ""
                          }
                          placeholder="Browse"
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  variant="contained"
                                  component="span"
                                  onClick={handleIntiClick}
                                  sx={{
                                    backgroundColor: "#F5F5F5",
                                    color: "#737791",
                                    padding: "10px 10px",
                                    fontWeight: 500,
                                    textTransform: "none",
                                    "&:hover": {
                                      backgroundColor: "#e0e0e0",
                                    },
                                  }}
                                  size="small"
                                >
                                  Choose File
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                          error={Boolean(
                            formik.touched.intimationLetter &&
                              formik.errors.intimationLetter
                          )}
                          helperText={
                            formik.errors.intimationLetter
                              ? (formik.errors.intimationLetter as string)
                              : ""
                          }
                        />
                        <input
                          accept=".pdf"
                          style={{ display: "none" }}
                          id="intimationLetter"
                          ref={intiRef}
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, "intimationLetter", {
                              pdfs: true,
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Box>
                    </Grid>

                    {/* Item Description */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("itemDescription")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        placeholder={
                          getElementDetails("itemDescription")?.placeHolder
                        }
                        {...formik.getFieldProps("itemDescription")}
                        error={Boolean(
                          formik.touched.itemDescription &&
                            formik.errors.itemDescription
                        )}
                        helperText={
                          formik.touched.itemDescription &&
                          formik.errors.itemDescription
                            ? (formik.errors.itemDescription as string)
                            : ""
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}></Grid>

                    {/* Legal Disclosures */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("legalDisclosures")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={
                          getElementDetails("legalDisclosures")?.placeHolder
                        }
                        {...formik.getFieldProps("legalDisclosures")}
                        error={Boolean(
                          formik.touched.legalDisclosures &&
                            formik.errors.legalDisclosures
                        )}
                        helperText={
                          formik.touched.legalDisclosures &&
                          formik.errors.legalDisclosures
                            ? (formik.errors.legalDisclosures as string)
                            : ""
                        }
                      />
                    </Grid>

                    {/* Condition Report */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("conditionReport")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={
                          getElementDetails("conditionReport")?.placeHolder
                        }
                        {...formik.getFieldProps("conditionReport")}
                        error={Boolean(
                          formik.touched.conditionReport &&
                            formik.errors.conditionReport
                        )}
                        helperText={
                          formik.touched.conditionReport &&
                          formik.errors.conditionReport
                            ? (formik.errors.conditionReport as string)
                            : ""
                        }
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Charges Section */}
                  <Typography variant="subtitle1" gutterBottom sx={{ my: 2 }}>
                    Charges
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("processingFee")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        placeholder={
                          getElementDetails("processingFee")?.placeHolder
                        }
                        type="number"
                        {...formik.getFieldProps("processingFee")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ border: "1px solid left" }}
                            >
                              <IndianRupee size={18} />
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          min: getElementDetails("processingFee")?.min,
                          step: "0.01",
                        }}
                        error={Boolean(
                          formik.touched.processingFee &&
                            formik.errors.processingFee
                        )}
                        helperText={
                          formik.touched.processingFee &&
                          formik.errors.processingFee
                            ? (formik.errors.processingFee as string)
                            : ""
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("additionalCharges")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        placeholder={
                          getElementDetails("additionalCharges")?.placeHolder
                        }
                        type="number"
                        {...formik.getFieldProps("additionalCharges")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ border: "1px solid left" }}
                            >
                              <IndianRupee size={18} />
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          min: getElementDetails("additionalCharges")?.min,
                          step: "0.01",
                        }}
                        error={Boolean(
                          formik.touched.additionalCharges &&
                            formik.errors.additionalCharges
                        )}
                        helperText={
                          formik.touched.additionalCharges &&
                          formik.errors.additionalCharges
                            ? (formik.errors.additionalCharges as string)
                            : ""
                        }
                      />
                    </Grid>

                    {/* Calculation Type */}
                    <Grid item xs={12} md={6}>
                      <InputLabel
                        htmlFor="calculationType"
                        className="mb-2 flex items-center gap-1"
                        style={{ color: "#09090F" }}
                      >
                        {getElementDetails("calculationType")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <Autocomplete
                        size="medium"
                        options={calculationTypeData.map((option: any) => ({
                          label: option.calucalationName,
                          value: option.no,
                        }))}
                        value={
                          calculationTypeData
                            .map((option: any) => ({
                              label: option.calucalationName,
                              value: option.no,
                            }))
                            .find(
                              (opt) =>
                                opt.value === formik.values.calculationType
                            ) || null
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              getElementDetails("calculationType")?.placeHolder
                            }
                            error={Boolean(
                              formik.touched.calculationType &&
                                formik.errors.calculationType
                            )}
                            helperText={
                              formik.touched.calculationType &&
                              formik.errors.calculationType
                                ? (formik.errors.calculationType as string)
                                : ""
                            }
                          />
                        )}
                        onChange={(_, value) => {
                          formik.setFieldValue(
                            "calculationType",
                            value?.value || ""
                          );
                        }}
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "customStyle",
                                enabled: true,
                                phase: "beforeWrite",
                                fn: ({ state }) => {
                                  Object.assign(state.styles.popper, {
                                    boxShadow:
                                      "0px 10px 30px 0px rgba(64,100,233,0.15)",
                                  });
                                },
                              },
                            ],
                          },
                        }}
                      />
                    </Grid>

                    {formik.values.calculationType == 1 && (
                      <Grid item xs={12} sm={6} md={6}>
                        <InputLabel
                          htmlFor="lateFine"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          {getElementDetails("lateFine")?.label}
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          placeholder={
                            getElementDetails("lateFine")?.placeHolder
                          }
                          type="number"
                          {...formik.getFieldProps("lateFine")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{ border: "1px solid left" }}
                              >
                                <IndianRupee size={18} />
                              </InputAdornment>
                            ),
                          }}
                          error={Boolean(
                            formik.touched.lateFine && formik.errors.lateFine
                          )}
                          helperText={
                            formik.touched.lateFine && formik.errors.lateFine
                              ? (formik.errors.lateFine as string)
                              : ""
                          }
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Time Period Section */}
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                    Time Period
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {/* Maturity Period */}
                    <Grid item xs={12} sm={6} md={6}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("maturityPeriod")?.label}
                        <span className="text-[#F04438] text-lg">*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        placeholder={
                          getElementDetails("maturityPeriod")?.placeHolder
                        }
                        type="number"
                        {...formik.getFieldProps("maturityPeriod")}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              Months
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          min: getElementDetails("maturityPeriod")?.min,
                          max: getElementDetails("maturityPeriod")?.max,
                        }}
                        error={Boolean(
                          formik.touched.maturityPeriod &&
                            formik.errors.maturityPeriod
                        )}
                        helperText={
                          formik.touched.maturityPeriod &&
                          formik.errors.maturityPeriod
                            ? (formik.errors.maturityPeriod as string)
                            : ""
                        }
                      />
                    </Grid>

                    {/* Payment Reminders */}
                    <Grid item xs={6} sm={6} md={3} sx={{ mt: "15px" }}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-center gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("paymentReminders")?.label}
                      </InputLabel>
                      <Checkbox
                        checked={formik.values.paymentReminders}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "paymentReminders",
                            e.target.checked
                          )
                        }
                        name="paymentReminders"
                        color="primary"
                      />
                    </Grid>

                    {/* Due Date Alerts */}
                    <Grid item xs={6} sm={6} md={3} sx={{ mt: "15px" }}>
                      <InputLabel
                        htmlFor="my-input"
                        className="mb-2 flex items-end gap-1"
                        sx={{ color: "#09090F" }}
                      >
                        {getElementDetails("dueDateAlerts")?.label}
                      </InputLabel>
                      <Checkbox
                        checked={formik.values.dueDateAlerts}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "dueDateAlerts",
                            e.target.checked
                          )
                        }
                        name="dueDateAlerts"
                        className="flex justify-end"
                        color="primary"
                      />
                    </Grid>
                  </Grid>

                  {/* Form Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                    }}
                  >
                    <Button
                      sx={{
                        backgroundColor: "#F5F5F5",
                        color: "#000",
                        textTransform: "none",
                        px: 3,
                      }}
                      onClick={() => formik.resetForm()}
                      disabled={loading}
                    >
                      Clear
                    </Button>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      disabled={Object.keys(formik.errors).length >= 1}
                      sx={{
                        bgcolor: "black",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#333",
                        },
                      }}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                      loading={loading}
                    >
                      {loading ? "" : "Save"}
                    </LoadingButton>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </FormikProvider>
      </Container>
    </Page>
  );
}
