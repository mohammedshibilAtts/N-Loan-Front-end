import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { Button } from "@mui/material";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import { useEffect, useState } from "react";
import { apiClear, apiRequest } from "../../../store/actions";
import API_ENDPOINTS from "../../../services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import {
  LIST_PAYMENTBASIS,
  LIST_RELATIONSHIP,
  PAYMENT_AMOUNT,
  PAYMENT_CREATE_RES,
} from "../../../store/actionTypes";
import PaymentModal from "./paymentModeModal";
import SubTable from "../../../components/subTable/subTable";
import { Toast } from "../../../components/toast/toast";
import { useNavigate } from "react-router-dom";
import { spliceDecimals } from "../../../const";

// Configure dayjs
dayjs.locale("en");

interface PaymentEntry {
  paymentMethod: string;
  paymentProvider?: string;
  amount: number;
}

export default function Payment({
  accountData,
  // data,
  customerId,
  loanId,
  itemData,
  defaultPaymentBasis
}: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [relationShip, setRelationShip] = useState<any>([]);
  const [paymentBasisData, setPaymentBasisData] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [paymentEntries, setPaymentEntries] = useState<PaymentEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<{
    isDue: number;
    amount: number;
    fineAmount?: number;
  }>({ isDue: 0, amount: 0 });

  useEffect(() => {
    dispatch(apiClear(PAYMENT_CREATE_RES));
    dispatch(apiClear(PAYMENT_AMOUNT));
    setPaymentData({ isDue: 0, amount: 0 });
    setPaymentEntries([]);

    return () => {
      dispatch(apiClear(PAYMENT_CREATE_RES));
      dispatch(apiClear(PAYMENT_AMOUNT));
      setPaymentData({ isDue: 0, amount: 0 });
      setPaymentEntries([]);
      formik.resetForm();
    };
  }, [dispatch]);

  const Loanfields = [
    {
      label: "interest payment",
      value: spliceDecimals(accountData?.interestAmount) || "N/A",
    },
    {
      label: "Total Interest Payable",
      value: spliceDecimals(accountData?.interestAmount * accountData?.installment),
    },
    {
      label: "Principal Amount",
      value: spliceDecimals(accountData?.principalAmt) || "N/A",
    },
    {
      label: "Total Amount Payable",
      value:
        spliceDecimals(
          (accountData?.principalAmt +
            accountData?.interestAmount * accountData?.installment +
            accountData?.processingFee +
            accountData?.additionalCharges)
        ) || "N/A",
    },
    {
      label: "Charges",
      value:
        spliceDecimals(
          (accountData?.processingFee + accountData?.additionalCharges)
        ) || "N/A",
    },
    {
      label: "payable amount",
      value: spliceDecimals(paymentData?.amount) || "N/A",
    },
  ];

  const fields: ValidationField[] = [
    {
      name: "paymentBasis",
      label: "Payment Basis",
      type: "dropdown",
    },
    {
      name: "installmentCount",
      label: "Total Installment",
      type: "number",
    },
    {
      name: "amount",
      label: "Payment Amount",
      type: "text",
    },
    {
      name: "totalAmount",
      label: "Payment Amount",
      type: "text",
    },
    {
      name: "paidBy",
      label: "Name",
      type: "text",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "number",
    },
    {
      name: "relationshipId",
      label: "Relationship",
      type: "dropdown",
    },
    {
      name: "remark",
      label: "Remark",
      type: "text",
    },
    {
      name: "discount",
      label: "Discount",
      type: "text",
    },
  ];

  const initialValues = {
    paymentBasis: defaultPaymentBasis || null,
    paidBy: "",
    relationshipId: "",
    installmentCount: 1,
    amount: 0,
    phoneNumber: "",
    remarks: "",
    totalAmount: "",
    discount: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      try {
        if (formik.values.amount <= 0) {
          Toast.show({ message: "Minimum payment is 1 ", type: "success" });
          return;
        }
        if (formik.values.paymentBasis == 5) {
          if (formik.values.amount !== paymentData.amount) {
            Toast.show({
              message:
                "The partial amount could not be processed during the pre-closure.",
              type: "error",
            });
            return;
          }
        }
        const data: any = {
          ...values,
          totalPaybleAmount: paymentData.amount,
          loanAccountId: loanId,
          customerId,
          modes: paymentEntries,
        };
        if (paymentData?.fineAmount) {
          data.fineAmount = paymentData?.fineAmount;
        }
        setIsLoading(true);
        dispatch(
          apiRequest(PAYMENT_CREATE_RES, "post", API_ENDPOINTS.SP.POST, {
            procedureName: "create",
            params: {
              tableName: "Payment",
              data: data,
            },
          })
        );
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const totalEnteredAmount = paymentEntries.reduce(
      (acc: number, curr: any) => acc + Number(curr.amount),
      0
    );
    +formik.setFieldValue("totalAmount", spliceDecimals(totalEnteredAmount));
    formik.setFieldValue(
      "amount",
      spliceDecimals(Number(totalEnteredAmount) + Number(formik.values.discount))
    );
  }, [paymentEntries, formik.values.discount]);

  // useEffect(() => {
  //   setPaymentEntries([]);
  // }, [formik.values.discount]);

  useEffect(() => {
    dispatch(
      apiRequest(LIST_RELATIONSHIP, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "relationShip",
        },
      })
    );
    dispatch(
      apiRequest(LIST_PAYMENTBASIS, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "paymentBasis",
        },
      })
    );
  }, []);

  useEffect(() => {
    if (formik.values.paymentBasis) {
      dispatch(
        apiRequest(PAYMENT_AMOUNT, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAmount",
          params: {
            tableName: "payment",
            filters: {
              paymentBasis: formik.values.paymentBasis,
              loanAccountId: loanId,
            },
          },
        })
      );
    }
  }, [formik.values.paymentBasis, loanId]);

  const { relationList, paymentBasis, paymentAmount, createPaymentRes } =
    useSelector((states: any) => ({
      relationList: states[LIST_RELATIONSHIP]?.data,
      paymentBasis: states[LIST_PAYMENTBASIS]?.data,
      paymentAmount: states[PAYMENT_AMOUNT]?.data,
      createPaymentRes: states[PAYMENT_CREATE_RES]?.data,
    }));

  useEffect(() => {
    if (relationList?.success) {
      setRelationShip(relationList.data.data);
    }
    if (paymentBasis?.success) {
      setPaymentBasisData(paymentBasis.data.data);
    }
    if (paymentAmount?.success) {
      setPaymentData(paymentAmount.data);
    }
    if (createPaymentRes?.success) {
      setIsLoading(false);
      Toast.show({
        message: "Payment successfully completed",
        type: "success",
      });
      navigate("/payment/managepayment");
    }
  }, [relationList, paymentBasis, paymentAmount, createPaymentRes]);



  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "metal", label: "metal" },
    { id: "Purity", label: "Purity" },
    { id: "Item Type", label: "Item Type" },
    { id: "Gross wt", label: "Gross wt" },
    { id: "Net wt", label: "Net WT" },
    { id: "Quantity", label: "Quantity" },
  ];

  const columnsData = itemData?.map((item: any, index: any) => ({
    id: index + 1, // S.NO
    metal: item.metalId.metalName,
    Purity: item.purityId.purityName,
    "Item Type": item.itemId?.itemName,
    "Gross wt": item.grossWt,
    "Net wt": item.netWt,
    Quantity: item.quantity,
  }));

  return (
    <>
      {modalOpen && (
        <PaymentModal
          onClose={handleModal}
          open={modalOpen}
          entries={paymentEntries}
          setEntries={setPaymentEntries}
          paymentData={
            paymentData.amount -
            parseFloat(Number(formik.values.discount).toFixed(2))
          }
        />
      )}
      <Card sx={{ my: 3 }}>
        <Box
          px={5}
          alignItems="center"
          sx={{
            backgroundColor: "white",
            padding: 2,
            margin: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
            Item Details
          </Typography>

          <Box py={2}>
            <SubTable coloums={coloums} data={columnsData} action={false} />
          </Box>
          <Grid container spacing={2}>
            {/* Left Box */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  padding: 2,
                  border: 1,
                  borderRadius: 2,
                  borderColor: "#F5F5F5",
                }}
              >
                <Grid container spacing={2}>
                  {Loanfields.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "text.secondary" }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}

                  {/* Discount Input Field */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                      >
                        Discount
                      </Typography>
                      <TextField
                        type="number"
                        name="discount"
                        fullWidth
                        size="small"
                        placeholder="Enter discount"
                        value={formik.values.discount}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.discount &&
                          Boolean(formik.errors.discount)
                        }
                        helperText={
                          formik.touched.discount && formik.errors.discount
                        }
                      />
                    </Box>
                  </Grid>

                  {/* Net Amount Input Field */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                      >
                        Net Amount
                      </Typography>
                      <TextField
                        fullWidth
                        value={formik.values.amount}
                        placeholder="Enter net amount"
                        size="small"
                        name="netAmount"
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Box */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  padding: 2,
                  border: 1,
                  borderRadius: 2,
                  borderColor: "#F5F5F5",
                }}
              >
                <Box>
                  <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={4}>
                      {/* Payment Basis */}
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                        >
                          Payment Basis<span className="text-red-500">*</span>
                        </Typography>
                        <Autocomplete
                          options={paymentBasisData}
                          readOnly={!!defaultPaymentBasis}
                          getOptionLabel={(option) => option.mode || ""}
                          value={
                            paymentBasisData.find(
                              (item: any) =>
                                String(item.no) === String(formik.values.paymentBasis)
                            ) || null
                          }
                          onChange={(_, newValue) =>
                            formik.setFieldValue(
                              "paymentBasis",
                              newValue ? newValue.no : ""
                            )
                          }
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
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder="Select Payment Basis"
                              error={
                                formik.touched.paymentBasis &&
                                Boolean(formik.errors.paymentBasis)
                              }
                              helperText={
                                formik.touched.paymentBasis &&
                                (formik.errors.paymentBasis as string)
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "46px",
                                  borderColor: "#10B981",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Payment */}
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                        >
                          Payment
                        </Typography>
                        <TextField
                          fullWidth
                          name="totalAmount"
                          value={formik.values.totalAmount}
                          onChange={formik.handleChange}
                          placeholder="Enter amount"
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Button
                                  sx={{
                                    height: "48px",
                                    px: 2,
                                    minWidth: "unset",
                                    boxShadow: "none",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    color: "black",
                                  }}
                                >
                                  ₹
                                </Button>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  onClick={handleModal}
                                  disabled={paymentData.amount < 0.01}
                                  variant="contained"
                                  sx={{
                                    height: "48px",
                                    borderRadius: "0 8px 8px 0",
                                    backgroundColor: "black",
                                    color: "#fff",
                                    px: 2,
                                    minWidth: "unset",
                                    boxShadow: "none",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    "&:hover": {
                                      backgroundColor: "#333",
                                    },
                                  }}
                                >
                                  <span style={{ marginRight: "4px" }}>+</span>{" "}
                                  Payment Option
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "48px",
                              borderRadius: "8px",
                              paddingRight: 0,
                            },
                          }}
                        />
                      </Grid>

                      {/* Name */}
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                        >
                          Name<span className="text-red-500">*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          name="paidBy"
                          value={formik.values.paidBy}
                          onChange={formik.handleChange}
                          placeholder="Enter name"
                          sx={{
                            "& .MuiOutlinedInput-root": { height: "46px" },
                          }}
                        />
                      </Grid>

                      {/* Phone Number */}
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                        >
                          Phone Number<span className="text-red-500">*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          placeholder="Enter phone no"
                          sx={{
                            "& .MuiOutlinedInput-root": { height: "46px" },
                          }}
                          error={
                            formik.touched.phoneNumber &&
                            Boolean(formik.errors.phoneNumber)
                          }
                          helperText={
                            formik.touched.phoneNumber &&
                            formik.errors.phoneNumber
                          }
                        />
                      </Grid>

                      {/* Relationship */}
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                        >
                          Relationship<span className="text-red-500">*</span>
                        </Typography>

                        <Autocomplete
                          options={relationShip}
                          getOptionLabel={(option) => option.relationName || ""}
                          value={
                            relationShip.find(
                              (item: any) =>
                                item._id === formik.values.relationshipId
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            formik.setFieldValue(
                              "relationshipId",
                              newValue ? newValue._id : ""
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              size="small"
                              placeholder="Select Relationship"
                              error={
                                formik.touched.relationshipId &&
                                Boolean(formik.errors.relationshipId)
                              }
                              helperText={
                                formik.touched.relationshipId &&
                                formik.errors.relationshipId
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "46px",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Remarks */}
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                        >
                          Remarks
                        </Typography>
                        <TextField
                          fullWidth
                          name="remarks"
                          value={formik.values.remarks}
                          onChange={formik.handleChange}
                          placeholder="Enter remarks"
                          sx={{
                            "& .MuiOutlinedInput-root": { height: "46px" },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </form>
                  {!paymentData.isDue ? (
                    <Alert sx={{ mt: 2 }} severity="error">
                      {"No payment pending"}
                    </Alert>
                  ) : Number(formik.values.totalAmount) < 1 ? (
                    <Alert sx={{ mt: 2 }} severity="error">
                      {"Amount must be greater than 1"}
                    </Alert>
                  ) : null}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="end"
          gap={2} // optional, for some breathing space
        >
          <Box display="flex" gap={1}>
            <Button
              sx={{
                backgroundColor: "#F5F5F5",
                color: "#000",
                textTransform: "none",
                px: 3,
              }}
              type="button"
              className="border-2 border-gray-800 text-[#344054] font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={formik.submitForm} // No e.preventDefault needed!
              variant="contained"
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": {
                  bgcolor: "#333",
                },
              }}
              disabled={!paymentData.isDue || formik.values.amount < 1}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": {
                  bgcolor: "#333",
                },
              }}
              disabled={!paymentData.isDue || formik.values.amount < 1}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save & print"}
            </Button>
          </Box>
        </Box>
      </Card>
    </>
  );
}
