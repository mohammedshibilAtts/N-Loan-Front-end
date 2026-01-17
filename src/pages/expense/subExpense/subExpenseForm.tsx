import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Autocomplete,
  InputLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import mdiClose from "@iconify/icons-mdi/close";

import { useFormik } from "formik";
import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { Toast } from "../../../components/toast/toast";

import { useSubExpense } from "./subexpenseHooks";
import { useExpense } from "../createExpense/expensehooks";

interface SubExpenseFormProps {
  isEdit: boolean;
  subExpenseData?: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const SubExpenseForm: React.FC<SubExpenseFormProps> = ({
  isEdit,
  subExpenseData,
  onClose,
  onSubmitSuccess,
}) => {
  const { createSubExpense, updateSubExpense } = useSubExpense();
  const { expenses, fetchExpenses } = useExpense();

  const [isLoading, setIsLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);
  /* ------------------ FORM FIELDS ------------------ */
  const fields: ValidationField[] = [
    {
      name: "name",
      label: "Sub Expense Name",
      placeHolder: "Enter Sub Expense Name",
      required: true,
      min: 1,
      max: 50,
    },
    {
      name: "expenseId",
      label: "Select Expense",
      placeHolder: "Select Expense",
      required: true,
    },
  ];

  /* ------------------ FORMIK ------------------ */
  const formik = useFormik({
    initialValues: {
      name: "",
      expenseId: "",
    },
    enableReinitialize: false,
    validationSchema: useValidation(fields),
    validateOnMount: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (isEdit && subExpenseData?._id) {
          await updateSubExpense(subExpenseData._id, values);
        } else {
          await createSubExpense(values);
        }

        onSubmitSuccess();
        onClose();
      } catch (err: any) {
        Toast.show({
          message: err?.message || "Failed to save sub expense",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  /* ------------------ EDIT MODE INIT ------------------ */
  useEffect(() => {
    if (isEdit && subExpenseData?._id) {
      formik.setValues({
        name: subExpenseData.name || "",
        expenseId: subExpenseData.expenseId || "",
      });
    }
  }, [isEdit, subExpenseData]);

  /* ------------------ AUTO FOCUS ------------------ */
  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 0);
  }, []);

  /* ------------------ UI ------------------ */
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {isEdit ? "Update Sub Expense" : "Add Sub Expense"}
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Icon icon={mdiClose} />
      </IconButton>

      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          {/* ---------- SUB EXPENSE NAME ---------- */}
          <InputLabel className="mb-2">
            Sub Expense Name <span className="text-[#F04438]">*</span>
          </InputLabel>

          <TextField
            fullWidth
            name="name"
            placeholder="Enter Sub Expense Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            inputRef={firstInputRef}
            sx={{ mb: 3 }}
          />

          {/* ---------- EXPENSE SELECT ---------- */}
          <InputLabel className="mb-2">
            Select Expense <span className="text-[#F04438]">*</span>
          </InputLabel>

          <Autocomplete
            options={expenses}
            getOptionLabel={(o: any) => o.expenseName || ""}
            isOptionEqualToValue={(opt: any, val: any) => opt._id === val._id}
            value={
              expenses.find((e: any) => e._id === formik.values.expenseId) ||
              null
            }
            onChange={(_, value) => {
              formik.setFieldValue("expenseId", value?._id || "");
            }}
            onBlur={() => {
              formik.setFieldTouched("expenseId", true);
            }}
            onClose={() => {
              // 🔑 This ensures error disappears after selection
              formik.setFieldTouched("expenseId", true);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Expense"
                error={
                  formik.touched.expenseId && Boolean(formik.errors.expenseId)
                }
                helperText={
                  formik.touched.expenseId && formik.errors.expenseId
                    ? (formik.errors.expenseId as string)
                    : ""
                }
              />
            )}
            sx={{ mb: 3 }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ background: "#F5F5F5", color: "black" }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          sx={{ background: "black" }}
          disabled={isLoading || !formik.isValid}
          onClick={() => formik.handleSubmit()}
        >
          {isLoading ? (
            <CircularProgress size={22} sx={{ color: "white" }} />
          ) : isEdit ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
