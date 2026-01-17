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
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { apiClear, apiRequest } from "../../../store/actions";
import API_ENDPOINTS from "../../../services/endpoints";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import {
  INTEREST_LIST,
  LoanAccount_UPDATE_RES,
} from "../../../store/actionTypes";
import SubTable from "../../../components/subTable/subTable";
import { OctagonAlert } from "lucide-react";
import { Toast } from "../../../components/toast/toast";
import { spliceDecimals } from "../../../const";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

// Configure dayjs
dayjs.locale("en");
const dateFormat = "DD/MM/YYYY";

export default function LoanTopUpDetails({
  accountData,
  data,
  tableData,
  totalAmount,
}: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [interestType, setInterestType] = useState([]);
  const [interestAmount, setInterestAmount] = useState<number>(0);
  const [minInterestRate, setMinInterestRate] = useState<any>();
  const [maxInterestRate, setMaxInterestRate] = useState<any>();
  const [maxAllowedAmount, setMaxAllowedAmount] = useState<any>();
  const [minAllowedAmount, setMinAllowedAmount] = useState<any>();
  const [selectedInterest, setSelectedInterest] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(apiClear(INTEREST_LIST));
    dispatch(apiClear(LoanAccount_UPDATE_RES));
    setMinInterestRate(0);
    setInterestAmount(0);
    setMaxInterestRate(0);
    setMaxAllowedAmount(0);
    setMinAllowedAmount(0);
    setSelectedInterest(0);
    setLoading(false);
    setInterestType([]);

    return () => {
      dispatch(apiClear(INTEREST_LIST));
      dispatch(apiClear(LoanAccount_UPDATE_RES));
      setMinInterestRate(0);
      setInterestAmount(0);
      setMaxInterestRate(0);
      setMaxAllowedAmount(0);
      setMinAllowedAmount(0);
      setSelectedInterest(0);
      setLoading(false);
      setInterestType([]);
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      apiRequest(INTEREST_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "Interest" },
      })
    );
  }, []);

  const { interest, loanTopUp } = useSelector((states: any) => ({
    interest: states[INTEREST_LIST]?.data,
    loanTopUp: states[LoanAccount_UPDATE_RES]?.data,
  }));

  const fields: ValidationField[] = [
    {
      name: "interestId",
      label: "Select Interest",
      type: "dropdown",
      required: true,
    },

    {
      name: "interestRate",
      label: "Enter Interest Rate",
      required: true,
      type: "amount",
      minAmount: minInterestRate,
      maxAmount: maxInterestRate,
      placeHolder: "Enter Interest Rate",
    },
    {
      name: "interestAmount",
      label: "Interest Amount",
      required: true,
      type: "number",
      placeHolder: "Interest Amount",
    },
    {
      name: "processingFee",
      label: " Enter processing fee",
      required: true,
      type: "number",
      placeHolder: "Enter processing fee",
    },
    {
      name: "principalAmt",
      label: " Total Payable Amount (After Top-Up)",
      required: true,
      type: "amount",
      minAmount: minAllowedAmount,
      maxAmount: maxAllowedAmount,
      placeHolder: "Total Payable Amount (After Top-Up)",
    },
  ];

  const Loanfields = [
    {
      label: "Loan Start Date",
      value: accountData?.createdAt
        ? new Date(accountData.createdAt).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Existing Loan Amount",
      value: `₹${spliceDecimals(accountData?.principalAmt, 2)}` || "N/A",
    },
    {
      label: "Current Interest Amount",
      value: `₹${spliceDecimals(accountData?.interestAmount, 2)}` || "N/A",
    },
    {
      label: "Customer Phone no",
      value: data?.customerMobile || "N/A",
    },
    {
      label: "Customer Name",
      value: data?.customerName || "N/A",
    },
    {
      label: "Current Loan Eligible Amount",
      value: `₹${spliceDecimals(maxAllowedAmount, 2)}` || "N/A",
    },
  ];

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "metal", label: "Metal" },
    { id: "Purity", label: "Purity" },
    { id: "Net wt", label: "Net WT" },
    { id: "Value", label: "Value" },
  ];

  const columnsData = tableData?.map((item: any, index: any) => ({
    id: index + 1,
    metal: item.metalName,
    Purity: item.purityName,
    "Net wt": item.netWt,
    Value: spliceDecimals(item.value, 2),
  }));

  const getInitialValues = () => {
    return Object.fromEntries(
      fields?.map(({ name, value }: any) => {
        let fieldValue: any = accountData?.[name] ?? "";

        if (fieldValue === undefined) {
          fieldValue = value !== undefined ? value : "";
        }

        if (name === "dateField" && fieldValue) {
          fieldValue = dayjs(fieldValue, dateFormat);
        }

        if (name === "interestId" && fieldValue) {
          fieldValue = accountData?.interestId?._id ?? "";
        }

        return [name, fieldValue];
      })
    );
  };

  useEffect(() => {
    const interest = accountData?.interestId;
    if (interest && totalAmount) {
      const min = spliceDecimals(accountData?.principalAmt, 2);
      const max = totalAmount * (interest.princiAllowMax / 100);
      const minRate = interest.interestMin;
      const maxRate = interest.interestMax;

      setMinInterestRate(minRate);
      setMaxInterestRate(maxRate);
      setMinAllowedAmount(spliceDecimals(min, 2));
      setMaxAllowedAmount(spliceDecimals(max, 2));
    }
  }, [accountData?.interestId, totalAmount]);

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    onSubmit: async () => {},

    enableReinitialize: true,
  });

  useEffect(() => {
    if (accountData) {
      setSelectedInterest(accountData.interestId);
      const amount =
        formik.values?.principalAmt * (formik.values.interestRate / 100);
      setInterestAmount(spliceDecimals(amount, 2));
    }
    if (interest?.success) {
      setInterestType(interest.data.data);
    }
  }, [interest, accountData]);

  useEffect(() => {
    if (loanTopUp) {
      setLoading(false);
      if (loanTopUp?.success) {
        formik.resetForm();
        Toast.show({
          message: "Account Top Up Successfuly",
          type: "success",
        });
        navigate("/manageloan/topup-history");
        return;
      }
      return Toast.show({ message: "Failed to Topup ", type: "error" });
    }
  }, [loanTopUp]);

  useEffect(() => {
    if (totalAmount && selectedInterest) {
      formik.setFieldValue(
        "principalAmt",
        spliceDecimals(
          totalAmount * (selectedInterest?.princiAllowMax / 100),
          2
        )
      );

      setMaxAllowedAmount(
        spliceDecimals(
          totalAmount * (selectedInterest?.princiAllowMax / 100),
          2
        )
      );
      setMinAllowedAmount(spliceDecimals(accountData?.principalAmt, 2));
      setMinInterestRate(selectedInterest.interestMin);
      setMaxInterestRate(selectedInterest.interestMax);
    }
  }, [totalAmount, formik.values.interestId]);

  useEffect(() => {
    const amount =
      formik.values?.principalAmt * (formik.values.interestRate / 100);

    setInterestAmount(spliceDecimals(amount, 2));
  }, [
    formik.values.interestRate,
    formik.values.interestId,
    formik.values.principalAmt,
  ]);

  const handleSubmit = () => {
    if (formik.errors.principalAmt) {
      console.log(formik.errors.principalAmt);
      Toast.show({ message: "" + formik.errors.principalAmt, type: "error" });
      return;
    }
    if (formik.errors.interestRate) {
      console.log(formik.errors.interestRate);
      Toast.show({ message: "" + formik.errors.interestRate, type: "error" });
      return;
    }
    setLoading(true);
    dispatch(
      apiRequest(LoanAccount_UPDATE_RES, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "CreateloanTopUp",
        params: {
          tableName: "loanAccount",
          id: accountData._id,
          updateFields: {
            principalAmt: formik.values.principalAmt,
            processingFee:
              accountData.processingFee + formik.values.processingFee,
            interestRate: formik.values.interestRate,
            interestAmount:interestAmount,
          },
        },
      })
    );
  };

  return (
    <>
      <Card sx={{ my: 3 }}>
        <Box>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                      Loan Details
                    </Typography>

                    <Box
                      component="form"
                      onSubmit={formik.handleSubmit}
                      sx={{ mt: 2 }}
                    >
                      <Grid container spacing={2}>
                        {/* Interst dropdown field */}
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            htmlFor="interestId"
                            className="mb-2 flex items-center gap-1"
                            style={{ color: "#09090F" }}
                          >
                            Select Interest
                            <span className="text-[#F04438] text-lg">*</span>
                          </InputLabel>

                          <Autocomplete
                            size="medium"
                            options={interestType?.map((option: any) => ({
                              label: option.interestName,
                              value: option._id,
                            }))}
                            value={
                              interestType
                                ?.map((option: any) => ({
                                  label: option.interestName,
                                  value: option._id,
                                }))
                                ?.find(
                                  (opt) =>
                                    opt.value === formik.values.interestId
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
                            onChange={(_, value: any) => {
                              const interestId = value?.value || "";
                              formik.setFieldValue("interestId", interestId);
                              const findInterest: any = interestType.find(
                                (p: any) => p._id == value.value
                              );
                              setSelectedInterest(findInterest);
                              formik.setFieldValue(
                                "interestRate",
                                findInterest?.interestMax
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
                              if (/^\d*\.?\d*$/.test(value)) {
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
                            autoComplete="off"
                          />
                        </Grid>

                        {/* Interest Amount */}
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            htmlFor="interestAmount"
                            className="mb-2 flex items-center gap-1"
                            style={{ color: "#09090F" }}
                          >
                            Interest Amount
                            <span className="text-[#F04438] text-lg">*</span>
                          </InputLabel>

                          <TextField
                            size="medium"
                            fullWidth
                            name="interestAmount"
                            type="number"
                            placeholder="Interest Amount"
                            value={interestAmount}
                            onBlur={formik.handleBlur}
                            autoComplete="off"
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>

                        {/* processing fee */}
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            htmlFor="processingFee"
                            className="mb-2 flex items-center gap-1"
                            style={{ color: "#09090F" }}
                          >
                            Enter processing Fee
                            <span className="text-[#F04438] text-lg">*</span>
                          </InputLabel>

                          <TextField
                            size="medium"
                            fullWidth
                            name="processingFee"
                            type="number"
                            placeholder="Enter processing Fee"
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
                          />
                        </Grid>

                        {/* Total payble amount */}
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            htmlFor="principalAmt"
                            className="mb-2 flex items-center gap-1"
                            style={{ color: "#09090F" }}
                          >
                            Total Payable Amount (After Top-Up)
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
                            placeholder="Total Payable Amount"
                            value={formik.values.principalAmt}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
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
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Box>

        {accountData?.principalAmt >= maxAllowedAmount && (
          <Box px={4} maxWidth={"60%"} my={2} height={"68px"}>
            <Alert severity="warning" icon={<OctagonAlert />}>
              Note: The customer is currently not eligible for a loan topup
            </Alert>
          </Box>
        )}
      </Card>

      <Card sx={{ my: 3 }}>
        <Box
          py={2}
          alignItems={"center"}
          sx={{
            backgroundColor: "white",
            margin: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
            Loan Details
          </Typography>
          <Grid container spacing={2}>
            {Loanfields?.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ padding: 2, height: "100%" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box px={3}>
          <SubTable coloums={coloums} data={columnsData} action={false} />
        </Box>
      </Card>

      {accountData?.principalAmt >= minAllowedAmount && (
        <Grid
          item
          sx={{ mt: 3, py: 2, display: "flex", justifyContent: "end" }}
        >
          <Button
            sx={{
              backgroundColor: "#F5F5F5",
              color: "#000",
              textTransform: "none",
              px: 3,
            }}
            type="button"
            // variant="outlined"

            className="border-2 border-gray-800 text-[#344054] font-medium"
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "black",
              color: "white",
              "&:hover": {
                bgcolor: "#333",
              },
            }}
            disabled={
              !formik.errors || accountData?.principalAmt >= maxAllowedAmount
            }
            onClick={handleSubmit}
            style={{ background: "black" }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "save"
            )}
          </LoadingButton>
        </Grid>
      )}
    </>
  );
}
