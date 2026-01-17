import {
  Grid,
  Button,
  InputLabel,
  TextField,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";

import {
  SUB_MENU_CREATION_RES,
  SUB_MENU_DELETE_RES,
  SUB_MENU_EDIT_RES,
  SUB_MENU_TABLE,
  SUB_MENU_UPDATION_RES,
  MENU_LIST,
} from "../../../store/actionTypes";

import API_ENDPOINTS from "../../../services/endpoints";
import {apiRequest } from "../../../store/actions";

import { DataTable } from "../../../components/datatable/datatableComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { Toast } from "../../../components/toast/toast";

function SubMenuCreation() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [subMenuId, setSubMenuId] = useState<string | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [subMenuToDelete, setSubMenuToDelete] = useState<any>(null);

  /* ---------------- VALIDATION FIELDS ---------------- */

  const fields: ValidationField[] = [
    { name: "menuId", label: "Menu", type: "dropdown", required: true },
    { name: "submenuName", label: "Sub Menu Name", type: "text", required: true },
    { name: "pathurl", label: "Path URL", type: "text", required: true },
    { name: "display_order", label: "Display Order", type: "number", required: true },
  ];

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
    e.preventDefault();
  };

  /* ---------------- REDUX ---------------- */

  const {
    createRes,
    editRes,
    updateRes,
    deleteRes,
    menuListRes,
  } = useSelector((state: any) => ({
    createRes: state[SUB_MENU_CREATION_RES]?.data,
    editRes: state[SUB_MENU_EDIT_RES]?.data,
    updateRes: state[SUB_MENU_UPDATION_RES]?.data,
    deleteRes: state[SUB_MENU_DELETE_RES]?.data,
    menuListRes: state[MENU_LIST]?.data,
  }));

  /* ---------------- SAFE MENU ARRAY ---------------- */

  const menuData: any[] = Array.isArray(menuListRes?.data?.data)
    ? menuListRes.data.data
    : [];

  /* ---------------- FETCH MENU LIST ---------------- */

  useEffect(() => {
    dispatch(
      apiRequest(MENU_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "find",
        params: {
          tableName: "userMenus",
          filter: { active: true },
        },
      })
    );
  }, [dispatch]);

  /* ---------------- FORMIK ---------------- */

  const formik:any = useFormik({
    initialValues: {
      menuId: "",
      menuNo: "",
      submenuName: "",
      pathurl: "",
      display_order: "",
    },
    validationSchema: useValidation(fields),
    onSubmit: (values) => {
      setIsLoading(true);

      const body = {
        procedureName: isEdit ? "update" : "create",
        params: {
          tableName: "subMenu",
          ...(isEdit && { id: subMenuId }),
          data: {
            menuId: values.menuId,
            menuNo: values.menuNo,
            submenuName: values.submenuName,
            pathurl: values.pathurl,
            display_order: Number(values.display_order),
          },
          checkWith: ["submenuName"],
        },
      };

      dispatch(
        apiRequest(
          isEdit ? SUB_MENU_UPDATION_RES : SUB_MENU_CREATION_RES,
          "post",
          API_ENDPOINTS.SP.POST,
          body
        )
      );
    },
  });

  /* ---------------- SET EDIT DATA ---------------- */

  useEffect(() => {
    if (editRes?.success) {
      const data = editRes.data;

      setIsEdit(true);
      setSubMenuId(data._id);

      formik.setValues({
        menuId: data.menuId || "",
        menuNo: data.menuNo || "",
        submenuName: data.submenuName || "",
        pathurl: data.pathurl || "",
        display_order: data.display_order || "",
      });
    }
  }, [editRes]);

  /* ---------------- RESPONSES ---------------- */

  useEffect(() => {
    if (createRes?.success !== undefined) {
      setIsLoading(false);
      createRes.success
        ? (Toast.show({ message: createRes.message, type: "success" }),
          formik.resetForm())
        : Toast.show({ message: createRes.message, type: "error" });
    }
  }, [createRes]);

  useEffect(() => {
    if (updateRes?.success !== undefined) {
      setIsLoading(false);
      updateRes.success
        ? (Toast.show({ message: updateRes.message, type: "success" }),
          clearForm())
        : Toast.show({ message: updateRes.message, type: "error" });
    }
  }, [updateRes]);

  useEffect(() => {
    if (deleteRes?.success) {
      setIsLoading(false);
      Toast.show({ message: "Sub Menu deleted successfully", type: "success" });
    }
  }, [deleteRes]);

  /* ---------------- CLEAR ---------------- */

  const clearForm = () => {
    setIsEdit(false);
    setSubMenuId(null);
    formik.resetForm();
  };

  /* ---------------- ACTIONS ---------------- */

  const handleEdit = (row: any) => {
    dispatch(
      apiRequest(SUB_MENU_EDIT_RES, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findById",
        params: { tableName: "subMenu", id: row._id },
      })
    );
  };

  const handleDelete = (row: any) => {
    setSubMenuToDelete(row);
    setConfirmationDialogOpen(true);
  };

  const confirmDelete = (confirmed: boolean) => {
    setConfirmationDialogOpen(false);
    if (confirmed) {
      setIsLoading(true);
      dispatch(
        apiRequest(SUB_MENU_DELETE_RES, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "delete",
          params: { tableName: "subMenu", id: subMenuToDelete._id },
        })
      );
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <Box px={5}>
        <Breadcrumb
          items={[{ label: "Settings" }, { label: "Sub Menu", active: true }]}
        />
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ mt: 3, p: 5, mx: 5, background: "white", borderRadius: 2 }}
      >
        <Typography variant="h5" mb={3} fontWeight={600}>
          Sub Menu Creation
        </Typography>

        <Grid container spacing={2}>
          {/* MENU DROPDOWN (REQUIRED) */}
          <Grid item xs={12} md={3}>
            <InputLabel
              error={formik.touched.menuId && Boolean(formik.errors.menuId)}
            >
              Menu *
            </InputLabel>

            <FormControl
              fullWidth
              error={formik.touched.menuId && Boolean(formik.errors.menuId)}
            >
              <Select
                name="menuId"
                value={formik.values.menuId}
                onChange={(e) => {
                  const selected: any = menuData.find(
                    (m: any) => m._id === e.target.value
                  );
                  if (selected) {
                    formik.setFieldValue("menuId", selected._id);
                    formik.setFieldValue("menuNo", selected.menuNo);
                  }
                }}
              >
                {menuData.map((menu: any) => (
                  <MenuItem key={menu._id} value={menu._id}>
                    {menu.menuName}
                  </MenuItem>
                ))}
              </Select>

              {formik.touched.menuId && formik.errors.menuId && (
                <FormHelperText>
                  {formik.errors.menuId as string}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* OTHER FIELDS */}
          {fields
            .filter((f) => f.name !== "menuId")
            .map((field) => (
              <Grid item xs={12} md={3} key={field.name}>
                <InputLabel>{field.label} *</InputLabel>
                <TextField
                  fullWidth
                  type={field.type}
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onWheel={handleWheel}
                  error={
                    formik.touched[field.name] &&
                    Boolean(formik.errors[field.name])
                  }
                  helperText={
                    formik.touched[field.name] &&
                    (formik.errors[field.name] as string)
                  }
                />
              </Grid>
            ))}

          <Grid item xs={12} className="flex justify-end gap-3 mt-4">
            <Button type="button" onClick={clearForm}>
              Clear
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 3, p: 5, mx: 5, background: "white", borderRadius: 2 }}>
        <DataTable
          actionType={SUB_MENU_TABLE}
          endpoint={API_ENDPOINTS.SP.POST}
          tableName="subMenu"
          populateFields={["menuId"]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </Box>

      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={confirmDelete}
        title="Delete Sub Menu"
        message="Are you sure you want to delete this sub menu?"
        positiveButtonLabel="Delete"
        negativeButtonLabel="Cancel"
        showNegativeButton
      />
    </>
  );
}

export default SubMenuCreation;
