import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, Grid, TextField, Typography, Autocomplete, InputLabel, InputAdornment, Button, Toolbar, Divider } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { Form, FormikProvider, useFormik } from "formik";
import { apiClear, apiRequest } from "../../store/actions";
import API_ENDPOINTS from "../../services/endpoints";
import {BRANCH_LIST,  CUSTOMER_LIST, LoanAccount_LIST, LOAN_ACC_TABLE,ITEM_TABLE,OVERDUE_REPORTS,CUSTOMER_PAYMENT} from "../../store/actionTypes";
import { useValidation } from "../../validations/useValidation";
import { ValidationField } from "../../validations/schemaBuilder";
import { Toast } from '../../components/toast/toast';
import { mobileLength } from "../../const";
import Page from "../../components/Page";
import { Stack } from "@mui/material";
import { Breadcrumb } from "../../components/breadCrumbComp";
import { DataTable } from "../../components/datatable/datatableComp";
import { formatNumber } from "../../utils/commonFunction";


interface Totals {
    totalCount: number;
    amount: number;
    items?: string[];
    totalSum:number;
    totalOverdue?:number;
    totalReceived?:number;
    totalPayable?:number;
    totalPaid?:number;
  }


  
dayjs.locale("en");
const dateFormat = "DD/MM/YYYY";

