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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Icon } from "@iconify/react";
// import mdiClose from '@iconify/icons-mdi/close';
import mdiClose from "@iconify/icons-mdi/close";
import { useFormik } from "formik";

import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { Toast } from "../../../components/toast/toast";

import { useBranch } from "./branchHooks";

interface BranchFormProps {
  isEdit: boolean;
  branchData?: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const BranchForm: React.FC<BranchFormProps> = ({
  isEdit,
  branchData,
  onClose,
  onSubmitSuccess,
}) => {
  const { createBranch, updateBranch } = useBranch();

  const [isLoading, setIsLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  /* ------------------ BRANCH TYPES ------------------ */
  const branchTypeOptions = [
    { value: 1, label: "Head Office" },
    { value: 2, label: "Sub Branch" },
  ];

  /* ------------------ FORM FIELDS ------------------ */
  const fields: ValidationField[] = [
    {
      name: "branchName",
      label: "Branch Name",
      placeHolder: "Enter Branch Name",
      required: true,
      min: 1,
      max: 50,
    },
    {
      name: "branchType",
      label: "Branch Type",
      placeHolder: "Select Branch Type",
      required: true,
    },
  ];

  /* ------------------ FORMIK ------------------ */
  const formik = useFormik({
    initialValues: {
      branchName: "",
      branchType: "",
    },
    enableReinitialize: false,
    validationSchema: useValidation(fields),
    validateOnMount: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (isEdit && branchData?._id) {
          await updateBranch(branchData._id, {
            branchName: values.branchName,
            branchType: Number(values.branchType),
          });
        } else {
          await createBranch({
            branchName: values.branchName,
            branchType: Number(values.branchType),
          });
        }

        onSubmitSuccess();
        onClose();
      } catch (err: any) {
        Toast.show({
          message: err?.message || "Failed to save branch",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  /* ------------------ EDIT MODE INIT ------------------ */
  useEffect(() => {
    if (isEdit && branchData?._id) {
      formik.setValues({
        branchName: branchData.branchName || "",
        branchType: branchData.branchType || "",
      });
    }
  }, [isEdit, branchData]);

  /* ------------------ AUTO FOCUS ------------------ */
  useEffect(() => {
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);
  }, []);

  /* ------------------ UI ------------------ */
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? "Update Branch" : "Add Branch"}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Icon icon={mdiClose} />
      </IconButton>

      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          {/* --------- BRANCH NAME --------- */}
          <TextField
            fullWidth
            name="branchName"
            label="Branch Name"
            placeholder="Enter Branch Name"
            value={formik.values.branchName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.branchName && Boolean(formik.errors.branchName)
            }
            helperText={
              formik.touched.branchName && formik.errors.branchName
                ? (formik.errors.branchName as string)
                : ""
            }
            inputRef={firstInputRef}
            autoComplete="off"
            sx={{ mb: 3 }}
          />

          {/* --------- BRANCH TYPE --------- */}
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Branch Type</FormLabel>
            <RadioGroup
              row
              name="branchType"
              value={formik.values.branchType}
              onChange={formik.handleChange}
            >
              {branchTypeOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>

            {formik.touched.branchType && formik.errors.branchType && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", ml: 2 }}>
                {formik.errors.branchType as string}
              </Box>
            )}
          </FormControl>
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
