import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete, CircularProgress } from "@mui/material";

// Material UI components
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Card,
  Stack,
} from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";

import { useLocationMaster } from "../../../hooks/commonhooks/locationMaster";
import { useOrganisation } from "./organisationHook";

interface OrganizationData {
  id?: string;
  companyName: string;
  email: string;
  address: string;
  country: string;
  city: string;
  whatsappNumber: string;
  mobileNumber: string;
  website: string;
  pincode: string;
  state: string;
  shortcode: string;
  tollFreeNumber: string;
}

export default function OrganizationSettings() {
  const {
    fetchCountries,
    countries,
    fetchCities,
    fetchStates,
    states,
    cities,
  } = useLocationMaster();
  const { organisationData, create, find, loading } = useOrganisation();

  useEffect(() => {
    fetchCountries();
    find();
  }, []);

  // Validation schema
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    whatsappNumber: Yup.string().required("Whatsapp number is required"),
    mobileNumber: Yup.string().required("Mobile number is required"),
    website: Yup.string().required("Website is required"),
    pincode: Yup.string().required("Pincode is required"),
    state: Yup.string().required("State is required"),
    shortcode: Yup.string().required("Shortcode is required"),
    tollFreeNumber: Yup.string().required("Toll free number is required"),
  });

  const formik = useFormik<OrganizationData>({
    initialValues: {
      companyName: organisationData?.companyName || "",
      email: organisationData?.email || "",
      address: organisationData?.address || "",
      country: organisationData?.country || "",
      city: organisationData?.city || "",
      state: organisationData?.state || "",
      whatsappNumber: organisationData?.whatsappNumber || "",
      mobileNumber: organisationData?.mobileNumber || "",
      website: organisationData?.website || "",
      pincode: organisationData?.pincode || "",
      shortcode: organisationData?.shortcode || "",
      tollFreeNumber: organisationData?.tollFreeNumber || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        create(values);
      } catch (error) {
        console.error("Error saving organization settings:", error);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formik.values.country) {
      fetchStates(formik.values.country);
    }
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.state) {
      fetchCities(formik.values.state);
    }
  }, [formik.values.state]);

  return (
    <Container>
      {/* Breadcrumb */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Breadcrumb
            items={[
              { label: "Settings" },
              { label: "Organisation", active: true },
            ]}
          />
        </Stack>
      </Box>

      <Card sx={{ p: 3, mb: 4 }}>
        {/* Main Content */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Organization
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                {/* Company Name */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Name<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter company name"
                    name="companyName"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.companyName &&
                      Boolean(formik.errors.companyName)
                    }
                    helperText={
                      formik.touched.companyName && formik.errors.companyName
                    }
                    size="small"
                  />
                </Box>

                {/* Email ID */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Email Id<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter email id"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    size="small"
                  />
                </Box>

                {/* Address */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Address<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    size="small"
                  />
                </Box>

                {/* Country */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Country<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option: any) => option.country_name}
                    value={
                      countries.find((c) => c._id === formik.values.country) ||
                      null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select country"
                        error={
                          formik.touched.country &&
                          Boolean(formik.errors.country)
                        }
                        helperText={
                          formik.touched.country && formik.errors.country
                        }
                        size="small"
                      />
                    )}
                    onChange={(_, value) => {
                      formik.setFieldValue("country", value?._id || "");
                    }}
                  />
                </Box>

                {/* City */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    City<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Autocomplete
                    options={cities}
                    getOptionLabel={(option) => option.city_name}
                    value={
                      cities.find((c) => c._id === formik.values.city) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select City"
                        error={
                          formik.touched.city && Boolean(formik.errors.city)
                        }
                        helperText={formik.touched.city && formik.errors.city}
                        size="small"
                      />
                    )}
                    onChange={(_, value) => {
                      formik.setFieldValue("city", value?._id || "");
                    }}
                  />
                </Box>

                {/* Whatsapp Number */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Whatsapp Number<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter whatsapp number"
                    name="whatsappNumber"
                    value={formik.values.whatsappNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.whatsappNumber &&
                      Boolean(formik.errors.whatsappNumber)
                    }
                    helperText={
                      formik.touched.whatsappNumber &&
                      formik.errors.whatsappNumber
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box
                            sx={{
                              pr: 1,
                              borderRight: "1px solid #f2f3f8",
                              display: "flex",
                              alignItems: "center",
                              height: 39,
                            }}
                          >
                            +91
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                {/* Mobile Number */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Mobile Number<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter mobile number"
                    name="mobileNumber"
                    value={formik.values.mobileNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.mobileNumber &&
                      Boolean(formik.errors.mobileNumber)
                    }
                    helperText={
                      formik.touched.mobileNumber && formik.errors.mobileNumber
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box
                            sx={{
                              pr: 1,
                              borderRight: "1px solid #f2f3f8",
                              display: "flex",
                              alignItems: "center",
                              height: 39,
                            }}
                          >
                            +91
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                </Box>

                {/* Website */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Website<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter website name"
                    name="website"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.website && Boolean(formik.errors.website)
                    }
                    helperText={formik.touched.website && formik.errors.website}
                    size="small"
                  />
                </Box>

                {/* Pincode */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Pincode<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter pincode"
                    name="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.pincode && Boolean(formik.errors.pincode)
                    }
                    helperText={formik.touched.pincode && formik.errors.pincode}
                    size="small"
                  />
                </Box>

                {/* State */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    State<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Autocomplete
                    options={states}
                    getOptionLabel={(option) => option.state_name}
                    value={
                      states.find((c) => c._id === formik.values.state) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select State"
                        error={
                          formik.touched.state && Boolean(formik.errors.state)
                        }
                        helperText={formik.touched.state && formik.errors.state}
                        size="small"
                      />
                    )}
                    onChange={(_, value) => {
                      formik.setFieldValue("state", value?._id || "");
                    }}
                  />
                </Box>

                {/* Shortcode */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Shortcode<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter shortcode"
                    name="shortcode"
                    value={formik.values.shortcode}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.shortcode &&
                      Boolean(formik.errors.shortcode)
                    }
                    helperText={
                      formik.touched.shortcode && formik.errors.shortcode
                    }
                    size="small"
                  />
                </Box>

                {/* Toll Free Number */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Toll Free Number<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter toll free number"
                    name="tollFreeNumber"
                    value={formik.values.tollFreeNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.tollFreeNumber &&
                      Boolean(formik.errors.tollFreeNumber)
                    }
                    helperText={
                      formik.touched.tollFreeNumber &&
                      formik.errors.tollFreeNumber
                    }
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => formik.resetForm()}
                style={{ background: "#F6F7F9", color: "#737791" }}
              >
                Clear
              </Button>

              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Card>
    </Container>
  );
}
