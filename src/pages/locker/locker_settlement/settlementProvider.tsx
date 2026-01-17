import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormik } from "formik";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Autocomplete,
  DialogActions,
  IconButton,
  Grid,
  InputLabel,
  Typography,
} from "@mui/material";
import { apiClear, apiRequest } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINTS from "../../../services/endpoints";
import {
  BRANCH_LIST,
  EXPENSE_LIST,
  SUBEXPENSE_LIST,
  PAYMENT_MODE_LIST,
  PAYMENT_PROVIDER_LIST,
  EXPENSE_ENTRIES_UPDATE_RES,
  LOCKER_SETTELMENT_RES,
} from "../../../store/actionTypes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ValidationField } from "../../../validations/schemaBuilder";
import { useValidation } from "../../../validations/useValidation";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import mdiClose from "@iconify/icons-mdi/close";
import { Icon } from "@iconify/react/dist/iconify.js";

import dayjs from "dayjs";
import "dayjs/locale/en";
import { IndianRupee } from "lucide-react";
import { Toast } from "../../../components/toast/toast";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface EntryFormProps {
  isView: boolean;
  isEdit: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  lockerData: any;
}

type Option = {
  label: string;
  value: string | number;
};

interface Field {
  name: string;
  type?: string;
}

dayjs.locale("en");
// const dateFormat = 'DD/MM/YYYY';

