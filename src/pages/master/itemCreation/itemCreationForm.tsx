
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

import { useMetal } from "../metal/metalhooks";
import { usePurity } from "../purity/purityhooks";
import { useItem } from "./itemhooks";

interface ItemCreationFormProps {
  isEdit: boolean;
  itemData?: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const ItemCreationForm: React.FC<ItemCreationFormProps> = ({
  isEdit,
  itemData,
  onClose,
  onSubmitSuccess,
}) => {
  const { createItem, updateItem } = useItem();
  const { metals,fetchMetals } = useMetal();
  const { purities, fetchPuritiesByMetal } = usePurity();

  const [isLoading, setIsLoading] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  /* ------------------ FORM FIELDS ------------------ */
  const fields: ValidationField[] = [
    {
      name: "itemName",
      label: "Item Name",
      placeHolder: "Enter Item Name",
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
    {
      name: "purityId",
      label: "Select Purity",
      placeHolder: "Select Purity",
      required: true,
    },
    {
      name: "toBePrint",
      label: "To Be Print",
      placeHolder: "To Be Print",
      required: false,
      min: 1,
      max: 50,
    },
  ];
  /* ------------------ INITIAL VALUES ------------------ */
  const getInitialValues = () => ({
    itemName: itemData?.itemName || "",
    metalId: itemData?.metalId?._id || itemData?.metalId || "",
    purityId: itemData?.purityId?._id || itemData?.purityId || "",
    toBePrint: itemData?.toBePrint || "",
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
        if (isEdit && itemId) {
          await updateItem(itemId, values);
        } else {
          await createItem(values);
        }

        onSubmitSuccess();
        onClose();
      } catch (error: any) {
        Toast.show({
          message: error?.message || "Failed to save item",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });
  useEffect(()=>{
    fetchMetals()
  },[])
  /* ------------------ EDIT MODE ------------------ */
  useEffect(() => {
    if (isEdit && itemData?._id) {
      setItemId(itemData._id);
      formik.setValues(getInitialValues());

      if (itemData?.metalId?._id) {
        fetchPuritiesByMetal(itemData.metalId._id);
      }
    }
  }, [isEdit, itemData]);

  /* ------------------ METAL → PURITY ------------------ */
  useEffect(() => {
    if (formik.values.metalId) {
      fetchPuritiesByMetal(formik.values.metalId);
    }
  }, [formik.values.metalId]);

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
      setItemId(null);
    };
  }, []);

  /* ------------------ UI ------------------ */
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? "Update Item" : "Add Item"}</DialogTitle>

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
            /* --------- METAL / PURITY AUTOCOMPLETE --------- */
            if (field.name === "metalId" || field.name === "purityId") {
              const options =
                field.name === "metalId" ? metals : purities;

              return (
                <Box key={field.name}>
                  <InputLabel className="mb-2 flex items-center gap-1">
                    {field.label}
                    <span className="text-[#F04438] text-lg">*</span>
                  </InputLabel>

                  <Autocomplete
                    options={options.map((o: any) => ({
                      label: o.metalName || o.purityName,
                      value: o._id,
                    }))}
                    value={
                      options
                        .map((o: any) => ({
                          label: o.metalName || o.purityName,
                          value: o._id,
                        }))
                        .find(
                          (opt: any) =>
                            opt.value === formik.values[field.name]
                        ) || null
                    }
                    onChange={(_, value) => {
                      formik.setFieldValue(
                        field.name,
                        value?.value || ""
                      );
                      formik.setFieldTouched(field.name, true, true);
                    }}
                    onBlur={() =>
                      formik.setFieldTouched(field.name, true)
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

            /* --------- NORMAL TEXT FIELD --------- */
            return (
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
                    formik.touched[field.name] &&
                    formik.errors[field.name]
                      ? (formik.errors[field.name] as string)
                      : ""
                  }
                  inputRef={index === 0 ? firstInputRef : undefined}
                  autoComplete="off"
                  sx={{ mb: 3 }}
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
