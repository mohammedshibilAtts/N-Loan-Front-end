import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  Stack,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, FormikProvider, useFormik } from "formik";

import Page from "../../../components/Page";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";

import { useBranch } from "../branch/branchHooks";
import { useLocker } from "./lockerHooks";
import { useLocationMaster } from "../../../hooks/commonhooks/locationMaster";

/* ---------- helper ---------- */
const getSelectedOption = (
  options: { label: string; value: string }[],
  value: string
) => options.find((opt) => opt.value === value) || null;

export default function LockerForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  /* ---------- hooks ---------- */
  const { lockerData, loading, fetchLockerById, createLocker, updateLocker } =
    useLocker();

  const { branches, fetchBranches } = useBranch();

  const {
    countries,
    states,
    cities,
    fetchCountries,
    fetchStates,
    fetchCities,
    resetCities,
  } = useLocationMaster();

  /* ---------- initial fetch ---------- */
  useEffect(() => {
    fetchBranches();
    fetchCountries();
    if (id) fetchLockerById(id);
  }, []);

  /* ---------- form fields ---------- */
  const fields: ValidationField[] = [
    { name: "lockerName", label: "Locker Name", required: true },
    { name: "licenseNo", label: "License Number", required: true },
    { name: "mobile", label: "Mobile", required: true, type: "number" },
    { name: "branchId", label: "Branch", required: true, type: "dropdown" },
    { name: "address", label: "Address", required: true },
    { name: "countryId", label: "Country", required: true, type: "dropdown" },
    { name: "stateId", label: "State", required: true, type: "dropdown" },
    { name: "cityId", label: "City", required: true, type: "dropdown" },
    { name: "pincode", label: "Pincode", required: true, type: "number" },
    { name: "thirdParty", label: "Third Party" },
  ];

  /* ---------- formik ---------- */
  const formik = useFormik({
    initialValues: {
      lockerName: lockerData?.lockerName || "",
      licenseNo: lockerData?.licenseNo || "",
      mobile: lockerData?.mobile || "",
      branchId: lockerData?.branchId || "",
      address: lockerData?.address || "",
      countryId: lockerData?.countryId || "",
      stateId: lockerData?.stateId || "",
      cityId: lockerData?.cityId || "",
      pincode: lockerData?.pincode || "",
      thirdParty: lockerData?.thirdParty ?? false,
    },
    validationSchema: useValidation(fields),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = { ...values, pincode: String(values.pincode) };

      const success = isEdit
        ? await updateLocker(id!, payload)
        : await createLocker(payload);

      if (success) navigate("/locker/lockers");
    },
  });

  /* ---------- cascade dropdowns (SAFE FOR EDIT) ---------- */
  useEffect(() => {
    if (!formik.values.countryId) return;

    fetchStates(formik.values.countryId);

    if (!isEdit) {
      formik.setFieldValue("stateId", "");
      resetCities();
    }
  }, [formik.values.countryId]);

  useEffect(() => {
    if (!formik.values.stateId) return;

    fetchCities(formik.values.stateId);

    if (!isEdit) {
      formik.setFieldValue("cityId", "");
    }
  }, [formik.values.stateId]);

  /* ---------- options ---------- */
  const branchOptions = branches.map((b: any) => ({
    label: b.branchName,
    value: b._id,
  }));

  const countryOptions = countries.map((c: any) => ({
    label: c.country_name,
    value: c._id,
  }));

  const stateOptions = states.map((s: any) => ({
    label: s.state_name,
    value: s._id,
  }));

  const cityOptions = cities.map((c: any) => ({
    label: c.city_name,
    value: c._id,
  }));

  /* ---------- UI ---------- */
  return (
    <Page title={isEdit ? "Edit Locker" : "Add Locker"}>
      <Box px={6}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Breadcrumb
            items={[
              { label: "Locker" },
              { label: isEdit ? "Edit Locker" : "Add Locker", active: true },
            ]}
          />
        </Stack>

        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h4" mb={2}>
                    {isEdit ? "Edit Locker" : "Add Locker"}
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Locker Name */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>Locker Name *</InputLabel>
                      <TextField
                        fullWidth
                        {...formik.getFieldProps("lockerName")}
                        error={Boolean(formik.errors.lockerName)}
                        helperText={formik.errors.lockerName}
                      />
                    </Grid>

                    {/* License */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>License Number *</InputLabel>
                      <TextField
                        fullWidth
                        {...formik.getFieldProps("licenseNo")}
                        error={Boolean(formik.errors.licenseNo)}
                        helperText={formik.errors.licenseNo}
                      />
                    </Grid>

                    {/* Mobile */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>Mobile *</InputLabel>
                      <TextField
                        fullWidth
                        type="number"
                        {...formik.getFieldProps("mobile")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              +91
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(formik.errors.mobile)}
                        helperText={formik.errors.mobile}
                      />
                    </Grid>

                    {/* Branch */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>Branch *</InputLabel>
                      <Autocomplete
                        options={branchOptions}
                        value={getSelectedOption(
                          branchOptions,
                          formik.values.branchId
                        )}
                        onChange={(_, v) =>
                          formik.setFieldValue("branchId", v?.value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formik.errors.branchId)}
                            helperText={formik.errors.branchId}
                          />
                        )}
                      />
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>Address *</InputLabel>
                      <TextField
                        fullWidth
                        {...formik.getFieldProps("address")}
                        error={Boolean(formik.errors.address)}
                        helperText={formik.errors.address}
                      />
                    </Grid>

                    {/* Country */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>Country *</InputLabel>
                      <Autocomplete
                        options={countryOptions}
                        value={getSelectedOption(
                          countryOptions,
                          formik.values.countryId
                        )}
                        onChange={(_, v) =>
                          formik.setFieldValue("countryId", v?.value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formik.errors.countryId)}
                            helperText={formik.errors.countryId}
                          />
                        )}
                      />
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>State *</InputLabel>
                      <Autocomplete
                        options={stateOptions}
                        value={getSelectedOption(
                          stateOptions,
                          formik.values.stateId
                        )}
                        onChange={(_, v) =>
                          formik.setFieldValue("stateId", v?.value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formik.errors.stateId)}
                            helperText={formik.errors.stateId}
                          />
                        )}
                      />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>City *</InputLabel>
                      <Autocomplete
                        options={cityOptions}
                        value={getSelectedOption(
                          cityOptions,
                          formik.values.cityId
                        )}
                        onChange={(_, v) =>
                          formik.setFieldValue("cityId", v?.value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formik.errors.cityId)}
                            helperText={formik.errors.cityId}
                          />
                        )}
                      />
                    </Grid>

                    {/* Pincode */}
                    <Grid item xs={12} md={6}>
                      <InputLabel>Pincode *</InputLabel>
                      <TextField
                        fullWidth
                        type="number"
                        {...formik.getFieldProps("pincode")}
                        error={Boolean(formik.errors.pincode)}
                        helperText={formik.errors.pincode}
                      />
                    </Grid>

                    <Box
                      sx={{
                        p: 3,
                        bgcolor: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <InputLabel
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Third Party
                        </InputLabel>

                        <Box
                          onClick={() =>
                            formik.setFieldValue(
                              "thirdParty",
                              !formik.values.thirdParty
                            )
                          }
                          sx={{
                            width: 80,
                            height: 36,
                            bgcolor: "#CFCFCF66",
                            borderRadius: 999,
                            px: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            position: "relative",
                            userSelect: "none",
                          }}
                        >
                          {/* Yes/No Labels */}
                          <Box
                            sx={{
                              fontWeight: 500,
                              color: formik.values.thirdParty
                                ? "black"
                                : "text.secondary",
                              zIndex: 1,
                            }}
                          >
                            {formik.values.thirdParty ? "Yes" : ""}
                          </Box>
                          <Box
                            sx={{
                              fontWeight: 500,
                              color: !formik.values.thirdParty
                                ? "black"
                                : "text.secondary",
                              zIndex: 1,
                            }}
                          >
                            {!formik.values.thirdParty ? "No" : ""}
                          </Box>

                          {/* Dot */}
                          <Box
                            sx={{
                              position: "absolute",
                              left: formik.values.thirdParty
                                ? "calc(100% - 28px - 6px)"
                                : "6px",
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              bgcolor: "#CFCFCF",
                              transition: "left 0.3s",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Submit */}
                  <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
                    <LoadingButton
                      type="submit"
                      loading={loading}
                      sx={{
                        bgcolor: "black",
                        color: "white",
                        "&:hover": { bgcolor: "#333" },
                      }}
                    >
                      {isEdit ? "Update" : "Save"}
                    </LoadingButton>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Box>
    </Page>
  );
}
