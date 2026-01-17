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
import { useMetal } from "./metalhooks";

interface MetalFormProps {
  isEdit: boolean;
  metalData?: any; // pass selected metal from parent for edit
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const MetalForm: React.FC<MetalFormProps> = ({
  isEdit,
  metalData,
  onClose,
  onSubmitSuccess,
}) => {
  const {createMetal,updateMetal}: any = useMetal();

  const [isLoading, setIsLoading] = useState(false);
  const [metalId, setMetalId] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  /* ------------------ FORM FIELDS ------------------ */
  const fields: ValidationField[] = [
    {
      name: "metalName",
      label: "Metal Name",
      placeHolder: "Enter Metal Name",
      required: true,
      min: 1,
      max: 50,
    },
  ];

  /* ------------------ INITIAL VALUES ------------------ */
  const getInitialValues = () => {
    return {
      metalName: metalData?.metalName || "",
    };
  };

  /* ------------------ FORMIK ------------------ */
  const formik: any = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (isEdit && metalId) {
          await updateMetal(metalId, values);
        } else {
          await createMetal(values);
        }

        setTimeout(() => {
          onClose();
          onSubmitSuccess();
        }, 500);
      } catch (error: any) {
        console.error("Error saving metal:", error);
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
    if (isEdit && metalData?._id) {
      setMetalId(metalData._id);
      formik.setValues(getInitialValues());
    }
  }, [isEdit, metalData]);

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
      setMetalId(null);
    };
  }, []);

  /* ------------------ UI ------------------ */
  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: "420px",
          display: "flex",
          justifyContent: "center",
        },
      }}
    >
      <DialogTitle>{isEdit ? "Update Metal" : "Add Metal"}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                    formik.setFieldValue(field.name, value);
                  }
                }}
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
                sx={{ mb: 3 }}
                inputRef={index === 0 ? firstInputRef : undefined}
                autoComplete="off"
              />
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          style={{ background: "#F5F5F5", color: "black" }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          style={{ background: "black" }}
          disabled={isLoading || !formik.isValid}
          onClick={() => formik.handleSubmit()}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
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
