import {
  Grid,
  Button,
  InputLabel,
  TextField,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { useDispatch, useSelector } from "react-redux";

import {
  MENU_CREATION_RES,
  MENU_DELETE_RES,
  MENU_Edit_RES,
  MENU_TABLE,
  MENU_UPDATION_RES,
} from "../../../store/actionTypes";
import API_ENDPOINTS from "../../../services/endpoints";
import { apiClear, apiRequest } from "../../../store/actions";
import { DataTable } from "../../../components/datatable/datatableComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { CircularProgress } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { Toast } from "../../../components/toast/toast";

function MenuCreation() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [menuData, setMenuData] = useState(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<any>(null);
  const [confirmationDialogConfig, setConfirmationDialogConfig] = useState({
    title: "",
    message: "",
    positiveButtonLabel: "Delete",
    negativeButtonLabel: "Cancel",
    showNegativeButton: true,
  });

  const fields: ValidationField[] = [
    {
      name: "menuName",
      label: "Menu Name",
      type: "text",
      required: true,
    },
    {
      name: "menuNo",
      label: "Menu No",
      type: "number",
      required: true,
    },
    {
      name: "menuPath",
      label: "Menu Path",
      type: "text",
      required: true,
    },
    {
      name: "menuIcon",
      label: "Icon Name",
      type: "text",
      required: true,
    },
  ];

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
    e.preventDefault();
  };

  const { menuCreation, editResponse, updateResponse, deleteResponse } =
    useSelector((states: any) => ({
      menuCreation: states[MENU_CREATION_RES]?.data,
      updateResponse: states[MENU_UPDATION_RES]?.data,
      editResponse: states[MENU_Edit_RES]?.data,
      deleteResponse: states[MENU_DELETE_RES]?.data,
    }));

  useEffect(() => {
    dispatch(apiClear(MENU_CREATION_RES));
    dispatch(apiClear(MENU_DELETE_RES));
    dispatch(apiClear(MENU_Edit_RES));
    dispatch(apiClear(MENU_TABLE));
    dispatch(apiClear(MENU_UPDATION_RES));
    return () => {
      dispatch(apiClear(MENU_CREATION_RES));
      dispatch(apiClear(MENU_DELETE_RES));
      dispatch(apiClear(MENU_Edit_RES));
      dispatch(apiClear(MENU_TABLE));
      dispatch(apiClear(MENU_UPDATION_RES));
      formik.resetForm();
      setMenuId(null);
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteResponse?.success) {
      Toast.show({ message: "Menu Deleted Successfully", type: "success" });
      // dispatch(refetchTable());
      setIsLoading(false);
    }
  }, [deleteResponse]);

  const getInitialValues = () => {
    return Object.fromEntries(
      fields.map(({ name }) => {
        let fieldValue = (isEdit && menuData?.[name]) || "";
        if (fieldValue === undefined) {
          fieldValue = "";
        }
        return [name, fieldValue];
      })
    );
  };

  // Handle edit action
  const handleEdit = (row: any) => {
    setEdit(true);
    getMenuById(row);
    // setIsFormOpen(true);
  };

  const getMenuById = (data: any) => {
    const body = {
      procedureName: "findById",
      params: {
        tableName: "userMenus",
        id: data._id,
      },
    };
    dispatch(apiRequest(MENU_Edit_RES, "post", API_ENDPOINTS.SP.POST, body));
    // setIsLoading(true);
  };

  useEffect(() => {
    if (editResponse?.success) {
      setMenuData(editResponse.data);
      setIsLoading(false);
      formik.setValues(getInitialValues());
      setMenuId(editResponse.data._id);
    }
  }, [editResponse]);

  useEffect(() => {
    if (updateResponse?.success !== undefined) {
      if (updateResponse.success) {
        Toast.show({ message: updateResponse.message, type: "success" });
        setEdit(false);
        setMenuId(null);
        setIsLoading(false);
        formik.resetForm();
      } else {
        Toast.show({ message: updateResponse.message, type: "error" });
      }
      setIsLoading(false);
    }
  }, [updateResponse]);

  useEffect(() => {
    if (menuCreation?.success !== undefined) {
      if (menuCreation.success) {
        // dispatch(refetchTable());
        setMenuData(null);
        setIsLoading(false);
        formik.resetForm();

        Toast.show({ message: menuCreation.message, type: "success" });
      } else {
        Toast.show({ message: menuCreation.message, type: "error" });
      }
      setIsLoading(false);
    }
  }, [menuCreation]);

  // Handle delete action
  const handleDelete = (row: any) => {
    setMenuToDelete(row); // Set the metal to delete

    // Configure the confirmation dialog
    setConfirmationDialogConfig({
      title: "Delete Menu",
      message:
        "Are you sure you want to delete this Menu? You will not be able to recover this record!",
      positiveButtonLabel: "Delete",
      negativeButtonLabel: "Cancel",
      showNegativeButton: true,
    });

    setConfirmationDialogOpen(true); // Open the confirmation dialog
  };

  // Handle confirmation dialog close
  const handleConfirmationDialogClose = (confirmed: boolean) => {
    setConfirmationDialogOpen(false); // Close the dialog

    if (confirmed) {
      // If the user confirmed, delete the Metal
      deleteMenu(menuToDelete._id);
    }
  };

  // Call the API to delete the Metal
  const deleteMenu = (id: string) => {
    const data = {
      procedureName: "delete",
      params: {
        tableName: "userMenus",
        id: id,
      },
    };
    dispatch(apiRequest(MENU_DELETE_RES, "post", API_ENDPOINTS.SP.POST, data));
    setIsLoading(true);
  };

  // Formik initialization
  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = {
          procedureName: isEdit ? "update" : "create",
          params: {
            tableName: "userMenus",
            ...(isEdit && { id: menuId }),
            data: {
              ...values,
            },
            checkWith: ["menuName"],
          },
        };

        dispatch(
          apiRequest(
            isEdit ? MENU_UPDATION_RES : MENU_CREATION_RES,
            "post",
            API_ENDPOINTS.SP.POST,
            data
          )
        );
      } catch (error) {
        console.error("Error saving:", error);
        toast.error("An error occurred while saving the menu.");
        setIsLoading(false);
      }
    },
    enableReinitialize: true,
  });

  return (
    <>
      <Box px={5}>
        <Stack direction="row" alignItems="center" mb={1} flexGrow={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[{ label: "Settings" }, { label: "Menu", active: true }]}
            />
          </Stack>
        </Stack>
      </Box>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          mt: 3,
          p: 5,
          mx: 5,
          backgroundColor: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Menu Creations
        </Typography>

        <Grid container spacing={2}>
          {/* Min/Max Fields with % Suffix */}
          {fields.map((field) => (
            <Grid item xs={12} md={3} key={field.name}>
              <InputLabel
                htmlFor={field.name}
                className="mb-2 flex items-center gap-1 text-sm font-medium"
              >
                {field.label}
                <span className="text-[#F04438] text-lg">*</span>
              </InputLabel>
              <TextField
                fullWidth
                type={field.type}
                placeholder={field.placeHolder}
                name={field.name}
                value={formik.values[field.name]}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  formik.setFieldValue(field.name, value);
                }}
                onWheel={handleWheel}
                onBlur={formik.handleBlur}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                helperText={
                  formik.touched[field.name] && formik.errors[field.name]
                }
              />
            </Grid>
          ))}

          {/* Buttons */}
          <Grid item xs={12} className="flex justify-end gap-4 mt-4 ">
            <Button
              sx={{
                backgroundColor: "#F5F5F5",
                color: "#000",
                textTransform: "none",
                px: 3,
              }}
              type="button"
              // variant="outlined"
              onClick={() => {
                setMenuData(null);
                formik.resetForm();
              }}
              className="border-2 border-gray-800 text-[#344054] font-medium"
            >
              Clear
            </Button>
            <Button
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
              type="submit"
              // variant="contained"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              className="bg-black text-white font-medium px-6"
            >
              {isLoading ? "" : !isEdit ? "Save" : "Update"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        component="table"
        sx={{
          mt: 3,
          p: 5,
          mx: 5,
          backgroundColor: "white",
          borderRadius: 2,
        }}
      >
        <DataTable
          actionType={MENU_TABLE}
          endpoint={API_ENDPOINTS.SP.POST}
          tableName="userMenus"
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>

      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={handleConfirmationDialogClose}
        title={confirmationDialogConfig.title}
        message={confirmationDialogConfig.message}
        positiveButtonLabel={confirmationDialogConfig.positiveButtonLabel}
        negativeButtonLabel={confirmationDialogConfig.negativeButtonLabel}
        showNegativeButton={confirmationDialogConfig.showNegativeButton}
      />
    </>
  );
}

export default MenuCreation;
