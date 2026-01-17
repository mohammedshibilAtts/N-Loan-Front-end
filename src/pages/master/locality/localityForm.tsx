
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
import { useLocality } from "./localityhooks";

interface LocalityFormProps {
  isEdit: boolean;
  localityData?: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const LocalityForm: React.FC<LocalityFormProps> = ({
  isEdit,
  localityData,
  onClose,
  onSubmitSuccess,
}) => {
  const { createLocality, updateLocality } = useLocality();

  const [isLoading, setIsLoading] = useState(false);
  const [localityId, setLocalityId] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  /* ------------------ FORM FIELDS ------------------ */
  const fields: ValidationField[] = [
    {
      name: "name",
      label: "Locality Name",
      placeHolder: "Enter Locality Name",
      required: true,
      min: 1,
      max: 20,
    },
  ];

  /* ------------------ FORMIK ------------------ */
  const formik: any = useFormik({
    initialValues: {
      name: "",
    },
    enableReinitialize: false,
    validationSchema: useValidation(fields),
    validateOnMount: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (isEdit && localityId) {
          await updateLocality(localityId, values);
        } else {
          await createLocality(values);
        }

        onSubmitSuccess();
        onClose();
      } catch (error: any) {
        Toast.show({
          message: error?.message || "Failed to save locality",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  /* ------------------ EDIT MODE INIT ------------------ */
  useEffect(() => {
    if (isEdit && localityData?._id) {
      setLocalityId(localityData._id);
      formik.setValues({
        name: localityData.name || "",
      });
    }
  }, [isEdit, localityData]);

  /* ------------------ AUTO FOCUS ------------------ */
  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 0);
  }, []);

  /* ------------------ CLEANUP ------------------ */
  useEffect(() => {
    return () => {
      formik.resetForm();
      setLocalityId(null);
    };
  }, []);

  /* ------------------ UI ------------------ */
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {isEdit ? "Update Locality" : "Add Locality"}
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
                <span className="text-[#F04438] text-lg">*</span>
              </InputLabel>

              <TextField
                fullWidth
                name={field.name}
                placeholder={field.placeHolder}
                value={formik.values[field.name]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(value)) {
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
                inputRef={index === 0 ? firstInputRef : undefined}
                autoComplete="off"
                sx={{ mb: 3 }}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ background: "#F5F5F5", color: "black" }}>
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
