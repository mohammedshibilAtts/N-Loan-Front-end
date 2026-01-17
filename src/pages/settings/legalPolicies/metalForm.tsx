import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import { Box, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { apiClear, apiRequest } from '../../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import API_ENDPOINTS from '../../../services/endpoints';
import { METAL_CREATE_RES, METAL_EDIT_RES, METAL_UPDATE_RES } from '../../../store/actionTypes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ValidationField } from '../../../validations/schemaBuilder';
import { useValidation } from '../../../validations/useValidation';
// import { SaveSvg } from '../../../utils/commonFunction';
import mdiClose from '@iconify/icons-mdi/close';
import { Icon } from '@iconify/react/dist/iconify.js';


interface MetalFormProps {
    isEdit: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
}

export const MetalForm: React.FC<MetalFormProps> = ({ isEdit,onClose, onSubmitSuccess }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [metalId, setMetalId] = useState<string | null>(null); // Store the metal ID for updates
    const [metalData, setMetalData] = useState(null); // Store the metal ID for updates

    // Ref for the first input field
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Define fields with validation rules and labels
    const fields: ValidationField[] = [
        { name: 'metalName', label: 'Metal Name', placeHolder: 'Enter Metal Name', required: true, min: 1, max: 50 },
    ];

    // Generate initialValues dynamically from fields and currentUOM
    const getInitialValues = () => {
        return Object.fromEntries(
            fields.map(({ name }) => {
                let fieldValue = metalData?.[name] || '';
                // let fieldValue = currentUOM?.[name];
                if (fieldValue === undefined) {
                    fieldValue = ''; // Default value for empty fields
                }
                return [name, fieldValue];
            })
        );
    };

    const { createResponse, updateResponse, editResponse } = useSelector((states: any) => ({
        createResponse: states[METAL_CREATE_RES]?.data,
        updateResponse: states[METAL_UPDATE_RES]?.data,
        editResponse: states[METAL_EDIT_RES]?.data,
    }));

    // Formik initialization
    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: useValidation(fields),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const data = {
                    procedureName: isEdit ? 'update' : 'create',
                    params: {
                        tableName: 'metal',
                        ...(isEdit && { id: metalId }), // Include ID for update
                        data: {
                            ...values,
                        },
                        checkWith: ["metalName",],
                    },
                };

                dispatch(apiRequest(isEdit ? METAL_UPDATE_RES : METAL_CREATE_RES, 'post', API_ENDPOINTS.SP.POST, data));
            } catch (error) {
                console.error('Error saving metal:', error);
                toast.error('An error occurred while saving the metal.');
                setIsLoading(false);
            }
        },
        enableReinitialize: true, // Allow formik to reinitialize when initialValues change
    });

    // Clear API responses when the modal is opened or closed
    useEffect(() => {
        dispatch(apiClear(METAL_CREATE_RES));
        dispatch(apiClear(METAL_UPDATE_RES));
        dispatch(apiClear(METAL_EDIT_RES));
        return () => {
            dispatch(apiClear(METAL_CREATE_RES));
            dispatch(apiClear(METAL_UPDATE_RES));
            dispatch(apiClear(METAL_EDIT_RES));
            formik.resetForm();
            setMetalId(null);
        };
    }, [dispatch]);

    // Handle API response for create
    useEffect(() => {
        if (createResponse?.success !== undefined) {
            if (createResponse.success) {
                toast.success(createResponse.message, { autoClose: 1000 });
                setTimeout(() => {
                    onClose(); // Close modal after toast is shown
                    onSubmitSuccess(); // Trigger success callback
                }, 1000); // Wait for toast to auto-close
            } else {
                toast.error(createResponse.message);
            }
            setIsLoading(false);
        }
    }, [createResponse]);

    // Handle API response for edit
    useEffect(() => {
        if (editResponse?.success) {
            // Populate form fields with editResponse data
            console.log('getInitialValues ', getInitialValues());
            setMetalData(editResponse.data);
            formik.setValues(getInitialValues());
            setMetalId(editResponse.data._id); // Store the ID for updates
        }
    }, [editResponse]);

    // Handle API response for update
    useEffect(() => {
        if (updateResponse?.success !== undefined) {
            if (updateResponse.success) {
                toast.success(updateResponse.message, { autoClose: 1000 });
                setTimeout(() => {
                    onClose(); // Close modal after toast is shown
                    onSubmitSuccess(); // Trigger success callback
                }, 1000); // Wait for toast to auto-close
            } else {
                toast.error(updateResponse.message);
            }
            setIsLoading(false);
        }
    }, [updateResponse]);

    // Reset form when currentMetal changes (for edit)
    // useEffect(() => {
    //     if (currentMetal) {
    //         formik.setValues(getInitialValues());
    //         setMetalId(currentMetal._id); // Store the ID for updates
    //     } else {
    //         formik.resetForm();
    //         setMetalId(null); // Clear the ID for new metal
    //     }
    // }, [currentMetal]);

    // Set focus on the first input field when the modal opens
    useEffect(() => {
        if (firstInputRef.current) {
            // Use setTimeout to ensure the DOM is fully rendered
            setTimeout(() => {
                firstInputRef.current?.focus();
            }, 0);
        }
    }, []);

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
            <ToastContainer /> {/* Render toast container */}
            <DialogTitle>{isEdit ? 'Update Metal' : 'Add Metal'}</DialogTitle>
            <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Icon icon={mdiClose} />
                </IconButton>
            <DialogContent >
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
                    {fields.map((field, index) => (
                        <TextField
                            key={field.name}
                            fullWidth
                            label={field.label}
                            name={field.name}
                            placeholder={field.placeHolder}
                            value={formik.values[field.name]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                            helperText={
                                formik.touched[field.name] && formik.errors[field.name]
                                    ? (formik.errors[field.name] as string)
                                    : ''
                            }
                            sx={{ mb: 3 }}
                            inputRef={index === 0 ? firstInputRef : null} // Set ref for the first field
                            autoFocus={index === 0} // Auto-focus on the first field
                            autoComplete="off" 
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}    style={{background:"#F5F5F5",color:"black"}}>
                Clear
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    style={{background:"black"}}
                    disabled={isLoading || !formik.isValid}
                    onClick={() => formik.handleSubmit()}
                >
                    {isLoading ? <CircularProgress size={24} /> : 
                //    <> <img src={SaveSvg} alt="saveIcon" className='me-2'  />
                   "Save"
                    // </> 
                    }
                </Button>
               
            </DialogActions>
        </Dialog>
    );
};