export const SettlementProvider: React.FC<EntryFormProps> = ({
  isView,
  isEdit,
  onClose,
  setIsLoading,
  isLoading,
  lockerData,
}) => {
  const dispatch = useDispatch();
  const [entryId, setentryId] = useState<string | null>(null);
  const [expenseId, setExpenseId] = useState<string | null>(null);
  // const [date, setDate] = useState<string | null>(null);
  const [paymentMethod, setPayemntMode] = useState<string | null>(null);
  const [expenseEntryData, setExpenseEntryData] = useState<any>([]);
  const [branchData, setBranchData] = useState<
    { branchName: string; _id: string }[]
  >([]);
  const [expenseData, setExpenseData] = useState<
    { expenseName: string; _id: string }[]
  >([]);
  const [subExpenseData, setSubExpenseData] = useState<
    { name: string; _id: string }[]
  >([]);
  const [paymentMethodData, setpaymentMethodData] = useState<
    { mode: string; _id: string }[]
  >([]);
  const [paymentProviderData, setPaymentProviderData] = useState<
    { providerName: string; _id: string }[]
  >([]);

  // Ref for the first input field
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Define fields with validation rules and labels
  const fields: ValidationField[] = [
    {
      name: "expenseDate",
      label: "Expense Date",
      placeHolder: "Select Date",
      type: "date",
      required: true,
      isPast: false,
    },

    {
      name: "paymentMethod",
      label: "Payment Method",
      placeHolder: "Select payment method",
      type: "dropdown",
      required: true,
    },
    {
      name: "paymentProvider",
      label: "Payment Provider",
      placeHolder: "Select payment provider",
      type: "dropdown",
      required: false,
    },
    {
      name: "amount",
      label: "Amount",
      placeHolder: "Enter amount",
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

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
    e.preventDefault();
  };

  const handleNumberInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (["+", "-", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const {
    createResponse,
    branchList,
    expenseList,
    paymentMethodList,
    paymentProviderList,
    subExpenseList,
  } = useSelector((states: any) => ({
    createResponse: states[LOCKER_SETTELMENT_RES]?.data,
    branchList: states[BRANCH_LIST]?.data,
    expenseList: states[EXPENSE_LIST]?.data,
    subExpenseList: states[SUBEXPENSE_LIST]?.data,
    paymentMethodList: states[PAYMENT_MODE_LIST]?.data,
    paymentProviderList: states[PAYMENT_PROVIDER_LIST]?.data,
  }));

  useEffect(() => {
    if (!expenseId) return;

    dispatch(
      apiRequest(SUBEXPENSE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "find",
        params: {
          tableName: "subExpense",
          filters: {
            expenseId: expenseId,
            active: true,
          },
        },
        data: {
          expenseId: expenseId,
          active: true,
        },
      })
    );
  }, [expenseId]);

  useEffect(() => {
    if (branchList?.success) {
      setBranchData(branchList.data.data);
    }
  }, [branchList]);

  useEffect(() => {
    if (expenseList?.success) {
      setExpenseData(expenseList.data.data);
    }
  }, [expenseList]);

  useEffect(() => {
    if (subExpenseList?.success) {
      setSubExpenseData(subExpenseList.data.data);
    }
  }, [subExpenseList]);

  useEffect(() => {
    if (paymentMethodList?.success) {
      setpaymentMethodData(paymentMethodList?.data?.data);
    }
  }, [paymentMethodList]);

  useEffect(() => {
    if (paymentProviderList?.success) {
      setPaymentProviderData(paymentProviderList.data.data);
    }
  }, [paymentProviderList]);

  const getInitialValues = () => {
    if (!Array.isArray(fields)) return {};

    return Object.fromEntries(
      fields.map(({ name, type }: Field) => {
        let rawValue = expenseEntryData?.[name];

        let fieldValue: string | null = "";

        // Handle date type fields safely
        if (typeof type === "string" && type.toLowerCase().includes("date")) {
          if (rawValue) {
            try {
              const dateObj = new Date(rawValue);
              if (!isNaN(dateObj.getTime())) {
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                const dd = String(dateObj.getDate()).padStart(2, "0");
                fieldValue = `${yyyy}-${mm}-${dd}`;
              } else {
                fieldValue = null; // Invalid date
              }
            } catch (err) {
              fieldValue = null;
            }
          } else {
            fieldValue = null;
          }
        } else {
          fieldValue = rawValue ?? "";
        }

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
            tableName: "lockerSettelment",
            ...(isView && { id: entryId }),
            ...(isEdit && { id: entryId }),
            data: [
              {
                lockerId: lockerData._id,
                amount: formik.values.amount,
              },

              {
                ...values,
                paymentProvider:
                  values?.paymentProvider === ""
                    ? null
                    : values?.paymentProvider,
                lockerName: lockerData.lockerName,
                branch: lockerData?.branchId,
              },
            ],
          },
        };

        dispatch(
          apiRequest(LOCKER_SETTELMENT_RES, "post", API_ENDPOINTS.SP.POST, data)
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
    dispatch(apiClear(LOCKER_SETTELMENT_RES));
    dispatch(apiClear(EXPENSE_ENTRIES_UPDATE_RES));
    setExpenseEntryData([]);
    return () => {
      dispatch(apiClear(LOCKER_SETTELMENT_RES));
      dispatch(apiClear(EXPENSE_ENTRIES_UPDATE_RES));
      setExpenseEntryData([]);
      formik.resetForm();
      setentryId(null);
    };
  }, [dispatch]);

  // Handle API response for create
  useEffect(() => {
    if (createResponse?.success !== undefined) {
      if (createResponse.success) {
        Toast.show({ message: "Locker settled successfully", type: "success" });
        onClose();
      } else {
        Toast.show({ message: "Failed to settle locker", type: "error" });
      }
      setIsLoading(false);
    }
  }, [createResponse]);

  // Set focus on the first input field when the modal opens
  useEffect(() => {
    if (firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 0);
    }
  }, []);

  useEffect(() => {
    dispatch(
      apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "branch" },
      })
    );
    dispatch(
      apiRequest(EXPENSE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "expense" },
      })
    );
    // dispatch(apiRequest(SUBEXPENSE_LIST, 'post', API_ENDPOINTS.SP.POST, { procedureName: 'findAll', params: { tableName: 'subexpense' } }));
    dispatch(
      apiRequest(PAYMENT_MODE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "paymentMode" },
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      apiRequest(PAYMENT_PROVIDER_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "paymentProvider",
          filters: { paymentMode: formik.values.paymentMethod },
        },
      })
    );
  }, [formik.values.paymentMethod]);

  const getOptionsForField = (fieldName: string) => {
    switch (fieldName) {
      case "branch":
        return branchData.map((option) => ({
          label: option.branchName,
          value: option._id,
        }));
      case "expense":
        return expenseData.map((option) => ({
          label: option.expenseName,
          value: option._id,
        }));
      case "subExpense":
        return subExpenseData.map((option) => ({
          label: option.name,
          value: option._id,
        }));
      case "paymentMethod":
        return paymentMethodData.map((option) => ({
          label: option.mode,
          value: option._id,
        }));
      case "paymentProvider":
        return paymentProviderData.map((option) => ({
          label: option.providerName,
          value: option._id,
        }));
      default:
        return [];
    }
  };

  const getCurrentValue = (fieldName: string) => {
    const value = formik.values[fieldName] as Option | string | null;

    if (value === null || value === undefined || value === "") {
      return null;
    }

    const options: Option[] = getOptionsForField(fieldName);

    const selectedOption = options.find((option) => option.value === value);

    if (!selectedOption && typeof value === "object" && value !== null) {
      return options.find((option) => option.value === value.value) || null;
    }

    return selectedOption || null;
  };

  const handleDropdownChange = (fieldName: string, value: any) => {
    formik.setFieldValue(fieldName, value?.value || "");

    if (fieldName === "paymentMethod") {
      setPayemntMode(value?.label);
    } else if (fieldName === "expense") {
      setExpenseId(value?.value);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      // width="xl"
      fullWidth
      PaperProps={{
        sx: {
          width: "2050px",
          display: "flex",
          justifyContent: "center",
        },
      }}
    >
      <ToastContainer />
      <DialogTitle>{"Locker settlement"}</DialogTitle>
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
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {fields.map((field) => {
              if (field.name == "expenseDate") {
                return (
                  <Grid item xs={12} md={6}>
                    <InputLabel
                      htmlFor="expenseDate"
                      className="mb-2 flex items-center gap-1"
                      style={{ color: "#09090F" }}
                    >
                     Expense Date
                      <span className="text-[#F04438] text-lg">*</span>
                    </InputLabel>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={
                          formik.values.expenseDate
                            ? dayjs(formik.values.expenseDate)
                            : null
                        }
                        onChange={(value) =>
                          formik.setFieldValue(
                            "expenseDate",
                            value ? value.format("YYYY-MM-DD") : ""
                          )
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error:
                              formik.touched.expenseDate &&
                              Boolean(formik.errors.expenseDate),
                            helperText:
                              formik.touched.expenseDate &&
                              formik.errors.expenseDate
                                ? (formik.errors.expenseDate as string)
                                : "",
                            onBlur: () =>
                              formik.setFieldTouched("expenseDate", true),
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                );
              }
              if (
                field.name === "paymentProvider" &&
                paymentMethod === "Cash"
              ) {
                return null;
              }

              return (
                <Grid item xs={12} sm={6} md={6} key={field.name}>
                  <InputLabel
                    htmlFor={field.name}
                    className="mb-2 flex items-center gap-1"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-[#F04438] text-lg">*</span>
                    )}
                  </InputLabel>

                  {field.type === "dropdown" ? (
                    <Autocomplete
                      options={getOptionsForField(field.name)}
                      getOptionLabel={(option) => option.label}
                      value={getCurrentValue(field.name)}
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
                      onChange={(_, value) =>
                        handleDropdownChange(field.name, value)
                      }
                      sx={{ mb: 3 }}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      placeholder={field.placeHolder}
                      type={
                        field.type === "date"
                          ? "date"
                          : field.type === "number"
                            ? "number"
                            : "text"
                      }
                      value={formik.values[field.name]}
                      onBlur={formik.handleBlur}
                      error={Boolean(
                        formik.touched[field.name] && formik.errors[field.name]
                      )}
                      helperText={
                        formik.touched[field.name] &&
                        typeof formik.errors[field.name] === "string"
                          ? (formik.errors[field.name] as string)
                          : undefined
                      }
                      InputProps={{
                        ...(field.name === "amount" && {
                          startAdornment: (
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              <IndianRupee size={18} />
                            </Typography>
                          ),
                          inputProps: {
                            min:
                              field.min !== undefined ? field.min : undefined,
                            max:
                              field.max !== undefined ? field.max : undefined,
                            // step: field.step !== undefined ? field.step : 'any'
                          },
                        }),
                      }}
                      onWheel={handleWheel}
                      onKeyDown={handleNumberInputKeyDown}
                      onChange={(e) => {
                        const value = e.target.value;

                        formik.setFieldValue(field.name, value);
                      }}
                      sx={{ mb: 3 }}
                    />
                  )}
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
            isLoading ? <CircularProgress size={24} /> : "Save"
            // </>
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};
