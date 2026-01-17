import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { apiClear, apiRequest } from "../../../store/actions";
import API_ENDPOINTS from "../../../services/endpoints";
import {
  BRANCH_LIST,
  CITY_LIST,
  DEPARTMENT_LIST,
  EMPLOYEE_LIBRARY_RES,
  GENDER_LIST,
  STATE_LIST,
  USER_ROLE_LIST,
  EMPLOYEE_EDIT_RES,
} from "../../../store/actionTypes";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { Camera, Eye, EyeOff } from "lucide-react";
// import { MobilePattern } from "../../../utils/commonFunction";

// Configure dayjs
dayjs.locale("en");
// const dateFormat = "DD/MM/YYYY";

interface DropdownOption {
  label: string;
  value: string;
  _id?: string;
  [key: string]: any;
}

interface EmployeeData {
  [key: string]: any;
  _id?: string;
  img?: string;
  doc?: string;
  cityId?: string;
}

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
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userInfo);
  const [isAdmin, setIsAdmin] = useState();
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // const BASEURL = import.meta.env.VITE_BASE_URL || process.env.VITE_BASE_URL;

  // const [savedImages, setSavedImages] = useState<{id: string, url: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [branchId,setBranchId]=useState('')
  const [showeb, setWebShow] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [stateId, setStateId] = useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const navigate = useNavigate();

    useEffect(() => {
      setIsAdmin(userInfo.isAdmin);
      setBranchId(userInfo.branchId);
    }, [userInfo]);

      useEffect(() => {
        if (!isAdmin) {
          formik.setFieldValue("branchId", branchId);
        }
      }, [isAdmin]);



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
    e.preventDefault();
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

  const [branchData, setBranchData] = useState<DropdownOption[]>([]);
  const [stateData, setStateData] = useState<DropdownOption[]>([]);
  const [userRoleData, setUserRoleData] = useState<DropdownOption[]>([]);
  const [departmentData, setDepartmentData] = useState<DropdownOption[]>([]);
  const [cityData, setCityData] = useState<DropdownOption[]>([]);
  const [genderData, setGenderData] = useState<DropdownOption[]>([]);

  const { editResponse } = useSelector((states: any) => ({
    editResponse: states[EMPLOYEE_EDIT_RES]?.data,
    // designLibImagesResult: states[DESIGN_LIBRARY__IMAGES_GET_RES]?.data,
    designLibResponse: states[EMPLOYEE_LIBRARY_RES]?.data,
  }));

  useEffect(() => {
    dispatch(apiClear(EMPLOYEE_EDIT_RES));
    // dispatch(apiClear(DESIGN_LIBRARY__IMAGES_GET_RES));
    dispatch(apiClear(EMPLOYEE_LIBRARY_RES));

    return () => {
      dispatch(apiClear(EMPLOYEE_EDIT_RES));
      // dispatch(apiClear(DESIGN_LIBRARY__IMAGES_GET_RES));
      dispatch(apiClear(EMPLOYEE_LIBRARY_RES));

      formik.resetForm();
      setIsEdit(false);
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const body = {
        procedureName: "findById",
        params: {
          tableName: "employee",
          id: id,
        },
      };
      dispatch(
        apiRequest(EMPLOYEE_EDIT_RES, "post", API_ENDPOINTS.SP.POST, body)
      );
    }
  }, [id]);

  useEffect(() => {
    if (editResponse?.success) {
      setEmployeeData(editResponse.data);
      formik.setValues(getInitialValues());
      setStateId(editResponse?.data?.stateId);
      setIsEdit(true);
    }
  }, [editResponse]);

  const fields: ValidationField[] = [
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
      min: 10,
      maxLength: 10,
      max: 10,
      type: "text",
      placeHolder: "Enter Mobile",
    },
    {
      name: "altMobile",
      label: "Alternative Mobile Number",
      type: "number",
      required: false,
      minLength: 10,
      maxLength: 10,
      min: 10,
      max: 10,
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
      min: 0,
      max: 10,
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
      min: 0,
      max: 10,
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
      min: 1,
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

  if (isAdmin) {
    fields.unshift({
      name: "branchId",
      label: "Branch",
      required: true,
      type: "dropdown",
      placeHolder: "Select Branch",
    });
  }

  useEffect(() => {
    if (!isAdmin) {
      formik.setFieldValue("branchId", branchId);
    }
  }, [!isAdmin]);

  const {
    branchList,
    stateList,
    userRoleList,
    cityList,
    departmentList,
    genderList,
    employeeResponse,
  } = useSelector((states: any) => ({
    branchList: states[BRANCH_LIST]?.data,
    stateList: states[STATE_LIST]?.data,
    userRoleList: states[USER_ROLE_LIST]?.data,
    departmentList: states[DEPARTMENT_LIST]?.data,
    cityList: states[CITY_LIST]?.data,
    genderList: states[GENDER_LIST]?.data,
    employeeResponse: states[EMPLOYEE_LIBRARY_RES]?.data,
  }));

  useEffect(() => {
    if (branchList?.success) {
      setBranchData(
        branchList.data.data.map((option: any) => ({
          label: option.branchName,
          value: option._id,
        }))
      );
    }
    if (stateList?.success) {
      setStateData(
        stateList.data.data.map((option: any) => ({
          label: option.state_name,
          value: option._id,
        }))
      );
    }
    if (userRoleList?.success) {
      setUserRoleData(
        userRoleList.data.data.map((option: any) => ({
          label: option.role_name,
          value: option._id,
        }))
      );
    }
    if (departmentList?.success) {
      setDepartmentData(
        departmentList.data.data.map((option: any) => ({
          label: option.departmentName,
          value: option._id,
        }))
      );
    }
    if (genderList?.success) {
      setGenderData(
        genderList.data.data.map((option: any) => ({
          label: option.genderName,
          value: option._id,
        }))
      );
    }
    if (employeeResponse?.success) {
      setIsLoading(false);
      toast.success("Employee added successfully");
      navigate("/masters/viewemployee");
    }
    if (cityList?.success) {
      setCityData(
        cityList?.data?.data.map((option: any) => ({
          label: option.city_name,
          value: option._id,
        }))
      );
    }
  }, [
    branchList,
    stateList,
    userRoleList,
    departmentList,
    genderList,
    cityList,
    employeeResponse,
  ]);

  useEffect(() => {
    if (!stateId) return;
    dispatch(
      apiRequest(CITY_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "city_master", filters: { state_id: stateId } },
      })
    );
  }, [stateId, isEdit]);

  useEffect(() => {
    if (!cityList) return;
    if (cityList?.success) {
      setCityData(
        cityList.data.data.map((option: any) => ({
          label: option.city_name,
          value: option._id,
        }))
      );
    }
  }, [cityList]);

  useEffect(() => {
    dispatch(
      apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "branch" },
      })
    );
    dispatch(
      apiRequest(STATE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "state_master" },
      })
    );

    dispatch(
      apiRequest(USER_ROLE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "user_role" },
      })
    );
    dispatch(
      apiRequest(DEPARTMENT_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "department" },
      })
    );
    dispatch(
      apiRequest(GENDER_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "gender" },
      })
    );
  }, []);

  const getInitialValues = () => {
    const dateFields = new Set(["date_of_birth", "date_of_join"]);

    return Object.fromEntries(
      fields.map(({ name }) => {
        let fieldValue: any = employeeData?.[name];

        if (name === "cityId") {
          fieldValue = employeeData?.cityId ?? "";
        }

        if (name === "profileImg") {
          const url = employeeData?.img;
          const fileName = url ? url.split("/").pop() : "";
          fieldValue = fileName ?? null;
        }

        if (name === "resume") {
          const url = employeeData?.doc;
          const fileName = url ? url.split("/").pop() : "";
          fieldValue = fileName ?? null;
        }

        if (dateFields.has(name) && fieldValue) {
          const parsedDate = dayjs(fieldValue);
          fieldValue = parsedDate.isValid()
            ? parsedDate.format("YYYY-MM-DD")
            : "";
        }

        return [name, fieldValue];
      })
    );
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
      });

    setWebShow(false);
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      console.log("values-", values);
      const formData = new FormData();
      setIsLoading(true);
      if (values.profileImg) {
        formData.append("img", values.profileImg);
      }
      if (values.resume) {
        formData.append("doc", values.resume);
      }

      const data: any = {
        procedureName: isEdit ? "update" : "create",
        params: {
          tableName: "employee",
          ...(isEdit && { id: id }),
          data: {
            ...values,
          },
          checkWith: ["mobile"],
        },
      };
      formData.append("data", JSON.stringify(data));

      // Submit to backend
      await saveOrEditEmployee(formData);
    },
    enableReinitialize: true,
  });

  const saveOrEditEmployee = async (formData: FormData) => {
    dispatch(
      apiRequest(
        EMPLOYEE_LIBRARY_RES,
        "postFile",
        API_ENDPOINTS.SP_FILE.POST_FILE("employee"),
        formData
      )
    );
  };

  const handleNumberInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement> | any,
    field: FieldType
  ) => {
    if (field.type === "number" && ["+", "-", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

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
                        if (field.type === "dropdown") {
                          const optionsData =
                            field.name === "branchId"
                              ? branchData
                              : field.name === "stateId"
                                ? stateData
                                : field.name === "userRoleId"
                                  ? userRoleData
                                  : field.name === "departmentId"
                                    ? departmentData
                                    : field.name === "cityId"
                                      ? cityData
                                      : field.name === "genderId"
                                        ? genderData
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
                                onChange={(_, value) => {
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
                                  type={show ? "text" : "password"}
                                  error={Boolean(formik.errors[field.name])}
                                  helperText={
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
                                            setShow((prev) => !prev)
                                          }
                                          edge="end"
                                        >
                                          {show ? <Eye /> : <EyeOff />}
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
                                value={formik.values[field.name] || ""}
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
                                error={Boolean(formik.errors[field.name])}
                                helperText={
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
                      disabled={isLoading || !formik.isValid}
                    >
                      {isLoading ? (
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
