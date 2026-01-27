


import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Autocomplete,
  DialogActions,
  IconButton,
  Grid,
  InputLabel,
  Typography,
} from "@mui/material";
import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { Toast } from "../../../components/toast/toast";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import mdiClose from "@iconify/icons-mdi/close";
import { Icon } from "@iconify/react";
import { IndianRupee } from "lucide-react";
import { useExpense } from "../../expense/createExpense/expensehooks";
import { usePaymentMethod } from "../../../hooks/commonhooks/paymentMethod";
import { useLockerSettlement } from "./lockerSettlHooks";



interface EntryFormProps {
  onClose: () => void;
  lockerData: any;
}

type Option = {
  label: string;
  value: string | number;
};

dayjs.locale("en");

export const SettlementProvider: React.FC<EntryFormProps> = ({
  onClose,
  lockerData,
}) => {
  const firstInputRef = useRef<HTMLInputElement>(null);

  const {
    paymentModes,
    paymentProviders,
    fetchPaymentProviders,
  } = usePaymentMethod();
  const { add,loading } = useLockerSettlement();

  const [paymentMethodLabel, setPaymentMethodLabel] = useState<string | null>(null);

  const fields: ValidationField[] = [
    { name: "expenseDate", label: "Expense Date", type: "date", required: true },
    { name: "paymentMethod", label: "Payment Method", type: "dropdown", required: true },
    { name: "paymentProvider", label: "Payment Provider", type: "dropdown", required: false },
    { name: "amount", label: "Amount", type: "number", min: 0, required: true },
    { name: "remarks", label: "Remarks", type: "text", required: false },
  ];

  const formik:any = useFormik({
    initialValues: {
      expenseDate: "",
      paymentMethod: "",
      paymentProvider: "",
      amount: "",
      remarks: "",
    },
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      try {

        const findPaymentMethodNo = paymentModes.find((i)=>i.value==formik.values.paymentMethod)?.data?.paymentNo
        console.log(findPaymentMethodNo)
        if(findPaymentMethodNo!==1 &&!formik.values.paymentProvider ){
          return Toast.show({message:"Payment Provider is Required",type:"error"})
        }

        const payload = {
          lockerId: lockerData._id,
          lockerName: lockerData.lockerName,
          branch: lockerData.branchId,

          expenseDate: values.expenseDate,
          paymentMethod: values.paymentMethod,
          paymentProvider: values.paymentProvider || null,
          amount: Number(values.amount),
          remarks: values.remarks || "",
        };

        await add(payload);

        onClose();
      } catch (err: any) {
      console.log(err)
      }
    },
  });

  // 🔁 Fetch providers when payment method changes
  useEffect(() => {
    if (formik.values.paymentMethod) {
      fetchPaymentProviders(formik.values.paymentMethod);
      formik.setFieldValue("paymentProvider","")
    }
  }, [formik.values.paymentMethod]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const getOptionsForField = (fieldName: string): Option[] => {
    switch (fieldName) {
      case "paymentMethod":
        return paymentModes.map((m:any) => ({ label: m.label, value: m.value }));
      case "paymentProvider":
        return paymentProviders.map((p:any) => ({
          label: p.label,
          value: p.value
        }));
      default:
        return [];
    }
  };

  const getCurrentValue = (fieldName: string) => {
    const value = formik.values[fieldName];
    if (!value) return null;
    return getOptionsForField(fieldName).find((o) => o.value === value) || null;
  };

  const handleDropdownChange = (fieldName: string, value: Option | null) => {
    formik.setFieldValue(fieldName, value?.value || "");

    if (fieldName === "paymentMethod") {
      setPaymentMethodLabel(value?.label || null);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Locker Settlement</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Icon icon={mdiClose} />
      </IconButton>

      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Expense Date */}
            <Grid item xs={12} md={6}>
              <InputLabel>Expense Date *</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={
                    formik.values.expenseDate
                      ? dayjs(formik.values.expenseDate)
                      : null
                  }
                  onChange={(value) =>
                    formik.setFieldValue(
                      "expenseDate",
                      value ? value.format("YYYY-MM-DD") : ""
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error:
                        formik.touched.expenseDate &&
                        Boolean(formik.errors.expenseDate),
                      helperText:
                        formik.touched.expenseDate &&
                        formik.errors.expenseDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Other Fields */}
            {fields
              .filter((f) => f.name !== "expenseDate")
              .map((field) => {
                if (
                  field.name === "paymentProvider" &&
                  paymentMethodLabel === "Cash"
                ) {
                  return null;
                }

                return (
                  <Grid item xs={12} md={6} key={field.name}>
                    <InputLabel>
                      {field.label}
                      {field.required && <span style={{ color: "red" }}> *</span>}
                    </InputLabel>

                    {field.type === "dropdown" ? (
                      <Autocomplete
                        options={getOptionsForField(field.name)}
                        getOptionLabel={(o) => o.label}
                        value={getCurrentValue(field.name)}
                        onChange={(_, value) =>
                          handleDropdownChange(field.name, value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={field.label}
                            error={
                              formik.touched[field.name] &&
                              Boolean(formik.errors[field.name])
                            }
                            helperText={
                              formik.touched[field.name] &&
                              formik.errors[field.name]
                            }
                          />
                        )}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        type={field.type === "number" ? "number" : "text"}
                        value={formik.values[field.name]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name={field.name}
                        placeholder={field.label}
                        error={
                          formik.touched[field.name] &&
                          Boolean(formik.errors[field.name])
                        }
                        helperText={
                          formik.touched[field.name] &&
                          formik.errors[field.name]
                        }
                        InputProps={
                          field.name === "amount"
                            ? {
                                startAdornment: (
                                  <Typography sx={{ mr: 1 }}>
                                    <IndianRupee size={16} />
                                  </Typography>
                                ),
                              }
                            : undefined
                        }
                      />
                    )}
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Clear
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !formik.isValid}
          onClick={() => formik.handleSubmit()}
        >
          {loading ? <CircularProgress size={22} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