function CustomerOverview() {

    const dispatch = useDispatch();
    // const isEdit = pathname.includes('edit');
    const [customerData, setcustomerData] = useState<any>();
    const [customerId, setCustomerId] = useState<string>("");
    const [branchId, setBranchId] = useState<string>("")
    const [selectedContent, setSelectedContent] = useState<string>("OverDue Report");
    const [totalItem, setTotalItem] = useState<Totals | null>(null);
    const [totalAcc, setTotalsAcc] = useState<Totals | null>(null);
    const [overdueData, setOverdueData] = useState<Totals | null>(null);
    const [payementData, setPaymentData] = useState<Totals | null>(null);
    const [reFetch,setIsFetch]=useState<boolean>(false)

    const [branchData, setBranchData] = useState<
        { branchName: string; _id: string }[]
    >([]);


    useEffect(() => {
        dispatch(apiClear(BRANCH_LIST));
        dispatch(apiClear(CUSTOMER_LIST));
        dispatch(apiClear(ITEM_TABLE));
        dispatch(apiClear(LOAN_ACC_TABLE));
        dispatch(apiClear(OVERDUE_REPORTS));
        dispatch(apiClear(CUSTOMER_PAYMENT));
        return () => {
            dispatch(apiClear(BRANCH_LIST));
            dispatch(apiClear(CUSTOMER_LIST));
            dispatch(apiClear(ITEM_TABLE));
            dispatch(apiClear(LOAN_ACC_TABLE));
            dispatch(apiClear(OVERDUE_REPORTS));
            dispatch(apiClear(CUSTOMER_PAYMENT));
        };
    }, [dispatch]);

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

    ];

    const { itemTable,branchList, customerFind,loanTable,overDueTable,PaymentTable } = useSelector((states: any) => ({
        branchList: states[BRANCH_LIST]?.data,
        customerFind: states[CUSTOMER_LIST]?.data,
        itemTable: states[ITEM_TABLE]?.data,
        loanTable:states[LOAN_ACC_TABLE]?.data,
        PaymentTable:states[CUSTOMER_PAYMENT]?.data,
        overDueTable:states[OVERDUE_REPORTS]?.data

    }));


    useEffect(() => {
        if (branchList?.success) {
            setBranchData(branchList.data.data);
        }

        if(itemTable?.success){
            setTotalItem(itemTable?.data)
        }

        if(loanTable?.success){
            setTotalsAcc(loanTable?.data)
        }

        
        if(overDueTable?.success){
            setOverdueData(overDueTable?.data)
        }

           
        if(PaymentTable?.success){
            setPaymentData(PaymentTable?.data)
        }

    }, [branchList,itemTable,loanTable,overDueTable,PaymentTable]);

    

    useEffect(() => {
        dispatch(
            apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "findAll",
                params: { tableName: "branch" },
            })
        );
    }, []);

    const getInitialValues = () => {
        return Object.fromEntries(
            fields.map(({ name, value }: any) => {
                let fieldValue: any = customerData?.[name] || "";
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

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: useValidation(fields),
        onSubmit: async () => { },
        enableReinitialize: true,
    });

    const handleSubmit = () => {
        // e.preventDefault();
        if (!formik.values.branchId) {
            Toast.show({ message: "Branch is required", type: "error" })
            return
        }

        if (String(formik.values.mobile).length !== mobileLength) {
            Toast.show({ message: `Mobile Number should be ${mobileLength} digits `, type: "error" })
            return
        }
        dispatch(
            apiRequest(CUSTOMER_LIST, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "findAll",
                params: {
                    tableName: "customer",
                    populateFields: ["genderId", "martialStatus", "branchId"],
                    filters: {
                        branchId: formik.values.branchId,
                        mobile: formik.values.mobile,
                    },
                },
            })
         
        );
        setIsFetch(!reFetch)
        
    };

useEffect(()=>{
 setIsFetch(!reFetch)

},[selectedContent])
 
    useEffect(() => {
        if (customerFind?.success) {
            if (customerFind.data.data.length >= 1) {
                Toast.show({ message: "Customer Found Successfuly", type: "success" })
                setcustomerData(customerFind?.data.data[0])
                setCustomerId(customerFind.data.data[0]._id)
                // handleCustomerId(customerFind.data.data[0]._id);
                dispatch(
                    apiRequest(LoanAccount_LIST, "post", API_ENDPOINTS.SP.POST, {
                        procedureName: "findAll",
                        params: {
                            tableName: "loanAccount",
                            filters: {
                                branchId: formik.values.branchId,
                                customerId: customerFind.data.data[0]._id,
                            },
                        },
                    })
                );
            }
            else {
                // handleCustomerId("");
                setCustomerId("")
                setcustomerData([])
                setTotalItem(null)
                setTotalsAcc(null)

                Toast.show({ message: "Customer not found", type: "error" })
            }
        }
    }, [customerFind]);


    const customerfields: any = [
        {
            name: "branch",
            label: "Branch Type",
            value: customerData?.branchId?.branchName || 'N/A'
        },
        {
            name: "mobile",
            label: "Mobile No",
            value: customerData?.mobile || 'N/A'
        },
        {
            name: "whatsapp",
            label: "Whatsapp No",
            value: customerData?.whatsappNo || 'N/A'
        },
        {
            name: "gender",
            label: "Gender",
            value: customerData?.genderId?.genderName || 'N/A'
        },
        {
            name: "address",
            label: "Address",
            value: customerData?.address || 'N/A'
        },
        {
            name: "pancard",
            label: "Pancard",
            value: customerData?.pan_card || 'N/A'
        },
        {
            name: "aadharno",
            label: "Aadhar No",
            value: customerData?.aadhar_number || 'N/A'
        },
        {
            name: "dateofBirth",
            label: "Date of Birth",
            value: customerData?.date_of_birth
                ? new Date(customerData?.date_of_birth).toLocaleDateString('en-GB')
                : 'N/A',

        },
        {
            name: "maritalStatus",
            label: "Marital Status",
            value: customerData?.martialStatus?.name || 'N/A'
        },

    ];

 

    const navItems = ['OverDue Report', 'Loan Report', 'Payment Report', 'Item Report'];

    const handleButtonClick = (content:string) => {
        setSelectedContent(content);
    };

    const renderContent = () => {
        switch (selectedContent) {
            case 'OverDue Report':
                return <>
                    <Box display={"flex"} flexDirection={"column"}>
                        <Box display={"flex"} justifyContent={"space-between"} >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                                <Typography variant="h4" sx={{ color: 'black', textAlign: "start", fontSize: "18px" }}>
                                {formatNumber({value:payementData?.totalPaid,decimalValues:2})}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: '#737791', fontSize: "16px" }}>
                                    Total Received Amount
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                                <Typography variant="h4" sx={{ color: 'black', textAlign: "start", fontSize: "18px" }}>
                                {formatNumber({value:overdueData?.totalOverdue,decimalValues:2})}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: '#737791', fontSize: "16px" }}>
                                    Total OverDue Amount
                                </Typography>

                            </Box>
                        </Box>
                        <Box>
                        <DataTable
                         actionType={OVERDUE_REPORTS}
                         procedureName="overDueReport"
                         endpoint={API_ENDPOINTS.SP.POST}
                         table_type= "reports-overDue"
                         tableName="loanAccount"
                         filters={{customerId:customerData?._id}}
                         isLoading ={reFetch}
                         search_visiblity={false}
                         tableTitle ={"Over Due History"}
                   

                     />
                        </Box>
                    </Box>


                </>
            case 'Loan Report':
                return <>
                    <Box display={"flex"} flexDirection={"column"}>
                        <Box display={"flex"} justifyContent={"space-between"} >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                            
                                <Typography variant="h4" sx={{ color: 'black', textAlign: "start", fontSize: "18px" }}>
                                {formatNumber({value:payementData?.totalPaid,decimalValues:2})}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: '#737791', fontSize: "16px" }}>
                                    Total Received Amount
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                                  <Typography variant="h4" sx={{ color: 'black', textAlign: "start", fontSize: "18px" }}>
                                  {formatNumber({value:totalAcc?.totalPayable,decimalValues:2})}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: '#737791', fontSize: "16px" }}>
                                    Pending Amount
                                </Typography>

                            </Box>
                        </Box>
                        <Box>
                            <DataTable
                                actionType={LOAN_ACC_TABLE}
                                endpoint={API_ENDPOINTS.SP.POST}
                                tableName="loanAccount"
                                filters = {{ 
                                    customerId:customerData._id
                                }}
                                procedureName="loanAccountReport"
                                table_type="reports-customerloanAccount"
                                populateFields={["customerId", "loanId", "interestId"]}
                                isLoading ={reFetch}
                                search_visiblity={false}
                                tableTitle ={"Loan Report History"}
                                // handleTotalAccounts={handleTotalAccounts}

                            />
                        </Box>
                    </Box>

                </>
            case 'Payment Report':
                return <>
                  <Box display={"flex"} flexDirection={"column"}>
                        <Box display={"flex"} justifyContent={"space-between"} >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                                <Typography variant="h4" sx={{ color: 'black', textAlign: "start", fontSize: "18px" }}>
                                {formatNumber({value:payementData?.totalPaid,decimalValues:2})}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: '#737791', fontSize: "16px" }}>
                                 Total Received Amount
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                                <Typography variant="h4" sx={{ color: 'black', textAlign: "start", fontSize: "18px" }}>
                                {formatNumber({value:totalAcc?.totalPayable,decimalValues:2})}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: '#737791', fontSize: "16px" }}>
                                   Pending Amount
                                </Typography>

                            </Box>
                        </Box>
                        <Box>
                            <DataTable
                                actionType={CUSTOMER_PAYMENT}
                                endpoint={API_ENDPOINTS.SP.POST}
                                procedureName="transactionReport"
                                tableName="Payment"
                                filters = {{ 
                                    customerId:customerData._id
                                }}
                                table_type="reports-customerpayment"
                                populateFields={["customerId", "loanId", "interestId"]}
                                isLoading ={reFetch}
                                search_visiblity={false}
                                tableTitle ={"Payment Report"}
                                // handleTotalAccounts={handleTotalAccounts}

                            />
                        </Box>
                    </Box>
                </>;
            case 'Item Report':
                return <>
                    <Box display={"flex"} flexDirection={"column"}>
                        <Box display={"flex"} justifyContent={"space-between"} >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                                <Typography variant="h4" sx={{ color: 'black', textAlign: "start" }}>
                                    {totalItem?.totalCount}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                    Item count
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: "6",
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    px: 1,
                                }}
                            >
                                <Typography variant="h4" sx={{ color: 'black', textAlign: "start" }}>
                                {totalItem?.totalSum}g
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                    Item Weight
                                </Typography>

                            </Box>
                        </Box>
                        <Box>
                            <DataTable
                                actionType={ITEM_TABLE}
                                endpoint={API_ENDPOINTS.SP.POST}
                                tableName="itemDetail"
                                table_type="reports"
                                filters = {{
                                    customerId:customerId
                                }}
                                aggregateFields ={{
                                    targetField:"netWt",
                                    filters:{
                                        loanStatus:0
                                    }
                                }}
                                populateFields={[
                                    "metalId",
                                    "purityId",
                                    "itemId",
                                    "accountId",
                                    "customerId",
                                    {
                                        path: 'accountId',
                                        populate: {
                                            path: 'loanId'
                                        }
                                    },
                                    
                                ]}
                                isLoading ={reFetch}
                                search_visiblity={false}
                                tableTitle ={"Item Report"}
                            />

                        </Box>
                    </Box>
                </>;
            default:
                return "";
        }
    };

    const handleBranchId = (id: string) => {
        setBranchId(id);
    };

    return (
        <>
            <Page >

                <Box alignItems={"center"} px={3}>
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"} m={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Breadcrumb items={[
                                { label: "Customer" },
                                { label: "Customer overview", active: true },
                            ]}
                            />
                        </Stack>
                    </Stack>
                    <FormikProvider value={formik} >
                        <Form noValidate autoComplete="off" >
                            <Card sx={{ p: 4, border: '2px solid #F2F2F9', }} >
                                <Typography variant="h4" gutterBottom sx={{ mb: 2, fontSize: "18px", fontWeight: 600 }}>
                                    Customer Details
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
                                            options={branchData.map((branch) => ({
                                                label: branch.branchName,
                                                value: branch._id,
                                            }))}
                                            value={branchData
                                                .map((branch) => ({
                                                    label: branch.branchName,
                                                    value: branch._id,
                                                }))
                                                .find((option) =>
                                                    option.value === formik.values.branchId ||
                                                    (option.value) === branchId
                                                ) || null}

                                            onChange={(_, newValue:{ value: string } | null) => {
                                                if (!newValue) return;
                                                formik.setFieldValue("branchId", newValue?.value || "")
                                                handleBranchId(newValue?.value)
                                            }
                                            }
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
                                                            height: "48px", // Set desired height
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
                                                formik.touched.mobile && Boolean(formik.errors.mobile)
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
                                                            type="button"
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
                                                            onClick={handleSubmit}
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


                                </Grid>
                            </Card>
                        </Form>
                    </FormikProvider>
                </Box>

                {Object.entries(customerData || {})?.length > 0 && (
                    <>
                        <Box px={3} my={3} display={"flex"} flexDirection={{ xs: "column", md: "row" }} justifyContent={"space-between"} gap={3}>
                            {/* Profile Box */}
                            <Box
                                p={3}
                                sx={{
                                    flex: { xs: "1", md: "3" },
                                    backgroundColor: "white",
                                    margin: "4px",
                                    borderRadius: 2,
                                    border: '2px solid #F2F2F9'
                                }}
                            >
                                <Grid container spacing={2} p={2}>
                                    {/* Centered Profile Image */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: "column",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: "2px",
                                        }}
                                    >
                                        <img
                                            src={typeof customerData?.img === 'string' ? customerData?.img : ''}
                                            alt="Profile"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid #F2F2F9',
                                            }}
                                        />

                                        <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "center" }}>
                                            {customerData?.firstName || customerData?.lastName
                                                ? `${customerData?.firstName || ''} ${customerData?.lastName || ''}`
                                                : 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Labels and Values */}
                                    <Grid container spacing={2} my={2}>
                                        {customerfields.map((item: any) => (
                                            <Grid item xs={12} key={item._id}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-start',
                                                        gap: "6px",
                                                        alignItems: 'center',
                                                        px: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                                                        {item.value || '-'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Navigation and Content */}
                            <Box
                                sx={{
                                    flex: { xs: "1", md: "8" },
                                    justifyContent: "flex-start",
                                    alignItems: "start",
                                    width: "100%",
                                    flexDirection: "column",
                                    borderRadius: 2,
                                    color: "black",
                                }}
                            >
                                <Toolbar>
                                    <Box sx={{ width: "100%", display: 'flex', justifyContent: "space-between", gap: "2px" }}>
                                        {navItems.map((item) => (
                                            <Button
                                                key={item}
                                                sx={{
                                                    color: selectedContent === item ? 'white' : 'black',
                                                    backgroundColor: selectedContent === item ? 'black' : 'transparent',
                                                    marginInline: "3px",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        transform: 'scale(1.05)',
                                                    },
                                                    '&:active': {
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                    },
                                                }}
                                                onClick={() => handleButtonClick(item)}
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </Box>
                                </Toolbar>

                                {/* Content Area */}
                                <Box component="main" sx={{
                                    px: 3,
                                    backgroundColor: "white",
                                    border: '2px solid #F2F2F9',
                                }}>
                                    <Toolbar />
                                    {renderContent()}
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}


            </Page>
        </>
    )
}

export default CustomerOverview