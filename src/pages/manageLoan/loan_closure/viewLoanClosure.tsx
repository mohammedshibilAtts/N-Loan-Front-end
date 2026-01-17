import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ITEM_TABLE, LOAN_CLOSURE_VIEW } from "../../../store/actionTypes"
import API_ENDPOINTS from '../../../services/endpoints';
import { apiClear, apiRequest } from "../../../store/actions";
import "dayjs/locale/en";
import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from '../../../components/datatable/datatableComp';
import { spliceDecimals } from "../../../const";


interface Field {
    name: string;
    label: string;
    value?: string | null;
}

function ViewLoanClosure() {

    const { id } = useParams();
    let dispatch = useDispatch();
    const [data, setData] = useState<any>();


    const editResponse = useSelector((state: any) => state[LOAN_CLOSURE_VIEW]?.data);


    useEffect(() => {
        dispatch(apiClear(LOAN_CLOSURE_VIEW));
        return () => {
            dispatch(apiClear(LOAN_CLOSURE_VIEW));
        };
    }, [dispatch]);


    useEffect(() => {
        if (!id) return;
        if (id) {
            const body = {
                procedureName: "findById",
                params: {
                    tableName: "loanClosure",
                    id: id,
                    populateFields: ["branchId", "loanId", "closedBy", "loanAccountId", "customerId",
                        {
                            path: 'customerId',
                            populate: {
                                path: 'genderId'
                            }
                        }, {
                            path: 'customerId',
                            populate: {
                                path: 'martialStatus'
                            }
                        }
                    ]
                },
            };
            dispatch(apiRequest(LOAN_CLOSURE_VIEW, "post", API_ENDPOINTS.SP.POST, body));
        };
    }, []);

    useEffect(() => {
        if (!editResponse) return;
        if (editResponse?.success) {
            setData(editResponse?.data);
        }

    }, [editResponse]);

    const fields: Field[] = [
        {
            name: "firstName",
            label: "First Name",
            value: data?.customerId?.firstName || 'N/A',
        },
        {
            name: "lastName",
            label: "Last Name",
            value: data?.customerId?.lastName || 'N/A',
        },
        {
            name: "branchId",
            label: "Branch",
            value: data?.branchId?.branchName || 'N/A',
        },
        {
            name: "mobile",
            label: "Mobile No",
            value: data?.customerId?.mobile || 'N/A',
        },
        {
            name: "whatsappNo",
            label: "Whatsapp No",
            value: data?.customerId?.whatsappNo || 'N/A',
        },
        {
            name: "genderId",
            label: "Gender",
            value: data?.customerId?.genderId?.genderName || 'N/A',
        },
        {
            name: "address",
            label: "Address",
            value: data?.customerId?.address || 'N/A',
        },
        {
            name: "pan_card",
            label: "Pan Card",
            value: data?.customerId?.pan_card || 'N/A'
        },
        {
            name: "aadhar_number",
            label: "Aadhar No",
            value: data?.customerId?.aadhar_number || 'N/A'
        },
        {
            name: "martialStatus",
            label: "Marital Status",
            value: data?.customerId?.martialStatus?.name || 'N/A'
        },
        {
            name: "date_of_birth",
            label: "Date of Birth",
            value: data?.customerId?.date_of_birth
                ? new Date(data.customerId.date_of_birth).toLocaleDateString('en-GB')
                : 'N/A',

        },
        {
            name: "img",
            label: "Uploaded Profile Image",
            value: data?.customerId?.img || 'N/A'
        },
        {
            name: "doc",
            label: "Uploaded Document",
            value: data?.customerId?.doc ? (
                <a
                    href={data?.customerId?.doc}
                    download={new URL(data?.customerId?.doc).pathname.split('/').pop()}   // Forces download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                >
                    {new URL(data?.customerId?.doc).pathname.split('/').pop()}
                </a>
            ) : (
                "N/A"
            )
        }

    ];


    const Loanfields: Field[] = [

        {
            name: "branchId",
            label: "Branch",
            value: data?.branchId?.branchName || 'N/A',
        },
        {
            name: "Loan No",
            label: "Loan No",
            value: data?.loanNo || 'N/A',
        },
        {
            name: "Loan Type",
            label: "Loan Type",
            value: data?.loanId?.loanName || 'N/A',
        },
        {
            name: "Pay on Create",
            label: "Pay on Create",
            value: `${data?.loanAccountId?.collectPaymentOnCreate ? "Yes" : "No"}`
        },
        {
            name: "Principal Amount",
            label: "Principal Amount",
            value: spliceDecimals(data?.principalAmt, 2) || 'N/A',
        },
        {
            name: "Interest Rate",
            label: "Interest Rate",
            value: data?.loanAccountId?.interestRate ? (`${data?.loanAccountId?.interestRate}%`) : 'N/A',
        },
        {
            name: "Maturity Period",
            label: "Maturity Period",
            value: data?.loanId?.maturityPeriod || 'N/A',
        },
        {
            name: "Installment",
            label: "Installment",
            value: data?.loanAccountId?.installment || 'N/A'
        },
        {
            name: "Additional Charges",
            label: "Additional Charges",
            value: spliceDecimals(data?.loanAccountId?.additionalCharges, 2) || 'N/A'
        },
        {
            name: "Created Date",
            label: "Join Date",
            value: data?.createdAt
                ? new Date(data.createdAt).toLocaleDateString('en-GB')
                : 'N/A',
        },
        {
            name: "Closed Date",
            label: "Closed Date",
            value: data?.createdAt
                ? new Date(data.createdAt).toLocaleDateString('en-GB')
                : 'N/A',
        },
        {
            name: "Closed By",
            label: "Closed By",
            value: data?.closedBy?.username || 'N/A',
        },
        {
            name: "Closed   Through",
            label: "Closed   Through",
            value: data?.closedThrough == 0 ? "Payment Settlement" : "Pawned Items Sell",
        },
        {
            name: "Settlement Date",
            label: "Settlement Date",
            value: data?.settlementDate
                ? new Date(data.settlementDate).toLocaleDateString('en-GB')
                : 'N/A',
        },
        {
            name: "img",
            label: "Uploaded Closer Image",
            value: data?.closerImg || 'N/A'
        },


    ];


    return (
        <>
            <Page>
                <Box px={5} alignItems={"center"} sx={{ backgroundColor: "white", padding: 3, margin: 2, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
                        Customer Details
                    </Typography>
                    <Grid container spacing={2}>
                        {fields.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box
                                    sx={{

                                        padding: 2,
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500, color: 'black', mb: 0.5, font: "500" }}
                                    >
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                        {item.name === "img" ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'start',
                                                    alignItems: 'start',
                                                    padding: 1,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <img
                                                    src={typeof item.value === 'string' ? item.value : ""}
                                                    alt={item.label}
                                                    style={{
                                                        width: '100px',
                                                        height: '80px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            item.value || '-'
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box px={5} alignItems={"center"} sx={{ backgroundColor: "white", padding: 3, margin: 2, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
                        Item Details
                    </Typography>
                    {data?.loanAccountId &&
                        <DataTable
                            search_visiblity={false}
                            actionType={ITEM_TABLE}
                            endpoint={API_ENDPOINTS.SP.POST}
                            tableName="itemDetail"
                            filters={{ accountId: data?.loanAccountId._id }}
                            table_type={"view-loan"}
                            populateFields={["customerId", "metalId", "purityId", "itemId", "lockerId"]}
                        />
                    }


                </Box>

                <Box px={5} alignItems={"center"} sx={{ backgroundColor: "white", padding: 3, margin: 2, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
                        Loan Details
                    </Typography>
                    <Grid container spacing={2}>
                        {Loanfields.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box
                                    sx={{

                                        padding: 2,
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500, color: 'black', mb: 0.5, font: "500" }}
                                    >
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                        {item.name === "img" ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'start',
                                                    alignItems: 'start',
                                                    padding: 1,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <img
                                                    src={typeof item.value === 'string' ? item.value : ""}
                                                    alt={item.label}
                                                    style={{
                                                        width: '100px',
                                                        height: '80px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            item.value || '-'
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>


            </Page>
        </>
    )
}

export default ViewLoanClosure