import React, { useEffect, useState } from "react";
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
import SubTable from "../../components/subTable/subTable";
import { useValidation } from "../../validations/useValidation";
import { ValidationField } from "../../validations/schemaBuilder";
import { spliceDecimals } from "../../const";
import { usePayment } from "./paymentHooks";

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
  const [totalAmount, setTotalAmount] = useState(0);
  // Use the generic hook for fetching modes/providers
  const {
    paymentModes,
    paymentProviders,
    fetchPaymentModes,
    fetchPaymentProviders,
  } = usePayment();

  useEffect(() => {
    fetchPaymentModes();
  }, []);

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
      required: false,
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
      if (Number(values.amount) < 0.01) {
        formik.setFieldError("amount", `Amount must be greater than 1`);
        return;
      }

      const entryWithId = {
        ...values,
        _tempId: Date.now() + Math.random(), // unique client-side id
      };

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
      setEntries((prev: any) => [...prev, entryWithId]);
      resetForm();
    },
  });

  console.log(formik.errors)
  useEffect(() => {
    const totalEnteredAmount = entries.reduce(
      (acc: number, curr: any) => acc + Number(curr.amount || 0),
      0
    );

    const balance = paymentData - totalEnteredAmount;
    setTotalAmount(balance >= 0 ? balance : 0);
  }, [entries, paymentData]);

  // Fetch providers when payment method changes
  useEffect(() => {
    if (formik.values.paymentMethod) {
      fetchPaymentProviders(formik.values.paymentMethod);
    }
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
    _tempId: item._tempId,
    paymentMethod:
      paymentModes.find((m: any) => m._id === item.paymentMethod)?.mode ||
      "Loading...",
    paymentProvider:
      paymentProviders.find((p: any) => p._id === item.paymentProvider)
        ?.providerName || (item.paymentProvider ? "Loading..." : "N/A"),
    amount: spliceDecimals(item.amount, 2),
  }));

  const handleDelete = (row: any) => {
    setEntries((prev: any) =>
      prev.filter((item: any) => item._tempId !== row._tempId)
    );
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
                options={paymentModes || []}
                getOptionLabel={(opt) => opt.mode}
                onChange={(_, val) =>{
                  formik.setFieldValue("paymentMethod", val?._id || "")
                  formik.setFieldValue("paymentProvider","")
                }}
                value={
                  paymentModes.find(
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
                      formik.touched.paymentMethod &&
                      typeof formik.errors.paymentMethod === "string"
                        ? formik.errors.paymentMethod
                        : ""
                    }
                  />
                )}
              />
            </Grid>

            {(() => {
              const mode = paymentModes.find(
                (p: any) => p._id == selectedMethod
              );
              if (mode?.mode != "Cash") {
                return (
                  <Grid item xs={12} sm={12} md={4}>
                    <InputLabel sx={{ mb: 2 }}>Payment Provider</InputLabel>
                    <Autocomplete
                      options={paymentProviders || []}
                      getOptionLabel={(opt) => opt.providerName}
                      onChange={(_, val) =>
                        formik.setFieldValue("paymentProvider", val?._id || "")
                      }
                      value={
                        paymentProviders.find(
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
                  formik.touched.amount &&
                  typeof formik.errors.amount === "string"
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
              <InputLabel sx={{ mb: 1 }}>Total Amount</InputLabel>
              <TextField
                fullWidth
                type="text"
                value={spliceDecimals(paymentData, 2)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{ width: 300, mb: 1 }}>
              <InputLabel sx={{ mb: 1 }}>Balance Amount</InputLabel>
              <TextField
                fullWidth
                type="text"
                value={spliceDecimals(totalAmount, 2)}
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
