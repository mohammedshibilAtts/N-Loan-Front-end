import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Autocomplete,
  Grid,
  InputLabel,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  PAYMENT_MODE_LIST,
  PAYMENT_PROVIDER_LIST,
} from "../../../store/actionTypes";
import { apiRequest } from "../../../store/actions";
import API_ENDPOINTS from "../../../services/endpoints";
import SubTable from "../../../components/subTable/subTable";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import { spliceDecimals } from "../../../const";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  entries: any; // Existing entries passed from parent
  setEntries: any; // Function to update entries
  paymentData: number;
}


const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  entries,
  setEntries,
  paymentData,
}) => {
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<any>([]);
  const [paymentProvide, setPaymentProvider] = useState<any>([]);

  const fields: ValidationField[] = [
    {
      name: "paymentMethod",
      label: "Payment Method",
      placeHolder: "Payment Method",
      type: "dropdown",
    },
    {
      name: "paymentProvider",
      label: "Payment Provider",
      type: "dropdown",
      required: false
    },
    {
      name: "amount",
      label: "amount",
      type: "text",
      required: true,
      min: 1,
    },
  ];

  const formik = useFormik({
    initialValues: {
      paymentMethod: "",
      amount: "",
    },
    validationSchema: useValidation(fields),
    onSubmit: (values: any, { resetForm }) => {
      if(values.amount < 0.01){
        formik.setFieldError(
          "amount",
          `Amount must be greater than 1`
        );
        return;
      }
      const totalEnteredAmount = entries.reduce(
        (acc: number, curr: any) => acc + Number(curr.amount),
        0
      );

      const newTotal = totalEnteredAmount + Number(values.amount);

      if (newTotal > paymentData) {
        formik.setFieldError(
          "amount",
          `Total amount exceeds allowed limit ₹${paymentData}`
        );
        return;
      }

      setEntries((prev: any) => [...prev, values]);
      resetForm();
    },
  });

  useEffect(() => {
    dispatch(
      apiRequest(PAYMENT_MODE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "paymentMode" },
      })
    );
  }, []);

  const { paymentMethodList, paymentProviderList } = useSelector(
    (states: any) => ({
      paymentMethodList: states[PAYMENT_MODE_LIST]?.data,
      paymentProviderList: states[PAYMENT_PROVIDER_LIST]?.data,
    })
  );

  useEffect(() => {
    if (paymentMethodList?.success) {
      setPaymentMethod(paymentMethodList.data.data);
    }
    if (paymentProviderList?.success) {
      setPaymentProvider(paymentProviderList.data.data);
    }
  }, [paymentMethodList, paymentProviderList]);

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

  const selectedMethod = formik.values.paymentMethod;

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "paymentMethod", label: "Payment Method" },
    { id: "paymentProvider", label: "Payment Provider" },
    { id: "amount", label: "Amount" },
  ];

  const mappedData = entries.map((item: any, index: number) => ({
    id: index + 1,
    paymentMethod: paymentMethod.find((m: any) => m._id === item.paymentMethod)?.mode,
    paymentProvider: paymentProvide.find((p: any) => p._id === item.paymentProvider)?.providerName,
    amount: spliceDecimals((item.amount), 2),
  }));


  const handleDelete = (index: number) => {
    const updatedEntries = [...entries];
    updatedEntries.splice(index, 1);
    setEntries(updatedEntries);
  };



  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Payment</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <InputLabel sx={{ mb: 2 }}>Payment Method</InputLabel>
              <Autocomplete
                options={paymentMethod || []}
                getOptionLabel={(opt) => opt.mode}
                onChange={(_, val) =>{
                  formik.setFieldValue("paymentMethod", val?._id || "")
                  formik.setFieldValue("paymentProvider", val?._id || "")
                }
                }
                value={
                  paymentMethod.find(
                    (m: any) => m._id === formik.values.paymentMethod
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Payment Mode"
                    error={Boolean(
                      formik.errors.paymentMethod &&
                      formik.touched.paymentMethod
                    )}
                    helperText={
                      formik.touched.paymentMethod && typeof formik.errors.paymentMethod === "string"
                        ? formik.errors.paymentMethod
                        : ""
                    }

                  />
                )}
              />
            </Grid>

            {(() => {
              const mode = paymentMethod.find((p: any) => p._id == selectedMethod);
              if (mode?.mode != "Cash") {
                return (
                  <Grid item xs={12} sm={12} md={4}>
                    <InputLabel sx={{ mb: 2 }}>Payment Provider</InputLabel>
                    <Autocomplete
                      options={paymentProvide || []}
                      getOptionLabel={(opt) => opt.providerName}
                      onChange={(_, val) =>
                        formik.setFieldValue("paymentProvider", val?._id || "")
                      }
                      value={
                        paymentProvide.find(
                          (p: any) => p._id === formik.values.paymentProvider
                        ) || null
                      }
                      renderInput={(params) => (
                        <TextField
                          placeholder="Select Payment Provider"
                          {...params}
                          error={Boolean(
                            formik.errors.paymentProvider &&
                            formik.touched.paymentProvider
                          )}
                          helperText={
                            formik.touched.paymentProvider &&
                              typeof formik.errors.paymentProvider === "string"
                              ? formik.errors.paymentProvider
                              : ""
                          }
                        />
                      )}
                    />
                  </Grid>
                );
              }
              return null;
            })()}


            <Grid item xs={12} sm={12} md={4}>
              <InputLabel sx={{ mb: 2 }}>Amount</InputLabel>
              <TextField
                fullWidth
                placeholder="Enter Amount"
                type="number"
                value={formik.values.amount}
                onChange={(e) => {
                  let value: number = spliceDecimals(Number(e.target.value), 2);
                  if (value > paymentData) {
                    value = paymentData; // Restrict to max amount
                  }
                  formik.setFieldValue("amount", value);
                }}
                onBlur={formik.handleBlur}
                name="amount"
                error={Boolean(formik.errors.amount && formik.touched.amount)}
                helperText={
                  formik.touched.amount && typeof formik.errors.amount === "string"
                    ? formik.errors.amount
                    : ""
                }

              />
            </Grid>
          </Grid>
        </DialogContent>

        <Grid item xs={12} sm={12} md={12} px={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2} // optional, for some breathing space
          >
            {/* Left side - Input */}
            <Box sx={{ width: 300, mb: 1 }}>
              <InputLabel sx={{ mb: 1 }}>Amount</InputLabel>
              <TextField
                fullWidth
                type="text"
                value={spliceDecimals(paymentData, 2)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            {/* Right side - Buttons */}
            <Box display="flex" gap={1}>
              <Button
                sx={{
                  backgroundColor: "#F5F5F5",
                  color: "#000",
                  textTransform: "none",
                  px: 3,
                }}
                type="button"
                onClick={onClose}
                className="border-2 border-gray-800 text-[#344054] font-medium"
              >
                Close
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
              >
                Save
              </Button>
            </Box>
          </Box>
        </Grid>
      </form>

      <SubTable
        coloums={coloums}
        data={mappedData}
        action={true}
        onDelete={handleDelete}
      />
    </Dialog>
  );
};

export default PaymentModal;
