import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
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
  InputLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import mdiClose from "@iconify/icons-mdi/close";

import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { Toast } from "../../../components/toast/toast";
import { useDepartment } from "./departmenthooks";

interface DepartmentFormProps {
  isEdit: boolean;
  departmentData?: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  isEdit,
  departmentData,
  onClose,
  onSubmitSuccess,
}) => {
  const { createDepartment, updateDepartment } = useDepartment();

  const [isLoading, setIsLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  /* ------------------ FORM FIELDS ------------------ */
  const fields: ValidationField[] = [
    {
      name: "departmentName",
      label: "Department Name",
      placeHolder: "Enter Department Name",
      required: true,
      min: 1,
      max: 50,
    },
  ];

  /* ------------------ INITIAL VALUES ------------------ */
  const getInitialValues = () => ({
    departmentName: departmentData?.departmentName || "",
  });

  /* ------------------ FORMIK ------------------ */
  const formik: any = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: useValidation(fields),
    validateOnMount: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (isEdit && departmentId) {
          await updateDepartment(departmentId, values);
        } else {
          await createDepartment(values);
        }

        onSubmitSuccess();
        onClose();
      } catch (error: any) {
        Toast.show({
          message: error?.message || "An error occurred, try again",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  /* ------------------ HANDLE EDIT DATA ------------------ */
  useEffect(() => {
    if (isEdit && departmentData?._id) {
      setDepartmentId(departmentData._id);
      formik.setValues(getInitialValues());
    }
  }, [isEdit, departmentData]);

  /* ------------------ AUTO FOCUS ------------------ */
  useEffect(() => {
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);
  }, []);

  /* ------------------ CLEANUP ------------------ */
  useEffect(() => {
    return () => {
      formik.resetForm();
      setDepartmentId(null);
    };
  }, []);

  /* ------------------ UI ------------------ */
  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { width: 420 } }}
    >
      <DialogTitle>
        {isEdit ? "Update Department" : "Add Department"}
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
          {fields.map((field, index) => (
            <Box key={field.name}>
              <InputLabel className="mb-2 flex items-center gap-1">
                {field.label}
                {field.required && (
                  <span className="text-[#F04438] text-lg">*</span>
                )}
              </InputLabel>

              <TextField
                fullWidth
                name={field.name}
                placeholder={field.placeHolder}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                helperText={
                  formik.touched[field.name] && formik.errors[field.name]
                    ? (formik.errors[field.name] as string)
                    : ""
                }
                inputRef={index === 0 ? firstInputRef : undefined}
                autoComplete="off"
                sx={{ mb: 3 }}
              />
            </Box>
          ))}
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
