import { useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  Button,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";
import { Form, FormikProvider, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useValidation } from "../../../validations/useValidation";
import { ValidationField } from "../../../validations/schemaBuilder";
import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { itemType } from "./newLoan";
import { Toast } from "../../../components/toast/toast";
import { defult22KPurityNo, spliceDecimals } from "../../../const";
import { useMetal } from "../../master/metal/metalhooks";
import { usePurity } from "../../master/purity/purityhooks";
import { useItem } from "../../master/itemCreation/itemhooks";
import { useMetalRate } from "../../master/metalRate/metalRateHooks";

// Configure dayjs
dayjs.locale("en");
const dateFormat = "DD/MM/YYYY";

type ItemDetailsProps = {
  addItemFunction: (item: itemType) => void;
  itemTableData: itemType[];
  branchId: string;
};

export default function ItemDetails({
  addItemFunction,
  // itemTableData,
  branchId,
}: ItemDetailsProps) {
  const designLibraryData = null;

  const { fetchMetals, metals } = useMetal();
  const { fetchPuritiesByMetal, purities } = usePurity();
  const { fetchItems, items } = useItem();
  const { getRateByPurity, selectedMetalRate } = useMetalRate();

  useEffect(() => {
    fetchMetals();
     formik.setFieldValue("boardRateAdj",0);
  }, []);

  const getInitialValues = () => {
    return Object.fromEntries(
      fields?.map(({ name, value }: any) => {
        let fieldValue: any = designLibraryData?.[name] || "";
        if (fieldValue === undefined) {
          fieldValue = value !== undefined ? value : "";
        }

        // Special handling for date fields if any
        if (name === "dateField" && fieldValue) {
          fieldValue = dayjs(fieldValue, dateFormat);
        }

        return [name, fieldValue];
      })
    );
  };

  const fields: ValidationField[] = [
    {
      name: "metalId",
      label: "Select Matel",
      placeHolder: "Enter First Name",
      type: "dropdown",
      required: true,
    },
    {
      name: "purityId",
      label: "Select Purity",
      placeHolder: "Enter Last Name",
      required: true,
      type: "dropdown",
    },
    {
      name: "itemId",
      label: "Select Type",
      required: true,
      type: "dropdown",
    },
    {
      name: "quantity",
      label: "Enter Quantity",
      required: true,
      type: "number",
      placeHolder: "Enter Quantity",
    },
    {
      name: "touch",
      label: "Enter Touch",
      required: true,
      type: "text",
      placeHolder: "Enter Touch",
    },
    {
      name: "touchAdj",
      label: "Enter touchAdj",
      required: false,
      type: "checkbox",
      placeHolder: "Enter touchAdj",
    },
    {
      name: "boardRateAdj",
      label: "Enter Board Rate Adj",
      required: true,
      type: "text",
      placeHolder: "Enter Board Rate Adj",
    },
    {
      name: "karatRate",
      label: "karatRate",
      required: true,
      type: "text",
      placeHolder: "karatRate",
    },
    {
      name: "groosWt",
      label: "Enter Gross Weight",
      required: true,
      type: "text",
      placeHolder: "Enter Groos Weight",
    },
    {
      name: "netWt",
      label: "Enter Net Weight",
      required: true,
      minAmount: 0.001,
      type: "amount",
      placeHolder: "Enter Groos Weight",
    },
    {
      name: "metalPrice",
      label: "Metal Price",
      required: true,
      type: "number",
      placeHolder: "Metal Price",
    },
    {
      name: "value",
      label: "Value",
      required: true,
      type: "number",
      placeHolder: "Value",
    },
    {
      name: "remark",
      label: "Remark",
      max: 40,
      min: 1,
      type: "text",
      required: false,
    },
  ];

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: useValidation(fields),
    onSubmit: async (values, { resetForm }) => {
      const metal: any = metals.find((m) => m._id === values.metalId);
      const purity: any = purities.find((m) => m._id === values.purityId);
      const item: any = items.find((m) => m._id === values.itemId);

      if (!metal || !purity || !item) {
        return;
      }
      if (Number(values.groosWt) < Number(values.netWt)) {
        Toast.show({
          message: `Net weight cannot exceed the Gross weight of ${values.groosWt}`,
          type: "error",
        });
        return;
      }
      addItemFunction({
        metalId: metal,
        purityId: purity,
        touch: values.touch,
        itemId: item,
        grossWt: values.groosWt,
        netWt: values.netWt,
        quantity: values.quantity,
        value: values.value,
      });
      resetForm();
    },

    enableReinitialize: true,
  });

  useEffect(() => {
    if (!formik.values.metalId) return;
    fetchPuritiesByMetal(formik.values.metalId);
  }, [formik.values.metalId]);

  useEffect(() => {
    if (!formik.values.purityId) return;
    fetchItems({ purityId: formik.values.purityId });
    const metal: any = metals.find((m) => m._id === formik.values.metalId);
    const purity: any = purities.find((m) => m._id === formik.values.purityId);
    const purityNo = metal.metalNo == 1 ? defult22KPurityNo : purity.purityNo;
    getRateByPurity(branchId, formik.values.metalId, purityNo);

  }, [formik.values.purityId, selectedMetalRate]);



  useEffect(() => {
    formik.setFieldValue("purityId", "");
    formik.setFieldValue("itemId", "");
    formik.setFieldValue("metalPrice", "");
  }, [formik.values.metalId]);

  useEffect(() => {
    if (formik.values.metalPrice && formik.values.netWt) {
      const total: number = spliceDecimals(
        formik.values.metalPrice * formik.values.netWt,
        2
      );
      formik.setFieldValue("value", total);
    }
  }, [formik.values.metalPrice, formik.values.netWt]);

  useEffect(() => {
    if (formik.values.purityId) {
      const purity: any = purities.find(
        (m) => m._id === formik.values.purityId
      );
      formik.setFieldValue("touch", purity?.purityPercentage || 0);
     
    }
  }, [formik.values.purityId,formik.values.touchAdj]);



  useEffect(() => {
    if (formik.values.touch) {
      const findMetals: any = metals.find(
        (i: any) => i._id == formik.values.metalId
      );
      const metalNumber = findMetals?.metalNo;
      if (metalNumber == 1) {
        const touch = spliceDecimals(formik.values.touch);
        formik.setFieldValue(
          "karatRate",
          parseFloat(((touch / 100) * 24).toFixed(2))
        );
      }else{
        formik.setFieldValue("metalPrice", selectedMetalRate);
      }
    }
  }, [formik.values.touch,selectedMetalRate]);

  useEffect(() => {
    if (formik.values.karatRate) {
      if (!selectedMetalRate) return;

      // ensure numeric values
      const metalRateTd = spliceDecimals(selectedMetalRate);
      const Karat = spliceDecimals(formik.values.karatRate);
      const divideCal = 22;
      const calculated = (Karat * metalRateTd) / divideCal; // number

      const boardAdj = spliceDecimals(formik.values.boardRateAdj); // % (number)

      // apply board rate deduction first (if any)
      let adjRate =
        boardAdj > 0 ? calculated - (calculated * boardAdj) / 100 : calculated;

      
      let finalValue = adjRate;

      // round to 2 decimals and keep as number
      const finalRate = spliceDecimals(finalValue);
      console.log(finalRate);
      formik.setFieldValue("metalPrice", finalRate);
    }
  }, [formik.values.karatRate, selectedMetalRate,  formik.values.boardRateAdj,]);




  return (
    <Page>
      <ToastContainer />
      <Box>
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                    Item Details
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 2 }}
                  >
                    <Grid container spacing={2}>
                      {/* Metal dropdown field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="metalId"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Select Metal
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <Autocomplete
                          size="medium"
                          options={metals?.map((option) => ({
                            label: option.metalName,
                            value: option._id,
                          }))}
                          value={
                            metals
                              ?.map((option) => ({
                                label: option.metalName,
                                value: option._id,
                              }))
                              .find(
                                (opt) => opt.value === formik.values.metalId
                              ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Metal"
                              error={Boolean(
                                formik.touched.metalId && formik.errors.metalId
                              )}
                              helperText={
                                formik.touched.metalId && formik.errors.metalId
                                  ? (formik.errors.metalId as string)
                                  : ""
                              }
                            />
                          )}
                          onChange={(_, value) => {
                            formik.setFieldValue("metalId", value?.value || "");
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

                      {/* Purity dropdown field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="purityId"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Select Purity
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <Autocomplete
                          size="medium"
                          options={purities?.map((option) => ({
                            label: option.purityName,
                            value: option._id,
                          }))}
                          value={
                            purities
                              ?.map((option) => ({
                                label: option.purityName,
                                value: option._id,
                              }))
                              .find(
                                (opt) => opt.value === formik.values.purityId
                              ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Purity"
                              error={Boolean(
                                formik.touched.purityId &&
                                  formik.errors.purityId
                              )}
                              helperText={
                                formik.touched.purityId &&
                                formik.errors.purityId
                                  ? (formik.errors.purityId as string)
                                  : ""
                              }
                            />
                          )}
                          onChange={(_, value) => {
                            formik.setFieldValue(
                              "purityId",
                              value?.value || ""
                            );
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

                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="itemId"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Select Item
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <Autocomplete
                          size="medium"
                          options={items?.map((option) => ({
                            label: option.itemName,
                            value: option._id,
                          }))}
                          value={
                            items
                              ?.map((option) => ({
                                label: option.itemName,
                                value: option._id,
                              }))
                              .find(
                                (opt) => opt.value === formik.values.itemId
                              ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Item"
                              error={Boolean(
                                formik.touched.itemId && formik.errors.itemId
                              )}
                              helperText={
                                formik.touched.itemId && formik.errors.itemId
                                  ? (formik.errors.itemId as string)
                                  : ""
                              }
                            />
                          )}
                          onChange={(_, value) => {
                            formik.setFieldValue("itemId", value?.value || "");
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

                      {/* Quantity field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="quantity"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Enter Quantity
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="quantity"
                          type="number"
                          placeholder="Enter Quantity"
                          value={formik.values.quantity}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Allow only digits (0–9)
                            if (!/^\d*$/.test(value)) return;

                            formik.setFieldValue("quantity", value);
                          }}
                          onKeyDown={(e) => {
                            // Prevent typing e, E, +, -, ., ArrowUp, ArrowDown, etc.
                            if (
                              ["e", "E", "+", "-", ".", ","].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e: any) => e.target.blur()} // Disable scroll change
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.quantity &&
                            Boolean(formik.errors.quantity)
                          }
                          helperText={
                            formik.touched.quantity && formik.errors.quantity
                              ? (formik.errors.quantity as string)
                              : ""
                          }
                          autoComplete="off"
                        />
                      </Grid>

                      {/* Touch field */}
                      <Grid item xs={12} md={6}>
                        <Grid container spacing={2} alignItems="flex-end">
                          <Grid item xs={8}>
                            <InputLabel
                              htmlFor="touch"
                              className="mb-2 flex items-center gap-1"
                              style={{ color: "#09090F" }}
                            >
                              Enter Touch
                              <span className="text-[#F04438] text-lg">*</span>
                            </InputLabel>

                            <TextField
                              size="medium"
                              fullWidth
                              name="touch"
                              type="text"
                              placeholder="Enter Touch"
                              value={formik.values.touch}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Allow only numbers and one dot
                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                  const num = Number(value);
                                  if (num == 0)
                                    return formik.setFieldValue("touch", "");
                                  if (num >= 0 && num <= 100) {
                                    formik.setFieldValue("touch", value);
                                  }
                                }
                              }}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.touch &&
                                Boolean(formik.errors.touch)
                              }
                              helperText={
                                formik.touched.touch && formik.errors.touch
                                  ? (formik.errors.touch as string)
                                  : ""
                              }
                              autoComplete="off"
                              inputProps={{
                                min: 1,
                                max: 4,
                                readOnly: !formik.values.touchAdj,
                              }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <InputLabel
                              className="mb-2 flex items-center gap-1"
                              style={{ color: "#09090F" }}
                            >
                              Touch Adjustment
                            </InputLabel>

                            <Box
                              onClick={() =>{
                                if(formik.values.touchAdj){
                                  formik.setFieldValue(
                                  "boardRateAdj",
                                  0
                                )
                                }
                                formik.setFieldValue(
                                  "touchAdj",
                                  !formik.values.touchAdj
                                )
                              }
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
                                  color: formik.values.touchAdj
                                    ? "black"
                                    : "text.secondary",
                                  zIndex: 1,
                                }}
                              >
                                {formik.values.touchAdj ? "Yes" : ""}
                              </Box>
                              <Box
                                sx={{
                                  fontWeight: 500,
                                  color: !formik.values.touchAdj
                                    ? "black"
                                    : "text.secondary",
                                  zIndex: 1,
                                }}
                              >
                                {!formik.values.touchAdj ? "No" : ""}
                              </Box>

                              {/* Dot */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: formik.values.touchAdj
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
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Board Rate Deduction field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="boardRateAdj"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Enter Board Rate Deduction
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="boardRateAdj"
                          type="text"
                          placeholder="Enter Board Rate Deduction"
                          value={formik.values.boardRateAdj}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Allow only numbers and one dot
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              const num = Number(value);

                              if (num >= 0 && num <= 100) {
                                formik.setFieldValue("boardRateAdj", value);
                              }
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.boardRateAdj &&
                            Boolean(formik.errors.boardRateAdj)
                          }
                          helperText={
                            formik.touched.boardRateAdj &&
                            formik.errors.boardRateAdj
                              ? (formik.errors.boardRateAdj as string)
                              : ""
                          }
                          autoComplete="off"
                          inputProps={{
                            min: 1,
                            max: 4,
                            readOnly:!formik.values.touchAdj
                          }}
                        />
                      </Grid>

                      {/* Metal Price field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="metalPrice"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Metal Price
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="metalPrice"
                          type="text"
                          placeholder="Metal Price"
                          value={formik.values.metalPrice}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.metalPrice &&
                            Boolean(formik.errors.metalPrice)
                          }
                          helperText={
                            formik.touched.metalPrice &&
                            formik.errors.metalPrice
                              ? (formik.errors.metalPrice as string)
                              : ""
                          }
                          autoComplete="off"
                          inputProps={{
                            min: 3,
                            max: 50,
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>

                      {/* Gross Weight field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="groosWt"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Enter Gross Weight
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="groosWt"
                          type="text"
                          placeholder="Enter Gross Weight"
                          value={formik.values.groosWt}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Allow only numbers and one dot
                            if (/^\d*\.?\d{0,3}$/.test(value)) {
                              formik.setFieldValue("groosWt", value);
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.groosWt &&
                            Boolean(formik.errors.groosWt)
                          }
                          helperText={
                            formik.touched.groosWt && formik.errors.groosWt
                              ? (formik.errors.groosWt as string)
                              : ""
                          }
                          autoComplete="off"
                          inputProps={{
                            min: 1,
                            max: 4,
                          }}
                        />
                      </Grid>

                      {/* Net Weight field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="netWt"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Enter Net Weight
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="netWt"
                          type="text"
                          placeholder="Enter Net Weight"
                          value={formik.values.netWt}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers and one dot
                            if (/^\d*\.?\d{0,3}$/.test(value)) {
                              formik.setFieldValue("netWt", value);
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.netWt && Boolean(formik.errors.netWt)
                          }
                          helperText={
                            formik.touched.netWt && formik.errors.netWt
                              ? (formik.errors.netWt as string)
                              : ""
                          }
                          autoComplete="off"
                          inputProps={{
                            min: 1,
                            max: 4,
                          }}
                        />
                      </Grid>

                      {/* Value field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="value"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Value
                          <span className="text-[#F04438] text-lg">*</span>
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="value"
                          type="number"
                          placeholder="Value"
                          value={formik.values.value}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.value && Boolean(formik.errors.value)
                          }
                          helperText={
                            formik.touched.value && formik.errors.value
                              ? (formik.errors.value as string)
                              : ""
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                          autoComplete="off"
                          inputProps={{
                            min: 6,
                            max: 6,
                          }}
                        />
                      </Grid>

                      {/* Remark field */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          htmlFor="remark"
                          className="mb-2 flex items-center gap-1"
                          style={{ color: "#09090F" }}
                        >
                          Remark
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="remark"
                          type="text"
                          placeholder="Remark"
                          value={formik.values.remark}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.remark &&
                            Boolean(formik.errors.remark)
                          }
                          helperText={
                            formik.touched.remark && formik.errors.remark
                              ? (formik.errors.remark as string)
                              : ""
                          }
                          autoComplete="off"
                          inputProps={{
                            min: 1,
                            max: 40,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "end",
                      gap: 2,
                    }}
                  >
                    {/* Clear Button */}
                    <Button
                      variant="outlined"
                      onClick={() => formik.resetForm()}
                      sx={{
                        borderColor: "black",
                        color: "black",
                        "&:hover": {
                          borderColor: "#333",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      Clear
                    </Button>

                    {/* Submit Button */}
                    <LoadingButton
                      type="submit"
                      sx={{
                        bgcolor: "black",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#333",
                        },
                      }}
                      // loading={isLoading}
                    >
                      Add
                    </LoadingButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Box>
    </Page>
  );
}
