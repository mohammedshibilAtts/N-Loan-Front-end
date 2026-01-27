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

import { useIncomeEntries } from "./incomeEntriesHooks";
import { useBranch } from "../../settings/branch/branchHooks";
import { useIncome } from "../createIncome/incomeHooks";
import { useSubIncome } from "../subIncome/subIncomeHooks";
import { usePaymentMethod } from "../../../hooks/commonhooks/paymentMethod";

/* ---------- TYPES ---------- */
type Option = { label: string; value: string };

interface Props {
  isEdit: boolean;
  entryId?: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const IncomeEntriesForm: React.FC<Props> = ({
  isEdit,
  entryId,
  onClose,
  onSubmitSuccess,
}) => {
  /* ---------- DATA HOOKS ---------- */
  const { selectedEntry, createEntry, updateEntry, fetchById, loading } =
    useIncomeEntries();

  const { branches, fetchBranches } = useBranch();
  const { incomes, fetchIncomes } = useIncome();
  const { subIncomes, fetchSubIncomeByIncomeId } = useSubIncome();
  const { paymentModes, paymentProviders, fetchPaymentProviders } =
    usePaymentMethod();

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchBranches();
    fetchIncomes();
  }, []);

  /* ---------- FETCH EDIT DATA ---------- */
  useEffect(() => {
    if (isEdit && entryId) {
      fetchById(entryId);
    }
  }, [isEdit, entryId]);

  /* ---------- CASCADE ON EDIT ---------- */
  useEffect(() => {
    if (selectedEntry?.income) {
      const id = selectedEntry.income._id || selectedEntry.income;
      fetchSubIncomeByIncomeId(id);
    }
    if (selectedEntry?.paymentMethod) {
      const id = selectedEntry.paymentMethod._id || selectedEntry.paymentMethod;
      fetchPaymentProviders(id);
    }
  }, [selectedEntry]);

  /* ---------- OPTIONS (CORRECT WAY) ---------- */
  const branchOptions: Option[] = useMemo(
    () => branches.map((b: any) => ({ label: b.branchName, value: b._id })),
    [branches]
  );

  const incomeOptions: Option[] = useMemo(
    () => incomes.map((e: any) => ({ label: e.incomeName, value: e._id })),
    [incomes]
  );

  const subIncomeOptions: Option[] = useMemo(
    () => subIncomes.map((s: any) => ({ label: s.name, value: s._id })),
    [subIncomes]
  );

  /* ---------- FORM FIELDS ---------- */
  const fields: ValidationField[] = [
    { name: "incomeDate", label: "Income Date", type: "date", required: true },
    { name: "branch", label: "Branch", type: "dropdown", required: true },
    { name: "income", label: "Income", type: "dropdown", required: true },
    {
      name: "subIncome",
      label: "Sub Income",
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
      incomeDate: selectedEntry?.incomeDate
        ? dayjs(selectedEntry.incomeDate)
        : null,
      branch: selectedEntry?.branch?._id || selectedEntry?.branch || "",
      income: selectedEntry?.income?._id || selectedEntry?.income || "",
      subIncome:
        selectedEntry?.subIncome?._id || selectedEntry?.subIncome || "",
      paymentMethod:
        selectedEntry?.paymentMethod?._id || selectedEntry?.paymentMethod || "",
      paymentProvider:
        selectedEntry?.paymentProvider?._id ||
        selectedEntry?.paymentProvider ||
        "",
      amount: selectedEntry?.amount || "",
      remarks: selectedEntry?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: useValidation(fields),

    onSubmit: async (values) => {
      const payload = {
        ...values,
        incomeDate: dayjs(values.incomeDate).toISOString(),
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
      case "income":
        return incomeOptions;
      case "subIncome":
        return subIncomeOptions;
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
        {isEdit ? "Update Income Entry" : "Add Income Entry"}
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
            {fields.map((field) => (
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
                    onChange={(_, v: any) => {
                      formik.setFieldValue(field.name, v?.value || "");
                      if (field.name === "income")
                        fetchSubIncomeByIncomeId(v?.value);
                      if (field.name === "paymentMethod")
                        fetchPaymentProviders(v?.value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(formik.errors[field.name])}
                        helperText={formik.errors[field.name] as string}
                      />
                    )}
                  />
                ) : field.type === "date" ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: 1 }}
                      value={formik.values.incomeDate}
                      onChange={(v) => {
                        if (!v) return;

                        const now = dayjs();

                        const merged = v
                          .hour(now.hour())
                          .minute(now.minute())
                          .second(now.second())
                          .millisecond(now.millisecond());

                        formik.setFieldValue("incomeDate", merged);
                      }}
                    />
                  </LocalizationProvider>
                ) : (
                  <TextField
                    fullWidth
                    type={field.type}
                    {...formik.getFieldProps(field.name)}
                    error={Boolean(formik.errors[field.name])}
                    helperText={formik.errors[field.name]}
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
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
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
