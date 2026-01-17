import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Webcam from "react-webcam";
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
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, FormikProvider, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { Camera, Eye, EyeOff } from "lucide-react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEmployee } from "./employeeHooks";
import { useLocationMaster } from "../../../hooks/commonhooks/locationMaster";
import { useBranch } from "../../settings/branch/branchHooks";
import { useGender } from "../../../hooks/commonhooks/genderHook";
import { useUserRole } from "../userRole/userRolehooks";
import { useDepartment } from "../department/departmenthooks";

// Configure dayjs
dayjs.locale("en");

interface FileTypeOptions {
  images?: string[];
  pdfs?: boolean;
}

interface FieldType {
  name: string;
  type?: string;
  placeHolder?: string;
  min?: number;
  max?: number;
}

export default function CreateEmployee() {
  const { id } = useParams<{ id?: string }>();
  // const userInfo = useSelector((state: any) => state.userInfo);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {
    employeeData,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    loading,
  } = useEmployee();

  const { fetchAllStates, states, fetchCities, cities } = useLocationMaster();
  const { branches, fetchBranches } = useBranch();
  const { fetchGender, genders } = useGender();
  const { fetchUserRoles, roles } = useUserRole();
  const { departments, fetchDepartments } = useDepartment();

  // const [branchId, setBranchId] = useState("");
  const [showeb, setWebShow] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [stateId, setStateId] = useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  // useEffect(() => {
  //   setIsAdmin(userInfo.isAdmin);
  //   setBranchId(userInfo.branchId);
  // }, [userInfo]);

  // useEffect(() => {
  //   if (!isAdmin) {
  //     formik.setFieldValue("branchId", branchId);
  //   }
  // }, [isAdmin]);

  useEffect(() => {
    fetchAllStates();
    fetchBranches();
    fetchGender();
    fetchUserRoles();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchEmployeeById(id);
    }
  }, [id]);

  useEffect(() => {
    if (stateId) {
      fetchCities(stateId);
    }
  }, [stateId]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showeb) return;

    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }

    profileInputRef.current?.click();
  };

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (resumeRef.current) {
      resumeRef.current.value = "";
    }

    resumeRef.current?.click();
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    allowedTypes: FileTypeOptions = {
      images: ["image/jpeg", "image/png", "image/svg+xml"],
      pdfs: true,
    }
  ) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      if (profileInputRef.current) {
        profileInputRef.current.value = "";
      }

      if (resumeRef.current) {
        resumeRef.current.value = "";
      }
      return;
    }

    const fileType = file.type;
    const fileName = file.name;
    const isSvgFile = fileName.toLowerCase().endsWith(".svg");
    const fileSizeInKB = file.size / 1024;

    let isValid = false;

    if (
      allowedTypes.images?.includes(fileType) ||
      (isSvgFile && allowedTypes.images?.includes("image/svg+xml"))
    ) {
      isValid = true;
    }

    if (allowedTypes.pdfs && fileType === "application/pdf") {
      isValid = true;
    }

    if (!isValid) {
      const allowedTypesList = [
        ...(allowedTypes.images || []),
        ...(allowedTypes.pdfs ? ["application/pdf"] : []),
      ];

      const readableTypes = allowedTypesList.map((type) => {
        if (type === "application/pdf") return "PDF";
        if (type === "image/jpeg") return "JPEG";
        if (type === "image/png") return "PNG";
        if (type === "image/svg+xml") return "SVG";
        return type;
      });

      const errorMessage = `Invalid file type. Allowed types: ${readableTypes.join(", ")}`;
      toast.error(errorMessage);

      formik.setFieldError(fieldName, errorMessage);
      return;
    }

    if (
      (fieldName === "profileImg" || fieldName === "resume") &&
      fileSizeInKB > 500
    ) {
      const errorMessage = `File size should be less than 500kB.`;
      toast.error(errorMessage);
      formik.setFieldError(fieldName, errorMessage);
      return;
    }
    if (file) {
      if (fieldName === "profileImg") {
        setProfilePreview(URL.createObjectURL(file));
      }
      formik.setFieldValue(fieldName, file);
    }
    formik.setFieldError(fieldName, "");
    formik.setFieldValue(fieldName, file);
  };

  const fields: ValidationField[] = [
    {
      name: "branchId",
      label: "Branch",
      required: true,
      type: "dropdown",
      placeHolder: "Select Branch",
    },
    {
      name: "username",
      label: "Name",
      placeHolder: "Enter Name",
      required: true,
      min: 1,
      max: 50,
      maxLength: 200,
    },
    {
      name: "mobile",
      label: "Mobile",
      required: true,
      minLength: 10,
      maxLength: 10,
      type: "number",
      placeHolder: "Enter Mobile",
    },
    {
      name: "altMobile",
      label: "Alternative Mobile Number",
      type: "number",
      required: false,
      minLength: 10,
      maxLength: 10,
      placeHolder: "Enter Alternative Mobile Number",
    },
    {
      name: "address",
      label: "Address",
      required: true,
      min: 3,
      max: 50,
      placeHolder: "Enter Address",
    },
    {
      name: "pincode",
      label: "Pincode",
      required: true,
      type: "number",
      minLength: 6,
      maxLength: 6,
      placeHolder: "Enter Pincode",
    },
    {
      name: "stateId",
      label: "State",
      required: true,
      type: "dropdown",
      placeHolder: "Select State",
    },
    {
      name: "cityId",
      label: "City",
      required: true,
      type: "dropdown",
      placeHolder: "Select City",
    },
    {
      name: "genderId",
      label: "Gender",
      required: true,
      type: "dropdown",
      placeHolder: "Select Gender",
    },
    {
      name: "date_of_birth",
      label: "Date of Birth ",
      required: true,
      type: "date",
      placeHolder: "Date of Birth",
    },
    {
      name: "date_of_join",
      label: "Date of Joining ",
      required: true,
      type: "date",
      placeHolder: "Date of Joining",
    },
    {
      name: "aadhar_number",
      label: "Aadhar Number",
      required: true,
      minLength: 12,
      maxLength: 12,
      type: "number",
      placeHolder: "Aadhar Number",
    },
    {
      name: "userRoleId",
      label: "User Role ",
      required: true,
      type: "dropdown",
      placeHolder: "Select User Role",
    },
    {
      name: "departmentId",
      label: "Department",
      required: true,
      type: "dropdown",
      placeHolder: "Select Department",
    },

    { name: "resume", label: "Upload Resume", required: true, type: "file" },
    {
      name: "password",
      label: "Password",
      placeHolder: "Enter Password",
      type: "password",
      required: isEdit ? false : true,
      min: 6,
      max: 50,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "confirmPassword",
      placeHolder: "Enter Confirm Password",
      required: isEdit ? false : true,
      min: 1,
      max: 50,
    },
    {
      name: "profileImg",
      label: "Upload Profile Image",
      required: true,
      type: "file",
    },
  ];
  // 3. When employee data loads, set state and fetch cities
  useEffect(() => {
    if (isEdit && employeeData?.stateId?._id) {
      const stateIdFromData = employeeData.stateId._id;
      setStateId(stateIdFromData);
      fetchCities(stateIdFromData);
    }
  }, [employeeData, isEdit]);

  useEffect(() => {
    if (stateId && !isEdit) {
      fetchCities(stateId);
      formik.setFieldValue("cityId", ""); // Clear city in add mode
    }
  }, [stateId]);

  useEffect(() => {
    if (isEdit && employeeData?.cityId?._id && cities.length > 0) {
      const cityExists = cities.some(
        (city) => city._id === employeeData.cityId._id
      );
      if (cityExists) {
        formik.setFieldValue("cityId", employeeData.cityId._id);
      }
    }
  }, [cities, employeeData, isEdit]);

  // useEffect(() => {
  //   if (!isAdmin) {
  //     formik.setFieldValue("branchId", branchId);
  //   }
  // }, [!isAdmin]);

  const getInitialValues = () => {
    const dateFields = new Set(["date_of_birth", "date_of_join"]);
    const dropdownFields = new Set([
      "cityId",
      "stateId",
      "branchId",
      "genderId",
      "userRoleId",
      "departmentId",
      "countryId",
    ]);

    const initialValues: Record<string, any> = {};

    fields.forEach(({ name }) => {
      // Default empty value
      let value: any = "";

      // Handle dropdown fields with nested objects
      if (dropdownFields.has(name) && employeeData?.[name]) {
        value = employeeData[name]._id || "";
      }
      // Handle regular fields (non-dropdown)
      else if (employeeData?.[name] !== undefined) {
        value = employeeData[name];
      }

      // Handle date fields
      if (dateFields.has(name) && value) {
        const parsedDate = dayjs(value);
        value = parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
      }

      // Handle file fields
      if (name === "profileImg" && employeeData?.img) {
        value = employeeData.img.split("/").pop() || null;
      }

      if (name === "resume" && employeeData?.doc) {
        value = employeeData.doc.split("/").pop() || null;
      }

      initialValues[name] = value;
    });

    return initialValues;
  };
  const handleCapture = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const fileName = `webcam-capture-${new Date().getTime()}.jpg`;

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], fileName, {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(file);
        setProfilePreview(previewUrl);

        formik.setFieldValue("profileImg", file);
        formik.setFieldTouched("profileImg", true, false);
      });

    setWebShow(false);
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("values-", values);
      const formData = new FormData();
      if (values.profileImg) {
        formData.append("img", values.profileImg);
      }
      if (values.resume) {
        formData.append("doc", values.resume);
      }
      const submitValues: any = { ...values };
      if (isEdit && !submitValues.password) {
        delete submitValues.password;
        delete submitValues.confirmPassword;
      }

      formData.append("data", JSON.stringify(submitValues));

      if (id) {
        await updateEmployee(id, formData);
      } else {
        createEmployee(formData);
      }
    },
    enableReinitialize: true,
  });

  const handleNumberInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement> | any,
    field: FieldType
  ) => {
    if (field.type === "number" && ["+", "-", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const stateOptions = states.map((s: any) => ({
    label: s.state_name,
    value: s._id,
  }));
  const cityOptions = cities.map((c: any) => ({
    label: c.city_name,
    value: c._id,
  }));
  const branchOptions = branches.map((c: any) => ({
    label: c.branchName,
    value: c._id,
  }));
  const genderOptions = genders.map((c: any) => ({
    label: c.genderName,
    value: c._id,
  }));
  const roleOptions = roles.map((c: any) => ({
    label: c.roleName,
    value: c._id,
  }));
  const departmentOptions = departments.map((c: any) => ({
    label: c.departmentName,
    value: c._id,
  }));

  return (
    <Page title={isEdit ? "Edit Employee" : "Add Employee"}>
      <ToastContainer />
      <Box px={4} alignItems={"center"}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                {
                  label: isEdit ? "Edit Employee" : "Create Employee",
                  active: true,
                },
              ]}
            />
          </Stack>
        </Stack>

        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                    {isEdit ? "Edit Employee" : "Add Employee"}
                  </Typography>

                  <Box
                    // component="form"
                    // onSubmit={formik.handleSubmit}
                    sx={{ mt: 2 }}
                  >
                    <Grid container spacing={2}>
                      {fields.map((field, index) => {
                        if (field.type == "date") {
                          return (
                            <Grid item xs={12} md={6}>
                              <InputLabel
                                htmlFor={field.name}
                                className="mb-2 flex items-center gap-1"
                                style={{ color: "#09090F" }}
                              >
                                {field.label}
                                {field.required && (
                                  <span className="text-[#F04438] text-lg">
                                    *
                                  </span>
                                )}
                              </InputLabel>

                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={
                                    formik.values[field.name]
                                      ? dayjs(formik.values[field.name])
                                      : null
                                  }
                                  onChange={(value) =>
                                    formik.setFieldValue(
                                      field.name,
                                      value ? value.format("YYYY-MM-DD") : ""
                                    )
                                  }
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      error:
                                        formik.touched[field.name] &&
                                        Boolean(formik.errors[field.name]),
                                      helperText:
                                        formik.touched[field.name] &&
                                        formik.errors[field.name]
                                          ? (formik.errors[
                                              field.name
                                            ] as string)
                                          : "",
                                      onBlur: () =>
                                        formik.setFieldTouched(
                                          field.name,
                                          true
                                        ),
                                    },
                                  }}
                                  disableFuture
                                />
                              </LocalizationProvider>
                            </Grid>
                          );
                        }
                        if (field.type === "dropdown") {
                          const optionsData: any =
                            field.name === "branchId"
                              ? branchOptions
                              : field.name === "stateId"
                                ? stateOptions
                                : field.name === "userRoleId"
                                  ? roleOptions
                                  : field.name === "departmentId"
                                    ? departmentOptions
                                    : field.name === "cityId"
                                      ? cityOptions
                                      : field.name === "genderId"
                                        ? genderOptions
                                        : [];

                          return (
                            <Grid item xs={12} md={6} key={field.name}>
                              <InputLabel
                                htmlFor="my-input"
                                className="mb-2 flex items-center gap-1"
                                style={{ color: "#09090F" }}
                              >
                                {field.label}
                                {field.required && (
                                  <span className="text-[#F04438] text-lg">
                                    *
                                  </span>
                                )}
                              </InputLabel>

                              <Autocomplete
                                size="medium"
                                key={field.name}
                                options={optionsData}
                                value={
                                  optionsData.find(
                                    (option: any) =>
                                      option.value === formik.values[field.name]
                                  )
                                    ? {
                                        label:
                                          optionsData.find(
                                            (option: any) =>
                                              option.value ===
                                              formik.values[field.name]
                                          )?.label || "",
                                        value: formik.values[field.name],
                                      }
                                    : null
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder={field.placeHolder}
                                    error={Boolean(
                                      formik.touched[field.name] &&
                                        formik.errors[field.name]
                                    )}
                                    helperText={
                                      formik.touched[field.name] &&
                                      formik.errors[field.name]
                                        ? (formik.errors[field.name] as string)
                                        : ""
                                    }
                                  />
                                )}
                                onChange={(_, value: any) => {
                                  formik.setFieldValue(
                                    field.name,
                                    value?.value || ""
                                  );
                                  if (field.name === "stateId") {
                                    setStateId(value?.value || "");
                                    formik.setFieldValue("cityId", "");
                                  }
                                }}
                                // sx={{

                                //   borderRadius: 1,
                                //   ".MuiOutlinedInput-root": {
                                //     "& fieldset": {
                                //       borderColor: "#ccc",
                                //     },
                                //     "&:hover fieldset": {
                                //       borderColor: "#999",
                                //     },
                                //     "&.Mui-focused fieldset": {
                                //       borderColor: "#999",
                                //     },
                                //   },
                                // }}
                                getOptionLabel={(option) => option.label || ""}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value.value
                                }
                              />
                            </Grid>
                          );
                        }

                        return (
                          <Grid item xs={12} md={6} key={field.name}>
                            <InputLabel
                              htmlFor={field.name}
                              className="mb-2 flex items-center gap-1"
                              style={{ color: "#09090F" }}
                            >
                              {field.label}
                              {field.required && (
                                <span className="text-[#F04438] text-lg">
                                  *
                                </span>
                              )}
                              {(field.label === "Upload Profile Image" ||
                                field.label === "Upload Resume") && (
                                <span className="text-sm text-gray-500 ml-2">
                                  (File size must be at least 500KB)
                                </span>
                              )}
                            </InputLabel>

                            {["profileImg", "resume"].includes(field.name) ? (
                              field.name === "profileImg" ? (
                                <Box>
                                  <Box
                                    display="flex"
                                    alignItems="flex-start"
                                    gap={1}
                                    mb={
                                      formik.touched.profileImg &&
                                      formik.errors.profileImg
                                        ? 0
                                        : 2
                                    }
                                  >
                                    {/* TextField takes remaining space */}
                                    <Box flex={1}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="profileImg"
                                        value={
                                          formik.values.profileImg?.name ||
                                          (formik.values
                                            .profileImg as string) ||
                                          ""
                                        }
                                        placeholder="Choose file"
                                        InputProps={{
                                          readOnly: true,
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <Button
                                                variant="contained"
                                                sx={{
                                                  backgroundColor: "#F5F5F5",
                                                  color: "#737791",
                                                  padding: "10px 10px",
                                                  font: "medium",
                                                  "&:hover": {
                                                    backgroundColor: "#e0e0e0",
                                                  },
                                                }}
                                                size="small"
                                                onClick={handleButtonClick}
                                              >
                                                Choose File
                                              </Button>
                                            </InputAdornment>
                                          ),
                                        }}
                                        error={Boolean(
                                          formik.touched.profileImg &&
                                            formik.errors.profileImg
                                        )}
                                        onBlur={formik.handleBlur}
                                        onClick={handleButtonClick}
                                        helperText={
                                          formik.touched.profileImg &&
                                          formik.errors.profileImg
                                            ? String(formik.errors.profileImg)
                                            : ""
                                        }
                                      />
                                    </Box>
                                    {/* Camera button with fixed size */}
                                    <Button
                                      variant="contained"
                                      className="flex items-center"
                                      sx={{
                                        backgroundColor: "black",
                                        color: "white",
                                        padding: "10px 0px",
                                        height: "56px",
                                        minWidth: "56px",
                                        "&:hover": {
                                          backgroundColor: "black",
                                        },
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setWebShow(true);
                                      }}
                                    >
                                      <Camera size={32} />
                                    </Button>
                                  </Box>
                                  {field.name === "profileImg" &&
                                    profilePreview && (
                                      <Box mt={2}>
                                        <img
                                          src={profilePreview}
                                          alt="Profile Preview"
                                          style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #ccc",
                                          }}
                                        />
                                      </Box>
                                    )}

                                  {/* Webcam modal and file input remain the same */}
                                  {showeb && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                      <div className="bg-white p-4 rounded-lg">
                                        <Webcam
                                          ref={webcamRef}
                                          screenshotFormat="image/jpeg"
                                          className="rounded-lg"
                                        />
                                        <div className="mt-4 flex justify-center gap-4">
                                          <Button
                                            type="button"
                                            variant="contained"
                                            sx={{
                                              backgroundColor: "#61A375",
                                              color: "white",
                                              padding: "10px 10px",
                                              font: "medium",
                                              "&:hover": {
                                                backgroundColor: "#61A375",
                                              },
                                            }}
                                            size="small"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleCapture();
                                            }}
                                          >
                                            Capture
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="contained"
                                            sx={{
                                              backgroundColor: "#F5F5F5",
                                              color: "#737791",
                                              padding: "10px 10px",
                                              font: "medium",
                                              "&:hover": {
                                                backgroundColor: "#e0e0e0",
                                              },
                                            }}
                                            size="small"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setWebShow(false);
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <input
                                    type="file"
                                    id="profileImg"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    ref={profileInputRef}
                                    onChange={(e) =>
                                      handleFileChange(e, "profileImg", {
                                        images: [
                                          "image/jpeg",
                                          "image/png",
                                          "image/svg+xml",
                                        ],
                                      })
                                    }
                                  />
                                </Box>
                              ) : (
                                <Box mb={2} onClick={handleResumeClick}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="resume"
                                    value={
                                      formik.values.resume?.name ||
                                      (formik.values.resume as string) ||
                                      ""
                                    }
                                    placeholder="Choose file"
                                    InputProps={{
                                      readOnly: true,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Button
                                            variant="contained"
                                            component="span"
                                            sx={{
                                              backgroundColor: "#F5F5F5",
                                              color: "#737791",
                                              padding: "10px 10px",
                                              fontWeight: 500,
                                              textTransform: "none",
                                              "&:hover": {
                                                backgroundColor: "#e0e0e0",
                                              },
                                            }}
                                            size="small"
                                            onClick={handleResumeClick}
                                          >
                                            Browse
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }}
                                    error={Boolean(
                                      formik.touched.resume &&
                                        formik.errors.resume
                                    )}
                                    helperText={
                                      formik.touched.resume &&
                                      formik.errors.resume
                                        ? String(formik.errors.resume)
                                        : ""
                                    }
                                    onBlur={formik.handleBlur}
                                  />

                                  <input
                                    type="file"
                                    id="resume"
                                    accept="application/pdf"
                                    style={{ display: "none" }}
                                    ref={resumeRef}
                                    onChange={(e) =>
                                      handleFileChange(e, "resume", {
                                        pdfs: true,
                                      })
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Box>
                              )
                            ) : field.type === "password" ||
                              field.type === "confirmPassword" ? (
                              <>
                                <TextField
                                  fullWidth
                                  {...formik.getFieldProps(field.name)}
                                  placeholder={field.placeHolder}
                                  autoComplete="new-password"
                                  type={
                                    field.name === "password"
                                      ? showPassword
                                        ? "text"
                                        : "password"
                                      : showConfirmPassword
                                        ? "text"
                                        : "password"
                                  }
                                  error={Boolean(
                                    formik.touched[field.name] &&
                                      formik.errors[field.name]
                                  )}
                                  helperText={
                                    formik.touched[field.name] &&
                                    formik.errors[field.name]
                                      ? (formik.errors[field.name] as string)
                                      : ""
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={() =>
                                            field.name === "password"
                                              ? setShowPassword((prev) => !prev)
                                              : setShowConfirmPassword(
                                                  (prev) => !prev
                                                )
                                          }
                                          edge="end"
                                        >
                                          {field.name === "password" ? (
                                            showPassword ? (
                                              <Eye />
                                            ) : (
                                              <EyeOff />
                                            )
                                          ) : showConfirmPassword ? (
                                            <Eye />
                                          ) : (
                                            <EyeOff />
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </>
                            ) : (
                              <TextField
                                size="medium"
                                key={field.name}
                                fullWidth
                                name={field.name}
                                type={field.type ?? "text"}
                                placeholder={field.placeHolder}
                                value={formik.values[field.name] ?? ""}
                                // onChange={formik.handleChange}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (field.name === "mobile") {
                                    const digitsOnly = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    formik.setFieldValue(
                                      field.name,
                                      digitsOnly
                                    );
                                  } else {
                                    formik.handleChange;
                                    formik.setFieldValue(
                                      field.name,
                                      e.target.value
                                    );
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                error={Boolean(
                                  formik.touched[field.name] &&
                                    formik.errors[field.name]
                                )}
                                helperText={
                                  formik.touched[field.name] &&
                                  formik.errors[field.name]
                                    ? (formik.errors[field.name] as string)
                                    : ""
                                }
                                autoFocus={index === 0}
                                autoComplete="off"
                                onWheel={handleWheel}
                                onKeyDown={(e) =>
                                  handleNumberInputKeyDown(e, field)
                                }
                                inputProps={{
                                  ...(field.min !== undefined && {
                                    min: field.min,
                                  }),
                                  ...(field.max !== undefined && {
                                    max: field.max,
                                  }),
                                  ...(field.type !== "number" &&
                                    field.min !== undefined && {
                                      minLength: field.min,
                                    }),
                                  ...(field.type !== "number" &&
                                    field.max !== undefined && {
                                      maxLength: field.max,
                                    }),
                                }}
                              />
                            )}
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>

                  <Grid
                    item
                    sx={{ mt: 3, display: "flex", justifyContent: "end" }}
                  >
                    <Button
                      sx={{
                        backgroundColor: "#F5F5F5",
                        color: "#000",
                        textTransform: "none",
                        px: 3,
                      }}
                      type="button"
                      // variant="outlined"
                      onClick={() => formik.resetForm()}
                      className="border-2 border-gray-800 text-[#344054] font-medium"
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "black",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#333",
                        },
                      }}
                      style={{ background: "black" }}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : isEdit ? (
                        "Update"
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Box>
    </Page>
  );
}
