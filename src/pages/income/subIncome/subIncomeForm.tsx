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

import { useSubIncome } from "./subIncomeHooks";
import { useIncome } from "../createIncome/incomeHooks";

interface SubIncomeFormProps {
    isEdit: boolean;
    subIncomeData?: any;
    onClose: () => void;
    onSubmitSuccess: () => void;
}

export const SubIncomeForm: React.FC<SubIncomeFormProps> = ({
    isEdit,
    subIncomeData,
    onClose,
    onSubmitSuccess,
}) => {
    const { createSubIncome, updateSubIncome } = useSubIncome();
    const { incomes, fetchIncomes } = useIncome();

    const [isLoading, setIsLoading] = useState(false);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchIncomes();
    }, []);

    /* ------------------ FORM FIELDS ------------------ */
    const fields: ValidationField[] = [
        {
            name: "name",
            label: "Sub Income Name",
            placeHolder: "Enter Sub Income Name",
            required: true,
            min: 1,
            max: 50,
        },
        {
            name: "incomeId",
            label: "Select Income",
            placeHolder: "Select Income",
            required: true,
        },
    ];

    /* ------------------ FORMIK ------------------ */
    const formik = useFormik({
        initialValues: {
            name: "",
            incomeId: "",
        },
        enableReinitialize: false,
        validationSchema: useValidation(fields),
        validateOnMount: true,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                if (isEdit && subIncomeData?._id) {
                    await updateSubIncome(subIncomeData._id, values);
                } else {
                    await createSubIncome(values);
                }

                onSubmitSuccess();
                onClose();
            } catch (err: any) {
                Toast.show({
                    message: err?.message || "Failed to save sub income",
                    type: "error",
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    /* ------------------ EDIT MODE INIT ------------------ */
    useEffect(() => {
        if (isEdit && subIncomeData?._id) {
            formik.setValues({
                name: subIncomeData.name || "",
                incomeId: subIncomeData.incomeId || "",
            });
        }
    }, [isEdit, subIncomeData]);

    /* ------------------ AUTO FOCUS ------------------ */
    useEffect(() => {
        setTimeout(() => firstInputRef.current?.focus(), 0);
    }, []);

    /* ------------------ UI ------------------ */
    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {isEdit ? "Update Sub Income" : "Add Sub Income"}
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
                    {/* ---------- SUB INCOME NAME ---------- */}
                    <InputLabel className="mb-2">
                        Sub Income Name <span className="text-[#F04438]">*</span>
                    </InputLabel>

                    <TextField
                        fullWidth
                        name="name"
                        placeholder="Enter Sub Income Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name ? (formik.errors.name as string) : ""}
                        inputRef={firstInputRef}
                        sx={{ mb: 3 }}
                    />

                    {/* ---------- INCOME SELECT ---------- */}
                    <InputLabel className="mb-2">
                        Select Income <span className="text-[#F04438]">*</span>
                    </InputLabel>

                    <Autocomplete
                        options={incomes}
                        getOptionLabel={(o: any) => o.incomeName || ""}
                        isOptionEqualToValue={(opt: any, val: any) => opt._id === val._id}
                        value={
                            incomes.find((e: any) => e._id === formik.values.incomeId) ||
                            null
                        }
                        onChange={(_, value) => {
                            formik.setFieldValue("incomeId", value?._id || "");
                        }}
                        onBlur={() => {
                            formik.setFieldTouched("incomeId", true);
                        }}
                        onClose={() => {
                            formik.setFieldTouched("incomeId", true);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Income"
                                error={
                                    formik.touched.incomeId && Boolean(formik.errors.incomeId)
                                }
                                helperText={
                                    formik.touched.incomeId && formik.errors.incomeId
                                        ? (formik.errors.incomeId as string)
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
