import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  // InputAdornment,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";
import { Form, FormikProvider, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import useToast from "../../../components/toastr/toastr";
import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
// import { itemType } from "./newLoan";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ImageUpload from "../../../components/imageUpload/uploadImage";
import { spliceDecimals } from "../../../const";
import { useBranch } from "../../settings/branch/branchHooks";
import { useInterest } from "../../master/interestCreation/interestHook";
import { useLoan } from "../../loan/loanHooks";
import { useLocker } from "../../settings/lockerCreation/lockerHooks";

// Inside your component
const firstDayNextMonth = dayjs().add(1, "month").startOf("month");
const twentyEighthNextMonth = dayjs().add(1, "month").date(28);

dayjs.locale("en");
const dateFormat = "DD/MM/YYYY";

export default function AddLoan({ totalAmount, handleSubmit, loading }: any) {

  const designLibraryData = null;

  // const [isLoading, setIsLoading] = useState(false);
  const { Toast } = useToast();

  const [image, setImage] = useState<File | null>(null);
  const [selectedLoan, setSeletedLoan] = useState<any>({});
  const [minAllowedAmount, setMinAllowedAmount] = useState<number>(0);
  const [maxAllowedAmount, setMaxAllowedAmount] = useState<number>(0);
  const [minInterestRate, setMinInterestRate] = useState<number>(0);
  const [maxInterestRate, setMaxInterestRate] = useState<number>(0);
  const [interestAmount, setInterestAmount] = useState<number>(0);
  // todo need to clear the these functions

  const {branches,fetchBranches}= useBranch()
  const {interests,fetchInterests}= useInterest()
  const {fetchLoans,loans}= useLoan()
  const {fetchLockers,lockers} =useLocker()

  useEffect(()=>{
    fetchBranches()
    fetchInterests()
    fetchLoans()
    fetchLockers()
  },[])



  const fields: ValidationField[] = [
    {
      name: "branchId",
      label: "Select Branch",
      placeHolder: "Select Branch",
      type: "dropdown",
      required: true,
    },
    {
      name: "loanId",
      label: "Select Loan",
      placeHolder: "Select Loan",
      required: true,
      type: "dropdown",
    },
    {
      name: "interestId",
      label: "Interest Type",
      required: true,
      type: "dropdown",
    },
    {
      name: "principalAmt",
      label: "Enter principal Amount",
      required: true,
      type: "amount",
      minAmount: minAllowedAmount,
      maxAmount: maxAllowedAmount,
      placeHolder: "Enter Quantity",
    },
    {
      name: "interestRate",
      label: "Enter Interest Rate",
      required: true,
      type: "amount",
      minAmount: minInterestRate,
      maxAmount: maxInterestRate,
      placeHolder: "Enter Groos Weight",
    },
    {
      name: "installment",
      label: "Enter Installment",
      required: true,
      type: "number",
      placeHolder: "Enter Groos Weight",
    },
    {
      name: "maturityDate",
      label: "Maturity Date",
      required: true,
      type: "date",
      isPast: false,
      placeHolder: "Maturity Date",
    },
    {
      name: "lockerId",
      label: "Select Installment",
      required: true,
      type: "dropdown",
    },
    {
      name: "processingFee",
      label: "Processing Fee",
      required: true,
      type: "number",
      placeHolder: "Processing Fee",
    },
    {
      name: "additionalCharges",
      label: "AdditionalCharges",
      required: true,
      type: "number",
      placeHolder: "Additional Charges",
    },
    {
      name: "lateFine",
      label: "late Fine",
      //   required: true,
      type: "number",
      placeHolder: "lateFine",
    },
    {
      name: "paymentDate",
      label: "Payment Date",
      type: "date",
      required: true,
      isPast: false,
    },
    {
      name: "collectPaymentOnCreate",
      label: "Start Payment Today",
      type: "checkbox",
      required: false,
    },
    {
      name: "image",
      label: "Image",
      type: "text",
      visible: false,
      required: true,
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
        if (name === "collectPaymentOnCreate") {
          fieldValue = false;
        }

        return [name, fieldValue];
      })
    );
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      const newValue = values;
      newValue.interestAmount = spliceDecimals(
        (formik.values.principalAmt * formik.values.interestRate) / 100,
        2
      );
      const data = { ...newValue, image };
      handleSubmit(data);
    },

    enableReinitialize: true,
  });
  console.log(formik.errors);

  useEffect(() => {
    setInterestAmount(
      spliceDecimals(
        (formik.values.principalAmt * formik.values.interestRate) / 100,
        2
      )
    );
  }, [formik.values.principalAmt, formik.values.interestRate]);
  useEffect(() => {
    if (formik.values.loanId) {
      const loan: any = loans.find(
        (p: any) => p._id == formik.values.loanId
      );
      setSeletedLoan(loan);
      formik.setFieldValue("installment", loan.maturityPeriod - 1);
      const maturityPeriod = loan.maturityPeriod;
      const today = new Date();
      const maturityDate = new Date(
        today.setMonth(today.getMonth() + maturityPeriod)
      );

      // Format to 'YYYY-MM-DD'
      const formattedDate = maturityDate.toISOString().split("T")[0];

      // Set value in formik
      formik.setFieldValue("maturityDate", formattedDate);
      formik.setFieldValue("lateFine", loan.lateFine);
      formik.setFieldValue("processingFee", loan.processingFee);
      formik.setFieldValue("additionalCharges", loan.additionalCharges);
    }
  }, [formik.values.loanId]);

  useEffect(() => {
    if (formik.values.interestId) {
      const interest: any = interests.find(
        (p: any) => p._id == formik.values.interestId
      );
      formik.setFieldValue("interestRate", interest.interestMax);
      formik.setFieldValue(
        "principalAmt",
        spliceDecimals(totalAmount * (interest.princiAllowMax / 100), 2)
      );
      setMaxAllowedAmount(
        spliceDecimals(totalAmount * (interest.princiAllowMax / 100), 2)
      );
      setMinAllowedAmount(
        spliceDecimals(totalAmount * (interest.princiAllowMin / 100), 2)
      );
      setMaxInterestRate(interest.interestMax);
      setMinInterestRate(interest.interestMin);
    }
  }, [formik.values.interestId, totalAmount]);

  return (
    <Page>
      <ToastContainer />
      <Box px={0} alignItems={"center"} py={0}>
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                    Add Loan
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 2 }}
                  >
                    <Grid container spacing={2}>
                      {/* Branch dropdown field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="branchId"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Select Branch
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <Autocomplete
                          size="medium"
                          options={branches?.map((option: any) => ({
                            label: option.branchName,
                            value: option._id,
                          }))}
                          value={
                            branches
                              .map((option: any) => ({
                                label: option.branchName,
                                value: option._id,
                              }))
                              .find(
                                (opt) => opt.value === formik.values.branchId
                              ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Branch"
                              error={Boolean(
                                formik.touched.branchId &&
                                  formik.errors.branchId
                              )}
                              helperText={
                                formik.touched.branchId &&
                                formik.errors.branchId
                                  ? (formik.errors.branchId as string)
                                  : ""
                              }
                            />
                          )}
                          onChange={(_, value) => {
                            formik.setFieldValue(
                              "branchId",
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

                      {/* Loan dropdown field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="loanId"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Select Loan
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <Autocomplete
                          size="medium"
                          options={loans.map((option: any) => ({
                            label: option.loanName,
                            value: option._id,
                          }))}
                          value={
                            loans
                              .map((option: any) => ({
                                label: option.loanName,
                                value: option._id,
                              }))
                              .find(
                                (opt) => opt.value === formik.values.loanId
                              ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Loan"
                              error={Boolean(
                                formik.touched.loanId && formik.errors.loanId
                              )}
                              helperText={
                                formik.touched.loanId && formik.errors.loanId
                                  ? (formik.errors.loanId as string)
                                  : ""
                              }
                            />
                          )}
                          onChange={(_, value) => {
                            formik.setFieldValue("loanId", value?.value || "");
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

                      {/* Installment dropdown field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="interestId"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Interest Type
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <Autocomplete
                          size="medium"
                          options={interests.map((option: any) => ({
                            label: option.interestName,
                            value: option._id,
                          }))}
                          value={
                            interests
                              .map((option: any) => ({
                                label: option.interestName,
                                value: option._id,
                              }))
                              .find(
                                (opt) => opt.value === formik.values.interestId
                              ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Interest"
                              error={Boolean(
                                formik.touched.interestId &&
                                  formik.errors.interestId
                              )}
                              helperText={
                                formik.touched.interestId &&
                                formik.errors.interestId
                                  ? (formik.errors.interestId as string)
                                  : ""
                              }
                            />
                          )}
                          onChange={(_, value) => {
                            formik.setFieldValue(
                              "interestId",
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

                      {/* Principal Amount field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="principalAmt"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Enter Principal Amount
                          <span className="text-[#F04438] text-lg">*</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {`( ${minAllowedAmount} -  ${maxAllowedAmount})`}
                          </span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="principalAmt"
                          type="text"
                          placeholder="Enter Principal Amount"
                          value={formik.values.principalAmt}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers and one dot
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              formik.setFieldValue("principalAmt", value);
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.principalAmt &&
                            Boolean(formik.errors.principalAmt)
                          }
                          helperText={
                            formik.touched.principalAmt &&
                            formik.errors.principalAmt
                              ? (formik.errors.principalAmt as string)
                              : ""
                          }
                          autoComplete="off"
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </Grid>

                      {/* Interest Rate field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="interestRate"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Enter Interest Rate
                          <span className="text-[#F04438] text-lg">*</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {`( ${minInterestRate} -  ${maxInterestRate})`}
                          </span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="interestRate"
                          type="text"
                          placeholder="Enter Interest Rate"
                          value={formik.values.interestRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers and one dot
                            if (/^\d*\.?\d{0,1}$/.test(value)) {
                              formik.setFieldValue("interestRate", value);
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.interestRate &&
                            Boolean(formik.errors.interestRate)
                          }
                          helperText={
                            formik.touched.interestRate &&
                            formik.errors.interestRate
                              ? (formik.errors.interestRate as string)
                              : ""
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="processingFee"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Interest Amount
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="processingFee"
                          type="number"
                          placeholder="Interest Amount"
                          value={interestAmount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.processingFee &&
                            Boolean(formik.errors.processingFee)
                          }
                          helperText={
                            formik.touched.processingFee &&
                            formik.errors.processingFee
                              ? (formik.errors.processingFee as string)
                              : ""
                          }
                          autoComplete="off"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>

                      {/* Installment field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="installment"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Enter Installment
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="installment"
                          type="number"
                          placeholder="Enter Installment"
                          value={formik.values.installment}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.installment &&
                            Boolean(formik.errors.installment)
                          }
                          helperText={
                            formik.touched.installment &&
                            formik.errors.installment
                              ? (formik.errors.installment as string)
                              : ""
                          }
                          autoComplete="off"
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            // Block 'e', 'E', '+', '-', and other non-numeric keys
                            if (
                              ["e", "E", "+", "-", ".", "@", ",", " "].includes(
                                e.key
                              ) ||
                              (!/^\d$/.test(e.key) && e.key.length === 1) // blocks other special characters
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Grid>

                      {/* Maturity Date field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="maturityDate"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Maturity Date
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={
                              formik.values.maturityDate
                                ? dayjs(formik.values.maturityDate)
                                : null
                            }
                            onChange={(value) =>
                              formik.setFieldValue(
                                "maturityDate",
                                value ? value.format("YYYY-MM-DD") : ""
                              )
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error:
                                  formik.touched.maturityDate &&
                                  Boolean(formik.errors.maturityDate),
                                helperText:
                                  formik.touched.maturityDate &&
                                  formik.errors.maturityDate
                                    ? (formik.errors.maturityDate as string)
                                    : "",
                                onBlur: () =>
                                  formik.setFieldTouched("maturityDate", true),
                              },
                            }}
                            disablePast
                          />
                        </LocalizationProvider>
                      </Grid>

                      {/* Locker dropdown field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="lockerId"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Select Locker
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <Autocomplete
                          size="medium"
                          options={lockers.map((option: any) => ({
                            label: option.lockerName,
                            value: option._id,
                          }))}
                          value={
                            lockers
                              .map((option: any) => ({
                                label: option.lockerName,
                                value: option._id,
                              }))
                              .find(
                                (opt) => opt.value === formik.values.lockerId
                              ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Locker"
                              error={Boolean(
                                formik.touched.lockerId &&
                                  formik.errors.lockerId
                              )}
                              helperText={
                                formik.touched.lockerId &&
                                formik.errors.lockerId
                                  ? (formik.errors.lockerId as string)
                                  : ""
                              }
                            />
                          )}
                          onChange={(_, value) => {
                            formik.setFieldValue(
                              "lockerId",
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

                      {/* Processing Fee field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="processingFee"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Processing Fee
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="processingFee"
                          type="number"
                          placeholder="Processing Fee"
                          value={formik.values.processingFee}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.processingFee &&
                            Boolean(formik.errors.processingFee)
                          }
                          helperText={
                            formik.touched.processingFee &&
                            formik.errors.processingFee
                              ? (formik.errors.processingFee as string)
                              : ""
                          }
                          autoComplete="off"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>

                      {/* Additional Charges field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="additionalCharges"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Additional Charges
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="additionalCharges"
                          type="number"
                          placeholder="Additional Charges"
                          value={formik.values.additionalCharges}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.additionalCharges &&
                            Boolean(formik.errors.additionalCharges)
                          }
                          helperText={
                            formik.touched.additionalCharges &&
                            formik.errors.additionalCharges
                              ? (formik.errors.additionalCharges as string)
                              : ""
                          }
                          autoComplete="off"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="paymentDate"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Payment Date
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={
                              formik.values.paymentDate
                                ? dayjs(formik.values.paymentDate)
                                : null
                            } // ✅ FIXED
                            onChange={(value) =>
                              formik.setFieldValue(
                                "paymentDate",
                                value ? value.format("YYYY-MM-DD") : ""
                              )
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error:
                                  formik.touched.paymentDate &&
                                  Boolean(formik.errors.paymentDate),
                                helperText:
                                  formik.touched.paymentDate &&
                                  formik.errors.paymentDate
                                    ? (formik.errors.paymentDate as string)
                                    : "",
                              },
                            }}
                            disablePast
                            minDate={firstDayNextMonth}
                            maxDate={twentyEighthNextMonth}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} md={6} mt={"2px"}>
                        <InputLabel
                          htmlFor="collectPaymentOnCreate"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                         Receive First Payment Today?
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <FormControlLabel
                          sx={{ mt: "1px" }}
                          control={
                            <Switch
                              name="collectPaymentOnCreate"
                              checked={formik.values.collectPaymentOnCreate}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  "collectPaymentOnCreate",
                                  e.target.checked
                                )
                              }
                            />
                          }
                          label={
                            formik.values.collectPaymentOnCreate ? "Yes" : "No"
                          }
                          labelPlacement="end"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="paymentDate"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Item Image
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>
                        <ImageUpload
                          onChange={(file) => {
                            formik.setFieldValue("image", file?.name);
                            setImage(file);
                          }}
                        />
                        {formik.touched.image && formik.errors.image && (
                          <span style={{ color: "#ff5630", fontSize: "12px" }}>
                            {formik.errors.image as string}
                          </span>
                        )}
                      </Grid>

                      {/* Late Fine field */}
                      {selectedLoan.calculationType == 1 && (
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            htmlFor="lateFine"
                            className="mb-2 flex items-center gap-1"
                            style={{ color: "#09090F" }}
                          >
                            Late Fine
                            <span className="text-[#F04438] text-lg">*</span>
                          </InputLabel>

                          <TextField
                            size="medium"
                            fullWidth
                            name="lateFine"
                            type="number"
                            placeholder="Late Fine"
                            value={formik.values.lateFine}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.lateFine &&
                              Boolean(formik.errors.lateFine)
                            }
                            helperText={
                              formik.touched.lateFine && formik.errors.lateFine
                                ? (formik.errors.lateFine as string)
                                : ""
                            }
                            autoComplete="off"
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "end",
                      gap: 2,
                    }}
                  >
                    {/* Clear Button */}
                    <Button
                      variant="outlined"
                      onClick={() => formik.resetForm()}
                      sx={{
                        borderColor: "black",
                        color: "black",
                        "&:hover": {
                          borderColor: "#333",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      Clear
                    </Button>

                    {/* Submit Button */}
                    <LoadingButton
                      type="submit"
                      sx={{
                        bgcolor: "black",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#333",
                        },
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        "Add"
                      )}
                    </LoadingButton>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Form>
          <Toast />
        </FormikProvider>
      </Box>
    </Page>
  );
}
