import {
  Autocomplete,
  Grid,
  Button,
  InputLabel,
  TextField,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Percent } from "lucide-react";

import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";

import { useInterest } from "./interestHook";
import { useMarketRate } from "../../../hooks/commonhooks/marketRateHook";
import SubTable from "../../../components/subTable/subTable";

function InterestCreation() {
  const { interests, loading, createInterest, updateInterest, deleteInterest } =
    useInterest();

  const { marketRates, fetchMarketRates } = useMarketRate();

  const [isEdit, setIsEdit] = useState(false);
  const [interestId, setInterestId] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<any>(null);

  /* -------------------- FORM FIELDS -------------------- */
  const fields: ValidationField[] = [
    {
      name: "interestName",
      label: "Interest Name",
      type: "string",
      required: true,
    },
    {
      name: "marketRate",
      label: "Market Value",
      type: "dropdown",
      required: true,
    },
    {
      name: "princiAllowMin",
      label: "Principal Allowance (Min)",
      type: "number",
      required: true,
    },
    {
      name: "princiAllowMax",
      label: "Principal Allowance (Max)",
      type: "number",
      required: true,
    },
    {
      name: "interestMin",
      label: "Interest Value (Min)",
      type: "number",
      required: true,
    },
    {
      name: "interestMax",
      label: "Interest Value (Max)",
      type: "number",
      required: true,
    },
  ];

  /* -------------------- MARKET RATE -------------------- */
  useEffect(() => {
    fetchMarketRates();
  }, []);

  /* -------------------- FORM -------------------- */
  const formik: any = useFormik({
    initialValues: {
      interestName: "",
      marketRate: "",
      princiAllowMin: "0",
      princiAllowMax: "",
      interestMin: "0",
      interestMax: "",
    },
    validationSchema: useValidation(fields),
    validate: (values: any) => {
      const errors: any = {};
      if (selectedMarket) {
        const min = Number(selectedMarket.princiAllowMin);
        const max = Number(selectedMarket.princiAllowMax);

        if (values.princiAllowMin < min || values.princiAllowMin > max)
          errors.princiAllowMin = `Must be between ${min}-${max}`;

        if (values.princiAllowMax < min || values.princiAllowMax > max)
          errors.princiAllowMax = `Must be between ${min}-${max}`;
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        let res 
        if (isEdit && interestId) {
          res = await updateInterest(interestId, values);
        } else {
          res = await createInterest(values);
        }
        if(res){
          resetForm();
        setIsEdit(false);
        setInterestId(null);
        }
      } catch {}
    },
  });

  /* -------------------- HANDLERS -------------------- */
  const handleEdit = (row: any) => {
    setIsEdit(true);
    setInterestId(row._id);
    setSelectedMarket(row.marketRate);
    formik.setValues({
      interestName: row.interestName,
      marketRate: row.marketRate?._id,
      princiAllowMin: row.princiAllowMin,
      princiAllowMax: row.princiAllowMax,
      interestMin: row.interestMin,
      interestMax: row.interestMax,
    });
  };

  const handleDelete = (row: any) => {
    setDeleteRow(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async (ok: boolean) => {
    setConfirmOpen(false);
    if (ok && deleteRow) {
      await deleteInterest(deleteRow._id);
    }
  };

  const columns = [
    { id: "id", label: "S.NO" },
    { id: "interestName", label: "Interest Name" },
    { id: "marketRate", label: "Market Rate" },
    { id: "principalAllowance", label: "Principal Allowance" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = interests.map((item: any, index: number) => ({
    id: index + 1,
    _id: item._id,
    interestName: item.interestName,
    marketRate: marketRates.find((i: any) => i._id == item?.marketRate)
      ?.marketRateName,
    principalAllowance: `${item.princiAllowMin}% - ${item.princiAllowMax}%`,
    //    active: <StatusToggle row={item} onToggle={handleToggleStatus} />,
    createdAt: item.createdAt,
  }));

  /* -------------------- UI -------------------- */
  return (
    <>
      <Box px={5}>
        <Breadcrumb
          items={[
            { label: "Masters" },
            { label: "Interest Creation", active: true },
          ]}
        />
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ p: 5, mx: 5, mt: 3, bgcolor: "white" }}
      >
        <Typography variant="h5" mb={3}>
          Interest Creation
        </Typography>

        <Grid container spacing={2}>
          {/* Interest Name */}
          <Grid item xs={12} md={6}>
            <InputLabel>Interest Name *</InputLabel>
            <TextField
              fullWidth
              {...formik.getFieldProps("interestName")}
              error={Boolean(formik.errors.interestName)}
              helperText={formik.errors.interestName}
            />
          </Grid>

          {/* Market Rate */}
          <Grid item xs={12} md={6}>
            <InputLabel>Market Value *</InputLabel>
            <Autocomplete
              options={marketRates.map((m) => ({
                label: m?.marketRateName,
                value: m._id,
              }))}
              value={
                marketRates.find((m) => m._id === formik.values.marketRate)
                  ? {
                      label: selectedMarket?.marketRateName,
                      value: formik.values.marketRate,
                    }
                  : null
              }
              onChange={(_, val) => {
                formik.setFieldValue("marketRate", val?.value || "");
                setSelectedMarket(
                  marketRates.find((m) => m._id === val?.value)
                );
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>

          {/* Numeric Fields */}
          {fields
            .filter((f) => !["interestName", "marketRate"].includes(f.name))
            .map((f) => (
              <Grid item xs={12} md={3} key={f.name}>
                <InputLabel>{f.label} *</InputLabel>

                <TextField
                  type="text" // 👈 IMPORTANT
                  fullWidth
                  value={formik.values[f.name]}
                  onChange={(e) => {
                    const value = e.target.value;

                    // allow empty
                    if (value === "") {
                      formik.setFieldValue(f.name, value);
                      return;
                    }

                    // allow numbers with up to 2 decimals
                    if (/^\d*\.?\d{0,1}$/.test(value)) {
                      formik.setFieldValue(f.name, value);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched[f.name] && formik.errors[f.name]
                  )}
                  helperText={
                    formik.touched[f.name] && formik.errors[f.name]
                      ? (formik.errors[f.name] as string)
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Percent size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

          {/* Buttons */}
          <Grid item xs={12} className="flex justify-end gap-3">
            <Button onClick={() => formik.resetForm()} sx={{ color: "black" }}>
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : isEdit ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      <Box sx={{ p: 5, mx: 5, mt: 3, bgcolor: "white" }}>
        <SubTable
          coloums={columns}
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Box>

      <ConfirmationDialog
        open={confirmOpen}
        title="Delete Interest"
        message="Are you sure you want to delete?"
        onClose={confirmDelete}
      />
    </>
  );
}

export default InterestCreation;
