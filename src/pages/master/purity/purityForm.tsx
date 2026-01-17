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
  Autocomplete,
  InputLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import mdiClose from "@iconify/icons-mdi/close";

import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { Toast } from "../../../components/toast/toast";
import { usePurity } from "./purityhooks";
import { useMetal } from "../metal/metalhooks";

interface PurityFormProps {
  isEdit: boolean;
  purityData?: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const PurityForm: React.FC<PurityFormProps> = ({
  isEdit,
  purityData,
  onClose,
  onSubmitSuccess,
}) => {
  const { metals,fetchMetals } = useMetal();
  const [isLoading, setIsLoading] = useState(false);
  const [purityId, setPurityId] = useState<string | null>(null);
   const {  createPurity ,updatePurity} = usePurity();

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    fetchMetals()
  },[])
  /* ------------------ FORM FIELDS ------------------ */
  const fields: ValidationField[] = [
    {
      name: "purityName",
      label: "Purity Name",
      placeHolder: "Enter Purity Name",
      required: true,
      min: 1,
      max: 50,
    },
    {
      name: "metalId",
      label: "Select Metal",
      placeHolder: "Select Metal",
      required: true,
    },
  ];



  /* ------------------ INITIAL VALUES ------------------ */
  const getInitialValues = () => ({
    purityName: purityData?.purityName || "",
    metalId: purityData?.metalId?._id || purityData?.metalId || "",
  });

  /* ------------------ FORMIK ------------------ */
  const formik: any = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      console.log("first")
      setIsLoading(true);
      try {
        if (isEdit && purityId) {
           await updatePurity(purityId, values);
         
        } else {
           await createPurity(values);
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
    if (isEdit && purityData?._id) {
      setPurityId(purityData._id);
      formik.setValues(getInitialValues());
    }
  }, [isEdit, purityData]);

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
      setPurityId(null);
    };
  }, []);
  console.log(formik.errors)

  /* ------------------ UI ------------------ */
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? "Update Purity" : "Add Purity"}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Icon icon={mdiClose} />
      </IconButton>

      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          {fields.map((field, index) => {
            if (field.name === "metalId") {
              return (
                <Box key={field.name}>
                  <InputLabel className="mb-2 flex items-center gap-1">
                    {field.label}
                    <span className="text-[#F04438] text-lg">*</span>
                  </InputLabel>

                  <Autocomplete
                    options={metals.map((m) => ({
                      label: m.metalName,
                      value: m._id,
                    }))}
                    value={
                      metals
                        .map((m) => ({ label: m.metalName, value: m._id }))
                        .find((o) => o.value === formik.values.metalId) || null
                    }
                    onChange={(_, value) =>
                      formik.setFieldValue(field.name, value?.value || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={field.placeHolder}
                        error={
                          formik.touched[field.name] &&
                          Boolean(formik.errors[field.name])
                        }
                        helperText={
                          formik.touched[field.name] &&
                          formik.errors[field.name]
                            ? (formik.errors[field.name] as string)
                            : ""
                        }
                      />
                    )}
                    sx={{ mb: 3 }}
                  />
                </Box>
              );
            }

            return (
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
                  inputRef={index === 0 ? firstInputRef : undefined}
                  sx={{ mb: 3 }}
                  autoComplete="off"
                />
              </Box>
            );
          })}
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