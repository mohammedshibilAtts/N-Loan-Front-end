import {
  Autocomplete,
  Box,
  Card,
  InputLabel,
  Stack,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import FindUser from "../../findUser/findUser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { apiClear, apiRequest } from "../../../store/actions";
import API_ENDPOINTS from "../../../services/endpoints";
import {
  INTEREST_LIST,
  ITEM_LIST,
  LOAN_ACC_LIST,
  PAYMENT_MODE_LIST,
  PAYMENT_PROVIDER_LIST,
  PRINCIPAL_AMOUNT_ADJ_RES,
} from "../../../store/actionTypes";
// import { itemType } from "../../manageLoan/loanTopUp/loanTopUp";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import PrincipalAmountDetails from "./principalDetails";
import { ValidationField } from "../../../validations/schemaBuilder";
import { useFormik } from "formik";
import { useValidation } from "../../../validations/useValidation";
import { Toast } from "../../../components/toast/toast";
import { spliceDecimals } from "../../../const";
import { useNavigate } from "react-router-dom";

function PrincipalAmount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.userInfo);
  // const [itemData, setItemData] = useState<itemType[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  // const [loanId, setLoanId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [loanAccountData, setLoanAccountData] = useState<any>();
  const [interestType, setInterestType] = useState<any>();
  const [selectedInterest, setSelectedInterest] = useState<any>();
  const [totalAmount, setTotalAmount] = useState<any>();
  // const [interestAmount, setInterestAmount] = useState<number>(0);
  const [minInterestRate, setMinInterestRate] = useState<any>();
  const [maxInterestRate, setMaxInterestRate] = useState<any>();
  const [maxAllowedAmount, setMaxAllowedAmount] = useState<any>();
  const [minAllowedAmount, setMinAllowedAmount] = useState<any>();

  const [customerData, setCustomerData] = useState<{
    customerName: string;
    mobile: string;
  }>();

  useEffect(() => {
    dispatch(apiClear(INTEREST_LIST));
    dispatch(apiClear(ITEM_LIST));
    dispatch(apiClear(LOAN_ACC_LIST));
    dispatch(apiClear(PRINCIPAL_AMOUNT_ADJ_RES));
    setCustomerId("");
    setBranchId("");
    setLoanAccountData({});
    setInterestType([]);
    setTotalAmount(0);
    setMinInterestRate(0);
    setMaxInterestRate(0);
    setMaxAllowedAmount(0);
    setMinAllowedAmount(0);
    return () => {
      dispatch(apiClear(INTEREST_LIST));
      dispatch(apiClear(ITEM_LIST));
      dispatch(apiClear(LOAN_ACC_LIST));
      dispatch(apiClear(PRINCIPAL_AMOUNT_ADJ_RES));
      setCustomerId("");
      setBranchId("");
      setLoanAccountData({});
      setInterestType([]);
      setTotalAmount(0);
      setMinInterestRate(0);
      setMaxInterestRate(0);
      setMaxAllowedAmount(0);
      setMinAllowedAmount(0);
    };
  }, [dispatch]);

  const getInitialValues: any = {};

  const fields: ValidationField[] = [
    {
      name: "customerName",
      label: "Customer Name",
      placeHolder: "Enter Customer Name",
      required: true,
      min: 1,
      max: 50,
    },
    {
      name: "processingFee",
      label: "Processing Fee",
      placeHolder: "Enter Processing Fee",
      required: true,
      min: 1,
      max: 50,
    },
    {
      name: "interestId",
      label: " Interest type",
      placeHolder: "Select Interest",
      required: true,
      type: "dropdown",
    },
    {
      name: "interestRate",
      label: "Interest Rate",
      placeHolder: "Interest Rate",
      minAmount: minInterestRate,
      maxAmount: maxInterestRate,
      required: true,
      type: "amount",
    },
    {
      name: "interestAmt",
      label: "Interest Amount",
      placeHolder: "Enter Interest Amount",
      required: true,
      type: "text",
    },

    {
      name: "orginalPrincipalAmount",
      label: "Original Principal Amount",
      placeHolder: "Original Principal Amount",
      required: true,
      type: "text",
    },
    {
      name: "installment",
      label: "Installment Count",
      placeHolder: "Installment Count",
      required: true,
      type: "text",
    },
    {
      name: "principalAmt",
      label: "New Principal Amount",
      placeHolder: "New Principal Amount",
      required: true,
      type: "amount",
      minAmount: minAllowedAmount,
      maxAmount: maxAllowedAmount,
    },
    {
      name: "reason",
      label: "Adjustment Reason",
      placeHolder: "Adjustment Reason",
      required: false,
      type: "text",
    },
    {
      name: "maturityDate",
      label: "Date of Maturity",
      placeHolder: "Adjustment Reason",
      required: true,
      isPast: false,
      type: "date",
    },
    {
      name: "authorizedBy",
      label: "Authorized By",
      placeHolder: "Authorized By",
      required: true,
      type: "text",
    },
    {
      name: "remarks",
      label: "Notes/Remarks",
      placeHolder: "Enter Notes/Remarks",
      required: false,
      type: "text",
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      placeHolder: "Enter Payment Method",
      required: false,
      visible:false,
      type: "dropdown",
    },
    {
      name: "paymentProvider",
      label: "Payment Provider",
      placeHolder: "Payment Provider",
      required: false,
      visible:false,
      type: "dropdown",
    },
   
  ];

  const formik = useFormik({
    initialValues: getInitialValues,
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      
        let hasError = false;

  if (!values.paymentMethod) {
     Toast.show({
          message: "Payment method is required",
          type: "error",
        });
    hasError = true;
  }

  if (
    values.paymentMethodMode !== "Cash" &&
    !values.paymentProvider
  ) {
    formik.setFieldError(
      "paymentProvider",
      "Payment provider is required"
    );
    hasError = true;
  }

  if (hasError) return;

      const data = values;
      data.accountId = accountData?.data._id;
      data.customerId = accountData?.data.customerId;
      data.approvedBy = userInfo?.id;
      data.totalProcessingFee =
        accountData?.data.processingFee + Number(values.processingFee);

      dispatch(
        apiRequest(PRINCIPAL_AMOUNT_ADJ_RES, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "create",
          params: { tableName: "principalAmountAdj", data },
        })
      );
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    dispatch(
      apiRequest(PAYMENT_PROVIDER_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "paymentProvider",
          filters: { paymentMode: formik.values.paymentMethod },
        },
      })
    );
  }, [formik.values.paymentMethod]);

  const handleCustomerId = (data: any) => {
    setCustomerId(data._id);
    setCustomerData({
      customerName: `${data.firstName} ${data.lastName}`,
      mobile: data.mobile,
    });
  };

  const handleLoanId = (id: string) => {
    dispatch(
      apiRequest(ITEM_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findItemDetails",
        params: {
          tableName: "itemDetail",
          customerId,
          accountId: id,
          branchId,
        },
      })
    );
    dispatch(
      apiRequest(LOAN_ACC_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findById",
        params: {
          tableName: "loanAccount",
          id,
          populateFields: ["interestId", "loanId"],
        },
      })
    );
  };
  const handleBranchId = (id: string) => {
    setBranchId(id);
  };

  useEffect(() => {
    dispatch(
      apiRequest(INTEREST_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "Interest" },
      })
    );
  }, []);

  const { itemDetails, accountData, interest, principalAdjRes } = useSelector(
    (states: any) => ({
      interest: states[INTEREST_LIST]?.data,
      itemDetails: states[ITEM_LIST]?.data,
      accountData: states[LOAN_ACC_LIST]?.data,
      principalAdjRes: states[PRINCIPAL_AMOUNT_ADJ_RES]?.data,
    })
  );

  useEffect(() => {
    if (itemDetails?.success) {
      // setItemData(itemDetails.data.data);
      setTotalAmount(itemDetails?.data?.totalAmount);
    }
    if (accountData?.success) {
      setLoanAccountData(accountData.data);
      formik.setFieldValue(
        "orginalPrincipalAmount",
        accountData.data.principalAmt
      );
      formik.setFieldValue(
        "installment",
        accountData.data.installment - accountData.data.paidInstallment
      );
      formik.setFieldValue("interestId", accountData?.data.interestId._id);
      formik.setFieldValue("customerName", customerData?.customerName);
      formik.setFieldValue("interestRate", accountData?.data.interestRate);
      const principal = formik.values.principalAmt || 0;
      const rate = Number(accountData?.data?.interestRate) || 0;
      const calculatedInterest = spliceDecimals((principal * rate) / 100, 2);
      formik.setFieldValue("interestAmt", calculatedInterest);
      formik.setFieldValue("maturityDate", accountData?.data.maturityDate);
      formik.setFieldValue(
        "authorizedBy",
        userInfo?.username?.charAt(0).toUpperCase() +
          userInfo?.username?.slice(1)
      );
    }
    const min = spliceDecimals(
      totalAmount * (accountData?.data.interestId.princiAllowMin / 100),
      2
    );
    const max = spliceDecimals(accountData?.data?.principalAmt, 2);
    const minRate = spliceDecimals(accountData?.data.interestId.interestMin, 2);
    const maxRate = spliceDecimals(accountData?.data.interestId.interestMax, 2);

    setMinInterestRate(minRate);
    setMaxInterestRate(maxRate);
    setMinAllowedAmount(min);
    setMaxAllowedAmount(max);
    formik.setFieldValue("principalAmt", max);
    // formik.setFieldValue('interestAmt',)
    if (interest?.success) {
      setInterestType(interest.data.data);
    }
  }, [itemDetails, accountData]);

  useEffect(() => {
    if (principalAdjRes) {
      if (principalAdjRes?.success) {
        Toast.show({
          message: "Principal amount updated successfully",
          type: "success",
        });
        return navigate("/payment/principal-history");
      } else {
        Toast.show({
          message: "Failed to update principal amount",
          type: "error",
        });
      }
    }
  }, [principalAdjRes]);
  useEffect(() => {
    if (selectedInterest && totalAmount) {
      const min = spliceDecimals(
        totalAmount * (selectedInterest.princiAllowMin / 100),
        2
      );
      const max = spliceDecimals(
        totalAmount * (selectedInterest.princiAllowMax / 100),
        2
      );
      const minRate = spliceDecimals(selectedInterest.interestMin, 2);
      const maxRate = spliceDecimals(selectedInterest.interestMax, 2);
      setMinInterestRate(minRate);
      setMaxInterestRate(maxRate);
      setMinAllowedAmount(min);
      setMaxAllowedAmount(max);
      const principal = formik.values.principalAmt || 0;
      const rate = Number(accountData?.data?.interestRate) || 0;
      const calculatedInterest = spliceDecimals((principal * rate) / 100, 2);
      formik.setFieldValue("interestAmt", calculatedInterest);
      formik.setFieldValue("principalAmt", max);
      formik.setFieldValue("interestRate", maxRate);
    }
  }, [totalAmount, selectedInterest]);

  useEffect(() => {
    const principal = formik.values.principalAmt || 0;
    const rate = Number(accountData?.data?.interestRate) || 0;
    const calculatedInterest = spliceDecimals((principal * rate) / 100, 2);
    formik.setFieldValue("interestAmt", calculatedInterest);
  }, [formik.values.principalAmt]);

  useEffect(() => {
    const amount =
      formik.values?.principalAmt * (formik.values.interestRate / 100);
    formik.setFieldValue("interestAmt", spliceDecimals(amount, 2));
  }, [formik.values.interestRate]);

  return (
    <>
      <Box px={5}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Payment" },
                { label: "Principal Amount", active: true },
              ]}
            />
          </Stack>
        </Stack>
        <FindUser
          title={"Interest Payment"}
          handleCustomerId={handleCustomerId}
          handleBranch={handleBranchId}
          handleLoanId={handleLoanId}
        />

        {accountData && (
          <>
            <Card sx={{ my: 4 }}>
              <Grid container spacing={2} p={4}>
                {fields
                  .filter((i) => i.visible !== false)
                  .map((field) => {
                    // Dropdown
                    if (field.type === "dropdown") {
                      return (
                        <Grid item xs={12} md={6} key={field.name}>
                          <InputLabel
                            sx={{ color: "black", mb: "7px" }}
                            htmlFor={field.name}
                          >
                            {field.label}
                            {field.required && (
                              <span className="text-[#F04438] ">*</span>
                            )}
                          </InputLabel>
                          <Autocomplete
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
                                  (opt: any) =>
                                    opt.value === formik.values.interestId
                                ) || null
                            }
                            onChange={(_, value: any) => {
                              const interestId = value?.value || "";
                              formik.setFieldValue("interestId", interestId);
                              const findInterest: any = interestType.find(
                                (p: any) => p._id === value?.value
                              );
                              setSelectedInterest(findInterest);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={
                                  formik.touched[field.name] &&
                                  Boolean(formik.errors[field.name])
                                }
                                helperText={
                                  formik.touched[field.name]
                                    ? (formik.errors[field.name] as string)
                                    : ""
                                }
                                placeholder={field.placeHolder}
                              />
                            )}
                          />
                        </Grid>
                      );
                    }

                    //   Text or Date Fields
                    const isDateField = field.type === "date";
                    const value = isDateField
                      ? formik.values[field.name]?.slice(0, 10) || ""
                      : formik.values[field.name];

                    return (
                      <Grid item xs={12} md={6} key={field.name}>
                        <InputLabel
                          htmlFor={field.name}
                          sx={{ color: "black", mb: "7px" }}
                        >
                          {field.label}

                          {field.name === "interestRate" && (
                            <span className="text-gray-500 text-sm ml-1">
                              ({minInterestRate} - {maxInterestRate})
                            </span>
                          )}

                          {field.name === "principalAmt" && (
                            <span className="text-gray-500 text-sm ml-1">
                              ({minAllowedAmount} - {maxAllowedAmount})
                            </span>
                          )}

                          {field.required && (
                            <span className="text-[#F04438]">*</span>
                          )}
                        </InputLabel>

                        <TextField
                          fullWidth
                          name={field.name}
                          type={isDateField ? "date" : field.type || "text"}
                          placeholder={field.placeHolder}
                          value={value}
                          onChange={(e) => {
                            if (field.name === "interestRate") {
                              const value = e.target.value;
                              if (/^\d*(\.\d{0,2})?$/.test(value)) {
                                formik.setFieldValue("interestRate", value);
                              }
                              return;
                            }

                            if (field.name === "principalAmt") {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                formik.setFieldValue("principalAmt", value);
                              }
                              return;
                            }

                            formik.setFieldValue(field.name, e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched[field.name] &&
                            Boolean(formik.errors[field.name])
                          }
                          helperText={
                            formik.touched[field.name]
                              ? (formik.errors[field.name] as string)
                              : ""
                          }
                          InputLabelProps={
                            isDateField ? { shrink: true } : undefined
                          }
                          InputProps={
                            field.name === "orginalPrincipalAmount" ||
                            field.name === "authorizedBy" ||
                            field.name === "interestAmt" ||
                            field.name === "customerName"
                              ? { readOnly: true }
                              : undefined
                          }
                        />
                      </Grid>
                    );
                  })}
                <PaymentFields formik={formik} />
              </Grid>
            </Card>

            <PrincipalAmountDetails
              accountData={loanAccountData}
              data={customerData}
            />

            <Grid item sx={{ my: 3, display: "flex", justifyContent: "end" }}>
              <Button
                sx={{
                  backgroundColor: "#F5F5F5",
                  color: "#000",
                  textTransform: "none",
                  px: 3,
                }}
                type="button"
                // variant="outlined"
                onClick={() => formik.resetForm()}
                className="border-2 border-gray-800 text-[#344054] font-medium"
              >
                Clear
              </Button>
              <Button
                onClick={() => formik.handleSubmit()}
                variant="contained"
                sx={{
                  bgcolor: "black",
                  color: "white",
                  marginLeft: 1,
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
                style={{ background: "black" }}
                disabled={!formik.isValid}
              >
                Save
              </Button>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}

export default PrincipalAmount;



interface PaymentFieldsProps {
  formik: any;
}

const PaymentFields: React.FC<PaymentFieldsProps> = ({ formik }) => {
  const dispatch = useDispatch();

  const [methods, setMethods] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  /* ---------------- FETCH PAYMENT METHODS ---------------- */
  useEffect(() => {
    dispatch(
      apiRequest(PAYMENT_MODE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "paymentMode" },
      })
    );
  }, [dispatch]);

  /* ---------------- SELECTORS ---------------- */
  const { paymentMethodList, paymentProviderList } = useSelector(
    (state: any) => ({
      paymentMethodList: state[PAYMENT_MODE_LIST]?.data,
      paymentProviderList: state[PAYMENT_PROVIDER_LIST]?.data,
    })
  );

  /* ---------------- SET DATA ---------------- */
  useEffect(() => {
    if (paymentMethodList?.success) {
      setMethods(paymentMethodList.data.data);
    }

    if (paymentProviderList?.success) {
      setProviders(paymentProviderList.data.data);
    }
  }, [paymentMethodList, paymentProviderList]);

  /* ---------------- FETCH PROVIDERS ON METHOD CHANGE ---------------- */
  useEffect(() => {
    if (!formik.values.paymentMethod) return;

    dispatch(
      apiRequest(PAYMENT_PROVIDER_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "paymentProvider",
          filters: { paymentMode: formik.values.paymentMethod },
        },
      })
    );
  }, [formik.values.paymentMethod, dispatch]);

  /* ---------------- PAYMENT LOGIC ---------------- */
  const selectedMode = methods.find(
    (m) => m._id === formik.values.paymentMethod
  );

  const isCash = selectedMode?.mode === "Cash";

  return (
    <>
      {/* ---------------- PAYMENT METHOD ---------------- */}
     <Grid item xs={12} md={6}>
  <InputLabel sx={{ color: "black", mb: "7px" }}>
    Payment Method  <span className="text-[#F04438] ">*</span>
  </InputLabel> 

  <Autocomplete
    options={methods}
    getOptionLabel={(opt: any) => opt.mode}
    value={
      methods.find((m) => m._id === formik.values.paymentMethod) || null
    }
    onChange={(_, val) => {
      formik.setFieldValue("paymentMethod", val?._id || "");
      formik.setFieldValue("paymentMethodMode", val?.mode || "");
      formik.setFieldValue("paymentProvider", "");
    }}
    onBlur={() => formik.setFieldTouched("paymentMethod", true)}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Select Payment Method"
        error={
          Boolean(
            formik.touched.paymentMethod &&
              formik.errors.paymentMethod
          )
        }
        helperText={
          formik.touched.paymentMethod &&
          formik.errors.paymentMethod
        }
      />
    )}
  />
</Grid>


      {/* ---------------- PAYMENT PROVIDER ---------------- */}
  {!isCash && (
  <Grid item xs={12} md={6}>
    <InputLabel sx={{ color: "black", mb: "7px" }} >
      Payment Provider   <span className="text-[#F04438] ">*</span>
    </InputLabel>

    <Autocomplete
      options={providers}
      getOptionLabel={(opt: any) => opt.providerName}
      value={
        providers.find(
          (p) => p._id === formik.values.paymentProvider
        ) || null
      }
      onChange={(_, val) => {
        formik.setFieldValue("paymentProvider", val?._id || "");
      }}
      onBlur={() =>
        formik.setFieldTouched("paymentProvider", true)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Payment Provider"
          error={
            Boolean(
              formik.touched.paymentProvider &&
                formik.errors.paymentProvider
            )
          }
          helperText={
            formik.touched.paymentProvider &&
            formik.errors.paymentProvider
          }
        />
      )}
    />
  </Grid>
)}

    </>
  );
};
