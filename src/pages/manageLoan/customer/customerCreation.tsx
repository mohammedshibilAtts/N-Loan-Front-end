import { useState, useEffect, useRef } from "react";
import {  useParams } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  InputAdornment,
  Button,
  CircularProgress,
  IconButton,
  // CircularProgress,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { Form, FormikProvider, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import { Camera, Trash2 } from "lucide-react";
import { Toast } from "../../../components/toast/toast";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCustomer } from "../../customer overview/customerHooks";
import { useLocationMaster } from "../../../hooks/commonhooks/locationMaster";
import { useBranch } from "../../settings/branch/branchHooks";
import { useGender } from "../../../hooks/commonhooks/genderHook";
import { useMartialStatus } from "../../../hooks/commonhooks/martialStatusHook";
import { useLocality } from "../../master/locality/localityhooks";

interface FileTypeOptions {
  images?: string[];
  pdfs?: boolean;
}

// interface CustomerData {
//   [key: string]: any;
//   _id?: string;
//   img?: string;
//   doc?: string;
//   cityId?: string;
// }

// Configure dayjs
dayjs.locale("en");
// const dateFormat = "DD/MM/YYYY";

export default function CreateCustomer({ handleCustomer }: any) {

  // const isEdit = pathname.includes('edit');
  const { id } = useParams<{ id?: string }>();
  // const userInfo = useSelector((state: any) => state.userInfo);
  const [showeb, setWebShow] = useState<boolean>(false);
  const [stateId, setStateId] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const additionalDocRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  // const [isAdmin, setIsAdmin] = useState();
  // const [branchId, setBranchId] = useState();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // useEffect(() => {
  //   setIsAdmin(userInfo.isAdmin);
  //   setBranchId(userInfo.branchId);
  // }, [userInfo]);
  // const BASEURL = import.meta.env.VITE_BASE_URL || process.env.VITE_BASE_URL;
  // const [isLoading, setIsLoading] = useState(false);

  const { createCustomer, updateCustomer, loading,fetchCustomerById,selectedCustomer } = useCustomer();
  const { fetchAllStates, states, fetchCities, cities } = useLocationMaster();
  const { branches, fetchBranches } = useBranch();
  const { fetchGender, genders } = useGender();
  const { fetchMartialStatus, martialData } = useMartialStatus();
  const { fetchLocalities, localities } = useLocality();

  useEffect(() => {
    fetchAllStates();
    fetchBranches();
    fetchGender();
    fetchMartialStatus();
    fetchLocalities();
  }, []);

  useEffect(() => {
    if (stateId) {
      fetchCities(stateId);
    }
  }, [stateId]);

  // todo need to clear the these functions

  useEffect(() => {
    formik.resetForm();
    return () => {
      formik.resetForm();
    };
  }, []);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
    fetchCustomerById(id)
    }
  }, [id]);
  

  const fields: ValidationField[] = [
    {
      name: "branchId",
      label: "Branch",
      required: true,
      type: "dropdown",
      placeHolder: "Select Branch",
    },
    {
      name: "firstName",
      label: "First Name",
      placeHolder: "Enter First Name",
      required: true,
      min: 1,
      max: 50,
    },
    {
      name: "lastName",
      label: "Last Name",
      placeHolder: "Enter Last Name",
      required: true,
      min: 1,
      max: 50,
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
      name: "whatsappNo",
      label: "Whatsapp Number",
      type: "number",
      required: true,
      minLength: 10,
      min: 10,
      maxLength: 10,
      max: 10,
      // type: "text",
      placeHolder: "Enter Whatsapp Mobile Number",
    },
    {
      name: "genderId",
      label: "Gender",
      required: true,
      type: "dropdown",
      placeHolder: "Select Gender",
    },
    {
      name: "address",
      label: "Address",
      required: true,
      //   min: 3,
      //   max: 50,
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
      name: "localityId",
      label: "Locality",
      required: true,
      type: "dropdown",
      placeHolder: "Select Locality",
    },
    {
      name: "pan_card",
      label: "Pan Card Number",
      required: false,
      minLength: 10,
      maxLength: 10,
      min: 0,
      max: 10,
      type: "text",
      placeHolder: "Pan Card Number",
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
      name: "martialStatus",
      label: "Martial Status",
      required: true,
      type: "dropdown",
      placeHolder: "Martial Status",
    },
    {
      name: "date_of_birth",
      label: "Date of Birth ",
      required: false,
      type: "date",
      placeHolder: "Date of Birth",
    },
    {
      name: "img",
      label: "Upload Profile Image",
      required: true,
      type: "file",
    },
    { name: "doc", label: "Upload Document", required: true, type: "file" },
    {
      name: "additionalDoc",
      label: "Upload Additional Document",
      required: false,
      type: "file",
    },
  ];

  useEffect(() => {
  if (selectedCustomer && selectedCustomer.stateId) {
    setStateId(selectedCustomer.stateId);
    fetchCities(selectedCustomer.stateId).then(() => {
      // Reset form with updated data
      formik.resetForm({
        values: {
          ...formik.values,
          cityId: selectedCustomer.cityId || "",
          stateId: selectedCustomer.stateId || "",
        },
      });
    });
  }
}, [selectedCustomer]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showeb) return;

    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }

    profileInputRef.current?.click();
  };

  const handleDocClick = (e: React.MouseEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();

    let targetRef: React.RefObject<HTMLInputElement> | null = null;

    if (fieldName === "doc") {
      targetRef = docRef;
    } else if (fieldName === "additionalDoc") {
      targetRef = additionalDocRef;
    } else if (fieldName === "img") {
      targetRef = profileInputRef;
    }

    if (targetRef?.current) {
      targetRef.current.value = "";
      targetRef.current.click();
    }
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

      if (docRef.current) {
        docRef.current.value = "";
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
      Toast.show({ message: errorMessage, type: "error" });

      formik.setFieldError(fieldName, errorMessage);
      return;
    }

    if (
      (fieldName === "img" ||
        fieldName === "doc" ||
        fieldName === "additionalDocRef") &&
      fileSizeInKB > 500
    ) {
      const errorMessage = `File size should be less than 500kB.`;
      Toast.show({ message: errorMessage, type: "error" });
      formik.setFieldError(fieldName, errorMessage);
      return;
    }

    formik.setFieldError(fieldName, "");
    if (fieldName === "img" && file) {
      setProfilePreview(URL.createObjectURL(file));
    }
    formik.setFieldValue(fieldName, file);
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
        formik.setFieldValue("img", file);
      });

    setWebShow(false);
  };

  const handleFileDelete = (e: React.MouseEvent, fieldName: string) => {
    e.stopPropagation();
    formik.setFieldValue(fieldName, null);
    if (fieldName === "doc") {
      if (docRef.current) docRef.current.value = "";
    } else if (fieldName === "additionalDoc") {
      if (additionalDocRef.current) additionalDocRef.current.value = "";
    }
  };

  const getInitialValues = () => {
    const dateFields = new Set(["date_of_birth"]);
    return Object.fromEntries(
      fields.map(({ name, value }: any) => {
        let fieldValue: any = selectedCustomer?.[name] || "";
        if (fieldValue === undefined) {
          fieldValue = value !== undefined ? value : "";
        }

        // Special handling for date fields if any
        // if (name === "dateField" && fieldValue) {
        //   fieldValue = dayjs(fieldValue, dateFormat);
        // }

        if (name === "cityId") {
          fieldValue = selectedCustomer?.cityId ?? "";
        }

        if (name === "img") {
          const url = selectedCustomer?.img;
          const fileName = url ? url.split("/").pop() : "";
          fieldValue = fileName ?? null;
        }

        if (name === "doc") {
          const url = selectedCustomer?.doc;
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

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    onSubmit: async (values) => {
      const formData = new FormData();

      if (values.img) {
        formData.append("img", values.img);
      }
      if (values.doc) {
        formData.append("doc", values.doc);
      }
      if (values.additionalDoc) {
        formData.append("additionalDoc", values.additionalDoc);
      }

      const data: any = {
        ...values,
      };
      formData.append("data", JSON.stringify(data));
      if (id) {
        await updateCustomer(id, formData);
      } else {
        await createCustomer(formData);
      }
    },

    enableReinitialize: true,
  });

  return (
    <Page title={!isEdit ? "Add Customer" : "Edit  Customer"}>
      <Box px={5} alignItems={"center"}>
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                    {!isEdit ? "Add Customer" : "Edit  Customer"}
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
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

                        if (field.type == "dropdown") {
                          const optionsData =
                            field.name === "branchId"
                              ? branches.map((option) => ({
                                  label: option.branchName,
                                  value: option._id,
                                }))
                              : field.name === "stateId"
                                ? states.map((option) => ({
                                    label: option.state_name,
                                    value: option._id,
                                  }))
                                : field.name == "cityId"
                                  ? cities.map((option) => ({
                                      label: option.city_name,
                                      value: option._id,
                                    }))
                                  : field.name == "genderId"
                                    ? genders.map((option) => ({
                                        label: option.genderName,
                                        value: option._id,
                                      }))
                                    : field.name == "martialStatus"
                                      ? martialData.map((option) => ({
                                          label: option.name,
                                          value: option._id,
                                        }))
                                      : field.name == "localityId"
                                        ? localities.map((option) => ({
                                            label: option.name,
                                            value: option._id,
                                          }))
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
                                // value={optionsData.find(
                                //   (option) =>
                                //     option.value === formik.values[field.name]
                                // )}
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
                                slotProps={{
                                  popper: {
                                    modifiers: [
                                      {
                                        name: "customStyle",
                                        enabled: true,
                                        phase: "beforeWrite",
                                        fn: ({ state }) => {
                                          Object.assign(state.styles.popper, {
                                            boxShadow:
                                              "0px 10px 30px 0px rgba(64,100,233,0.15)",
                                          });
                                        },
                                      },
                                    ],
                                  },
                                }}
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
                                <span className="text-[#F04438] ">*</span>
                              )}
                              {field.label === "Upload Profile Image" && (
                                <span className="text-sm text-gray-500 ml-2">
                                  (File size must be at least 500KB)
                                </span>
                              )}
                              {field.label === "Upload doc" && (
                                <span className="text-sm text-gray-500 ml-2">
                                  (File size must be at least 1MB)
                                </span>
                              )}
                            </InputLabel>

                            {/* {["img", "doc"].includes(field.name) ? (
                              <input
                                id={field.name}
                                name={field.name}
                                type="file"
                                accept={
                                  field.name === "img"
                                    ? "image/*"
                                    : ".pdf,.doc,.docx"
                                }
                                onChange={(event) => {
                                  const file = event.currentTarget.files?.[0];
                                  console.log(file);
                                  if (file) {
                                    formik.setFieldValue(field.name, file);
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                style={{
                                  marginTop: "8px",
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "6px",
                                  width: "100%",
                                }}
                              /> */}

                            {["img", "doc", "additionalDoc"].includes(
                              field.name
                            ) ? (
                              field.name === "img" ? (
                                <Box>
                                  <Box
                                    display="flex"
                                    alignItems="flex-start"
                                    gap={1}
                                    mb={
                                      formik.touched.img && formik.errors.img
                                        ? 0
                                        : 2
                                    }
                                  >
                                    {/* TextField takes remaining space */}
                                    <Box flex={1}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="img"
                                        value={
                                          formik.values.img?.name ||
                                          (formik.values.img as string) ||
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
                                          formik.touched.img &&
                                            formik.errors.img
                                        )}
                                        onBlur={formik.handleBlur}
                                        onClick={handleButtonClick}
                                        helperText={
                                          formik.touched.img &&
                                          formik.errors.img
                                            ? String(formik.errors.img)
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
                                    id="img"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    ref={profileInputRef}
                                    onChange={(e) =>
                                      handleFileChange(e, "img", {
                                        images: [
                                          "image/jpeg",
                                          "image/png",
                                          "image/svg+xml",
                                        ],
                                      })
                                    }
                                  />
                                  {field.name === "img" && profilePreview && (
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
                                      {/* {profilePreview && (
                                        <IconButton onClick={handleRemove} color="error">
                                          <Trash2 />
                                        </IconButton>
                                      )} */}
                                    </Box>
                                  )}
                                </Box>
                              ) : (
                                <Box
                                  mb={2}
                                  onClick={(e) => handleDocClick(e, field.name)}
                                >
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name={field.name}
                                    value={
                                      formik.values[field.name]?.name ||
                                      (formik.values[field.name] as string) ||
                                      ""
                                    }
                                    placeholder="Choose file"
                                    InputProps={{
                                      readOnly: true,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          {formik.values[field.name] && (
                                            <IconButton
                                              onClick={(e) =>
                                                handleFileDelete(e, field.name)
                                              }
                                              color="error"
                                              sx={{ mr: 1 }}
                                            >
                                              <Trash2 size={20} />
                                            </IconButton>
                                          )}
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
                                            onClick={(e) =>
                                              handleDocClick(e, field.name)
                                            }
                                          >
                                            Browse
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }}
                                    error={Boolean(
                                      formik.touched[field.name] &&
                                        formik.errors[field.name]
                                    )}
                                    helperText={
                                      formik.touched[field.name] &&
                                      formik.errors[field.name]
                                        ? String(formik.errors[field.name])
                                        : ""
                                    }
                                    onBlur={formik.handleBlur}
                                  />

                                  <input
                                    type="file"
                                    id={field.name}
                                    accept="application/pdf"
                                    style={{ display: "none" }}
                                    ref={
                                      field.name === "doc"
                                        ? docRef
                                        : additionalDocRef
                                    }
                                    onChange={(e) =>
                                      handleFileChange(e, field.name, {
                                        pdfs: true,
                                      })
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Box>
                              )
                            ) : (
                              <TextField
                                size="medium"
                                key={field.name}
                                fullWidth
                                name={field.name}
                                type={field.type ?? ""}
                                placeholder={field.placeHolder}
                                value={formik.values[field.name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched[field.name] &&
                                  Boolean(formik.errors[field.name])
                                }
                                helperText={
                                  formik.touched[field.name] &&
                                  formik.errors[field.name]
                                    ? (formik.errors[field.name] as string)
                                    : ""
                                }
                                autoFocus={index === 0}
                                autoComplete="off"
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
                                InputProps={
                                  ["mobile", "whatsappNo"].includes(field.name)
                                    ? {
                                        startAdornment: (
                                          <InputAdornment
                                            position="start"
                                            sx={{
                                              fontSize: "16px",
                                              px: 1,
                                              fontWeight: 600,
                                            }}
                                          >
                                            +91
                                          </InputAdornment>
                                        ),
                                      }
                                    : undefined
                                }
                                onWheel={handleWheel}
                              />
                            )}
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>

                  {/* Submit Button */}
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
