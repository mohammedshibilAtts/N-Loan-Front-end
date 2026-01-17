import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { Box, TextField, Button, CircularProgress, Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Grid, InputLabel } from "@mui/material";
import { apiClear, apiRequest } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINTS from "../../../services/endpoints";
import { UPDATE_CASH } from "../../../store/actionTypes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import mdiClose from "@iconify/icons-mdi/close";
import { Icon } from "@iconify/react/dist/iconify.js";



interface EntryFormProps {

    onClose: () => void;
    onSubmitSuccess: () => void;
    data?: any;

}

interface Field {
    name: string;
    type?: string;
}


const CashEntriesForm: React.FC<EntryFormProps> = ({

    onClose,
    onSubmitSuccess,
    data

}) => {

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const firstInputRef = useRef<HTMLInputElement>(null);
   

    const fields: ValidationField[] = [

        {
            name: "currentBalance",
            label: "Current Balance",
            placeHolder: "Enter Current balance",
            type: "text",
            min: 0,
            required: true,
        },
        {
            name: "updatedBalance",
            label: "Updated Balance",
            placeHolder: "Enter updated Balance",
            type: "number",
            min: 0,
            required: true,
        },
        {
            name: "remarks",
            label: "Remarks",
            placeHolder: "Enter remarks",
            type: "text",
            required: false,
        },
    ];

    const { createResponse } = useSelector(
        (states: any) => ({
            createResponse: states[UPDATE_CASH]?.data,

        })
    );

    const getInitialValues = () => {
        if (!Array.isArray(fields)) return {};
      
        return Object.fromEntries(
          fields.map(({ name }: Field) => {
            // Only set currentBalance from data.close
            const fieldValue = name === "currentBalance" ? data?.close ?? 0 : "";
            return [name, fieldValue];
          })
        );
      };


    // Formik initialization
    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: useValidation(fields),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const data = {
                    procedureName: "create",
                    params: {
                        tableName: "closingentry",

                        data: {
                            ...values,

                        }
                    },
                };

                dispatch(
                    apiRequest(
                        UPDATE_CASH,
                        "post",
                        API_ENDPOINTS.SP.POST,
                        data
                    )
                );
            } catch (error) {
                console.error("Error saving:", error);
                toast.error("An error occurred while saving.");
                setIsLoading(false);
            }
        },
        enableReinitialize: true,
    });

    // Clear API responses when the modal is opened or closed
    useEffect(() => {
        dispatch(apiClear(UPDATE_CASH));


        return () => {
            dispatch(apiClear(UPDATE_CASH));

        };
    }, [dispatch]);

    // Handle API response for create
    useEffect(() => {
        if (createResponse?.success !== undefined) {
            if (createResponse.success) {
                toast.success(createResponse.message, { autoClose: 1000 });
                setTimeout(() => {
                    onClose(); 
                    onSubmitSuccess();
                }, 1000); 
            } else {
                toast.error(createResponse.message);
            }
            setIsLoading(false);
        }
    }, [createResponse]);

    useEffect(() => {
        if (firstInputRef.current) {

            setTimeout(() => {
                firstInputRef.current?.focus();
            }, 0);
        }
    }, []);

    

    return (
        <>
            <Dialog
                open
                onClose={onClose}
                // width="xl"
                fullWidth
                PaperProps={{
                    sx: {
                        width: "500px",
                        display: "flex",
                        justifyContent: "center",
                    },
                }}
            >
                <ToastContainer />
                <DialogTitle>{"Update Daily"}</DialogTitle>
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
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                            {fields.map((field) => {

                                return (
                                    <Grid item xs={12} sm={12} md={12} key={field.name}>
                                        <InputLabel htmlFor={field.name} className="mb-2 flex items-center gap-1">
                                            {field.label}
                                            {field.required && <span className="text-[#F04438] text-lg">*</span>}
                                        </InputLabel>


                                        <TextField
                                            fullWidth
                                            placeholder={field.placeHolder}
                                            value={formik.values[field.name]}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched[field.name] && formik.errors[field.name])}
                                            helperText={
                                                formik.touched[field.name] && typeof formik.errors[field.name] === "string"
                                                    ? (formik.errors[field.name] as string)
                                                    : undefined
                                            }
                                            type={field.name === "updatedBalance" ? "number" : "text"}
                                            onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                                            onKeyDown={(e) => {
                                                if (field.name === "updatedBalance" && e.key === "Enter") e.preventDefault();
                                            }}
                                            onChange={(e) => {
                                                const value =
                                                    field.name === "updatedBalance" ? Number(e.target.value) : e.target.value;
                                                formik.setFieldValue(field.name, value);
                                              
                                                formik.setTouched({ ...formik.touched, [field.name]: true });
                                            }}
                                            InputProps={{
                                                readOnly: field.name === "currentBalance", 
                                              }}
                                            sx={{ mb: 3 }}
                                        />


                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </DialogContent>



                <DialogActions>
                    <Button
                        onClick={onClose}
                        style={{ background: "#F5F5F5", color: "black" }}
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ background: "black" }}
                        disabled={isLoading || !formik.isValid}
                        onClick={() => formik.handleSubmit()}
                    >
                        {
                            isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Save"
                            )
                            // </>
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CashEntriesForm