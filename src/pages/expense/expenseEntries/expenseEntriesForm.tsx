import React, { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Grid,
  InputLabel,
  TextField,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IndianRupee } from "lucide-react";
import { Icon } from "@iconify/react";
import mdiClose from "@iconify/icons-mdi/close";

import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";

import { useExpenseEntries } from "./expenseEntriesHook";
import { useBranch } from "../../settings/branch/branchHooks";
import { useExpense } from "../createExpense/expensehooks";
import { useSubExpense } from "../subExpense/subexpenseHooks";
import { usePaymentMethod } from "../../../hooks/commonhooks/paymentMethod";

/* ---------- TYPES ---------- */
type Option = { label: string; value: string };

interface Props {
  isEdit: boolean;
  entryId?: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const ExpenseEntriesForm: React.FC<Props> = ({
  isEdit,
  entryId,
  onClose,
  onSubmitSuccess,
}) => {
  /* ---------- DATA HOOKS ---------- */
  const { selectedEntry, createEntry, updateEntry, fetchById, loading } =
    useExpenseEntries();

  const { branches, fetchBranches } = useBranch();
  const { expenses, fetchExpenses } = useExpense();
  const { subExpenses, fetchSubExpenseByExpenseId } = useSubExpense();
  const { paymentModes, paymentProviders, fetchPaymentProviders } =
    usePaymentMethod();

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchBranches();
    fetchExpenses();
  }, []);

  /* ---------- FETCH EDIT DATA ---------- */
  useEffect(() => {
    if (isEdit && entryId) {
      fetchById(entryId);
    }
  }, [isEdit, entryId]);

  /* ---------- CASCADE ON EDIT ---------- */
  useEffect(() => {
    if (selectedEntry?.expense) {
      fetchSubExpenseByExpenseId(selectedEntry.expense);
    }
    if (selectedEntry?.paymentMethod) {
      fetchPaymentProviders(selectedEntry.paymentMethod);
    }
  }, [selectedEntry]);

  /* ---------- OPTIONS (CORRECT WAY) ---------- */
  const branchOptions: Option[] = useMemo(
    () => branches.map((b: any) => ({ label: b.branchName, value: b._id })),
    [branches]
  );

  const expenseOptions: Option[] = useMemo(
    () => expenses.map((e: any) => ({ label: e.expenseName, value: e._id })),
    [expenses]
  );

  const subExpenseOptions: Option[] = useMemo(
    () => subExpenses.map((s: any) => ({ label: s.name, value: s._id })),
    [subExpenses]
  );

  /* ---------- FORM FIELDS ---------- */
  const fields: ValidationField[] = [
    {
      name: "expenseDate",
      label: "Expense Date",
      type: "date",
      required: true,
    },
    { name: "branch", label: "Branch", type: "dropdown", required: true },
    { name: "expense", label: "Expense", type: "dropdown", required: true },
    {
      name: "subExpense",
      label: "Sub Expense",
      type: "dropdown",
      required: true,
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "dropdown",
      required: true,
    },
    { name: "paymentProvider", label: "Payment Provider", type: "dropdown" },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "remarks", label: "Remarks" },
  ];

  /* ---------- FORM ---------- */
  const formik: any = useFormik({
    initialValues: {
      expenseDate: selectedEntry?.expenseDate
        ? dayjs(selectedEntry.expenseDate)
        : null,
      branch: selectedEntry?.branch || "",
      expense: selectedEntry?.expense || "",
      subExpense: selectedEntry?.subExpense || "",
      paymentMethod: selectedEntry?.paymentMethod || "",
      paymentProvider: selectedEntry?.paymentProvider || "",
      amount: selectedEntry?.amount || "",
      remarks: selectedEntry?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: useValidation(fields),
    validate: (values) => {
      const errors: any = {};
      const selectedMode = paymentModes.find(
        (p: any) => p.value === values.paymentMethod
      );

      // If payment mode is selected and NOT Cash (paymentNo: 1), Provider is required
      if (selectedMode && selectedMode.data?.paymentNo !== 1) {
        if (!values.paymentProvider) {
          errors.paymentProvider = "Payment Provider is required";
        }
      }
      return errors;
    },

    onSubmit: async (values) => {
      const payload = {
        ...values,
        expenseDate: dayjs(values.expenseDate).toISOString(),
      };

      const success = isEdit
        ? await updateEntry(entryId!, payload)
        : await createEntry(payload);

      if (success) {
        onClose();
        onSubmitSuccess();
      }
    },
  });

  /* ---------- HELPERS ---------- */
  const getOption = (options: Option[], value: string) =>
    options.find((o) => o.value === value) || null;

  const resolveOptions = (field: string): Option[] => {
    switch (field) {
      case "branch":
        return branchOptions;
      case "expense":
        return expenseOptions;
      case "subExpense":
        return subExpenseOptions;
      case "paymentMethod":
        return paymentModes;
      case "paymentProvider":
        return paymentProviders;
      default:
        return [];
    }
  };

  /* ---------- UI ---------- */
  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>
        {isEdit ? "Update Expense Entry" : "Add Expense Entry"}
      </DialogTitle>

      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Icon icon={mdiClose} />
      </IconButton>

      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {fields.map((field) => {
              if (field.name === "paymentProvider") {
                const selectedMethod = getOption(
                  paymentModes,
                  formik.values.paymentMethod
                );
                if (selectedMethod?.label?.toLowerCase() === "cash") {
                  return null;
                }
              }

              return (
                <Grid item xs={12} md={6} key={field.name}>
                  <InputLabel>{field.label}</InputLabel>

                  {field.type === "dropdown" ? (
                    <Autocomplete
                      options={resolveOptions(field.name)}
                      getOptionLabel={(o) => o.label}
                      isOptionEqualToValue={(a, b) => a.value === b.value}
                      value={getOption(
                        resolveOptions(field.name),
                        formik.values[field.name]
                      )}
                      onBlur={() => formik.setFieldTouched(field.name, true)}
                      onChange={(_, v: any) => {
                        formik.setFieldValue(field.name, v?.value || "");
                        if (field.name === "expense")
                          fetchSubExpenseByExpenseId(v?.value);
                        if (field.name === "paymentMethod") {
                          fetchPaymentProviders(v?.value);
                          formik.setFieldValue("paymentProvider", "");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(
                            formik.touched[field.name] &&
                            formik.errors[field.name]
                          )}
                          helperText={
                            (formik.touched[field.name] &&
                              formik.errors[field.name]) as string
                          }
                        />
                      )}
                    />
                  ) : field.type === "date" ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        sx={{ width: 1 }}
                        value={formik.values.expenseDate}
                        onChange={(v) => {
                          if (!v) return;

                          const now = dayjs();

                          const merged = v
                            .hour(now.hour())
                            .minute(now.minute())
                            .second(now.second())
                            .millisecond(now.millisecond());

                          formik.setFieldValue("expenseDate", merged);
                        }}
                        slotProps={{
                          textField: {
                            onBlur: () =>
                              formik.setFieldTouched("expenseDate", true),
                            error: Boolean(
                              formik.touched.expenseDate &&
                              formik.errors.expenseDate
                            ),
                            helperText: (formik.touched.expenseDate &&
                              formik.errors.expenseDate) as string,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  ) : (
                    <TextField
                      fullWidth
                      type={field.type}
                      {...formik.getFieldProps(field.name)}
                      error={Boolean(
                        formik.touched[field.name] && formik.errors[field.name]
                      )}
                      helperText={
                        formik.touched[field.name] && formik.errors[field.name]
                      }
                      InputProps={{
                        startAdornment:
                          field.name === "amount" ? (
                            <InputAdornment position="start">
                              <IndianRupee size={18} />
                            </InputAdornment>
                          ) : undefined,
                      }}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          onClick={() => formik.handleSubmit()}
        >
          {loading ? <CircularProgress size={22} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
