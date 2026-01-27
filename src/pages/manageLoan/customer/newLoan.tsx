import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Card,
  Typography,
  Grid,
  InputLabel,
  Autocomplete,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import CreateCustomer from "./customerCreation";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import ItemDetails from "./itemDetaills";
import SubTable from "../../../components/subTable/subTable";
import AddLoan from "./addLoan";
import { ValidationField } from "../../../validations/schemaBuilder";
import { mobileLength } from "../../../const";
import { Form, FormikProvider, useFormik } from "formik";
import { useValidation } from "../../../validations/useValidation";
import { Toast } from "../../../components/toast/toast";
import dayjs from "dayjs";
import { useCustomer } from "../../customer overview/customerHooks";
import { useBranch } from "../../settings/branch/branchHooks";
import { useLoanAccount } from "./loanAccountHooks";

export interface itemType {
  metalId: {
    _id: string;
    metalName: string;
  };
  purityId: {
    _id: string;
    purityName: string;
  };
  itemId: {
    _id: string;
    itemName: string;
  };
  touch:Number,
  boardRateAdj:Number,
  metalRateAtCreation:Number,
  grossWt: number;
  netWt: number;
  quantity: number;
  value: number;
}

interface Customer {
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

dayjs.locale("en");
// const dateFormat = "DD/MM/YYYY";

function NewLoan() {
  const [customerType, setCustomerType] = useState<String>("new");
  const [branchId, setBranchId] = useState<string>("");
  const [customerData, setcustomerData] = useState<any>();

  const [itemData, setItemData] = useState<itemType[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [customerId, setCustomerId] = useState<string>("");


  const { fetchCustomerBysearch, fetchCustomerById, selectedCustomer } =
    useCustomer();
  const { branches, fetchBranches } = useBranch();
  const { createLoanAccount, loading } = useLoanAccount();

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCustomerTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: string | null
  ) => {
    console.log(event);
    if (newType !== null) {
      setCustomerType(newType);
    }
  };

  const addItem = (data: itemType) => {
    setItemData((prev) => {
      const updatedItems = [...prev, data];
      const sum = updatedItems.reduce((acc, item) => acc + item.value, 0);
      setTotalAmount(sum);
      return updatedItems;
    });
  };

  const handleDelete = (index: number) => {
    const updatedData = [...itemData];
    updatedData.splice(index, 1); // removes one item at the given index
    setItemData(updatedData);
  };

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "metal", label: "Metal" },
    { id: "Purity", label: "Purity" },
    { id: "touch", label: "Touch" },
    { id: "boardRateAdj", label: "Board Rate Deduction" },
    { id: "metalRateAtCreation", label: "Metal Rate" },
    { id: "Item Type", label: "Item Type" },
    { id: "Gross wt", label: "Gross Wt" },
    { id: "Net wt", label: "Net Wt" },
    { id: "Quantity", label: "Quantity" },
    { id: "Value", label: "Value" },
  ];

  const fields: ValidationField[] = [
    {
      name: "branchId",
      label: "Branch",
      required: true,
      type: "dropdown",
      placeHolder: "Select Branch",
    },
    {
      name: "mobile",
      label: "Mobile",
      required: true,
      max: 10,
      min: 10,
      type: "text",
      placeHolder: "Enter Mobile",
    },
    {
      name: "name",
      label: "Name",
      placeHolder: "Enter Name",
      required: true,
      min: 1,
      max: 50,
      maxLength: 200,
    },
  ];

  const columnsData = itemData.map((item, index) => ({
    id: index + 1, // S.NO
    metal: item.metalId.metalName,
    Purity: item.purityId.purityName,
    touch: item.touch,
    boardRateAdj: item.boardRateAdj,
    metalRateAtCreation: item.metalRateAtCreation,
    // metalRateoFcreatedDay: item.boardRateAdj,
    "Item Type": item.itemId.itemName,
    "Gross wt": item.grossWt,
    "Net wt": item.netWt,
    Quantity: item.quantity,
    Value: item.value,
  }));

  const handleCustomerId = (id: string) => {
    console.log(id);
    setCustomerId(id);
    fetchCustomerById(id);
  };
 
  useEffect(() => {
    if (selectedCustomer) {
      setBranchId(selectedCustomer.branchId);
    }
  }, [selectedCustomer]);



  const handleSubmit = (loanData: any) => {
    loanData.customerId = customerId;

    const itemDatas = itemData.map((item) => ({
      metalId: item.metalId._id,
      purityId: item.purityId._id,
      touch: item.touch,
      boardRateAdj: item.boardRateAdj,
      metalRateAtCreation: item.metalRateAtCreation,
      itemId: item.itemId._id,
      quantity: item.quantity,
      grossWt: item.grossWt,
      netWt: item.netWt,
      metalPrice: item.value,
      lockerId: loanData.lockerId,
    }));

    const formData = new FormData();
    if (loanData.image) {
      formData.append("itemImg", loanData.image);
    }
    loanData.itemDetails = itemDatas;
    formData.append("data", JSON.stringify(loanData));
    createLoanAccount(formData);
  };

  const handleBranchId = (id: string) => {
    setBranchId(id);
  };

  const getInitialValues = (
    fields: ValidationField[],
    customerData?: Customer | Customer[]
  ): Record<string, any> => {
    return Object.fromEntries(
      fields.map(({ name, value }: any) => {
        const customer = Array.isArray(customerData)
          ? customerData[0]
          : customerData;

        let fieldValue: any = customer?.[name] ?? "";

        if (fieldValue === undefined) {
          fieldValue = value !== undefined ? value : "";
        }

        // Special handling for name field
        if (name === "name") {
          const cusName: string = [customer?.firstName, customer?.lastName]
            .filter(Boolean)
            .join(" ");
          fieldValue = cusName || fieldValue;
        }

        if (name == "mobile") {
          fieldValue = 9061166907;
        }

        return [name, fieldValue];
      })
    );
  };

  const formik = useFormik({
    initialValues: getInitialValues(fields, customerData),
    validationSchema: useValidation(fields),
    onSubmit: async () => {
      handleSearch();
    },

    enableReinitialize: true,
  });

  useEffect(() => {
    setCustomerId("");
    setcustomerData(null);
    setItemData([]);
    setTotalAmount(0);
    setBranchId("");
    formik.resetForm();
  }, [customerType]);

  const handleSearch = async () => {
    if (!formik.values.branchId) {
      Toast.show({ message: "Branch is required", type: "error" });
      return;
    }

    if (String(formik.values.mobile).length !== mobileLength) {
      Toast.show({
        message: `Mobile Number should be ${mobileLength} digits `,
        type: "error",
      });
      return;
    }

    let customerData: any = await fetchCustomerBysearch({
      branchId: formik.values.branchId,
      mobile: formik.values.mobile,
    });
    if (customerData) {
      console.log(customerData);
      setcustomerData(customerData);
      handleCustomerId(customerData._id);
      formik.setFieldValue(
        "name",
        `${customerData?.firstName} ${customerData?.lastName} `
      );
    } else {
      setCustomerId("");
      formik.setFieldValue("name", "");
    }
  };



  return (
    <>
      <Box px={5}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Manage Loan" },
                { label: "Create Loan", active: true },
              ]}
            />
          </Stack>
        </Stack>

        <Stack mb={3}>
          <ToggleButtonGroup
            exclusive
            value={customerType}
            onChange={handleCustomerTypeChange}
            aria-label="Customer Type"
            sx={{
              width: 314,
              height: 36,
            }}
          >
            <ToggleButton
              value="new"
              sx={{
                color: "black",
                "&.Mui-selected": {
                  backgroundColor: "#09090F",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#1a1a20",
                  },
                },
              }}
            >
              New Customer
            </ToggleButton>
            <ToggleButton
              value="existing"
              sx={{
                color: "black",
                "&.Mui-selected": {
                  backgroundColor: "#09090F",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#1a1a20",
                  },
                },
              }}
            >
              Existing Customer
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {customerType === "new" ? (
        <>
          <CreateCustomer handleCustomer={handleCustomerId} />
          {customerId && (
            <>
              <Box px={5} alignItems={"center"} py={3}>
                <Card sx={{}}>
                  <ItemDetails
                    addItemFunction={addItem}
                    itemTableData={itemData}
                    branchId={branchId}
                  />
                  <SubTable
                    coloums={coloums}
                    data={columnsData}
                    onDelete={handleDelete}
                  />
                </Card>
              </Box>
              <Box px={5} alignItems={"center"} py={3}>
                <AddLoan
                  totalAmount={totalAmount}
                  handleSubmit={handleSubmit}
                  loading={loading}
                />
              </Box>
            </>
          )}
        </>
      ) : (
        <Box px={5}>
          <>
            <Box alignItems={"center"}>
              <FormikProvider value={formik}>
                <Form
                  noValidate
                  autoComplete="off"
                  onSubmit={formik.handleSubmit}
                >
                  <Card sx={{ p: 4, border: "2px solid #F2F2F9" }}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{ mb: 2, fontSize: "18px", fontWeight: 600 }}
                    >
                      Existing Customer
                    </Typography>
                    <Grid container spacing={6}>
                      {/* Branch Dropdown */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          required
                          sx={{
                            "& .MuiInputLabel-asterisk": {
                              color: "red",
                            },
                            color: "black",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "12px",
                          }}
                        >
                          Branch
                        </InputLabel>
                        <Autocomplete
                          options={branches.map((branch) => ({
                            label: branch.branchName,
                            value: branch._id,
                          }))}
                          value={
                            branches
                              .map((branch) => ({
                                label: branch.branchName,
                                value: branch._id,
                              }))
                              .find(
                                (option) =>
                                  option.value === formik.values.branchId ||
                                  option.value === branchId
                              ) || null
                          }
                          onChange={(_, newValue: any) => {
                            formik.setFieldValue(
                              "branchId",
                              newValue?.value || ""
                            );
                            handleBranchId(newValue?.value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              size="small"
                              placeholder="Select branch"
                              error={
                                formik.touched.branchId &&
                                Boolean(formik.errors.branchId)
                              }
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "48px",
                                  borderRadius: "8px",
                                  paddingRight: 0,
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Phone Number with Search */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          required
                          sx={{
                            "& .MuiInputLabel-asterisk": {
                              color: "red",
                            },
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "black",
                            marginBottom: "12px",
                          }}
                        >
                          Mobile Number
                        </InputLabel>

                        <TextField
                          fullWidth
                          name="mobile"
                          size="medium"
                          placeholder="Search phone number"
                          value={formik.values.mobile}
                          onChange={(e) => {
                            const input = e.target.value;
                            // Allow only numbers and max 10 digits
                            if (/^\d{0,10}$/.test(input)) {
                              formik.setFieldValue("mobile", input);
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.mobile &&
                            Boolean(formik.errors.mobile)
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{ fontSize: "16px", px: 1 }}
                              >
                                +91
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end" sx={{ p: 0 }}>
                                <Button
                                  disableElevation
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    height: "48px",
                                    borderRadius: "0px 8px 8px 0px",
                                    backgroundColor: "black",
                                    color: "#fff",
                                    px: 2,
                                    ml: 1,
                                    minWidth: 0,
                                    boxShadow: "none",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    "&:hover": {
                                      backgroundColor: "#333",
                                    },
                                  }}
                                  onClick={handleSearch}
                                >
                                  Search
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px",
                              borderRadius: "8px",
                              paddingRight: 0,
                            },
                          }}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                        />
                      </Grid>

                      {/* Customer Name  */}
                      <Grid item xs={12} md={6}>
                        <InputLabel
                          sx={{
                            "& .MuiInputLabel-asterisk": {
                              color: "red",
                            },
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "black",
                            marginBottom: "12px",
                          }}
                        >
                          Customer Name
                        </InputLabel>

                        <TextField
                          size="medium"
                          fullWidth
                          name="name"
                          type="text"
                          value={formik.values.name || ""}
                          inputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Form>
              </FormikProvider>
            </Box>

            {customerId && (
              <>
                <Box alignItems={"center"} py={3}>
                  <Card>
                    <ItemDetails
                      addItemFunction={addItem}
                      itemTableData={itemData}
                      branchId={branchId}
                    />
                    <SubTable
                      coloums={coloums}
                      data={columnsData}
                      onDelete={handleDelete}
                    />
                  </Card>
                </Box>
                <AddLoan
                  totalAmount={totalAmount}
                  handleSubmit={handleSubmit}
                  loading={loading}
                />
              </>
            )}
          </>
        </Box>
      )}
    </>
  );
}

export default NewLoan;
