import {
    Box,
    Card,
    Grid,
    Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { spliceDecimals } from "../../const";

// Configure dayjs
dayjs.locale("en");
export default function CustomerDetails({
    accountData,
    data,
}: any) {

    const Loanfields = [
        {
            label: "Customer Name",
            value: data?.customerName || 'N/A'

        },
        {
            label: "Loan  No",
            value: accountData?.loanNo || "N/A",
        },
        {
            label: "Loan Date",
            value: accountData?.createdAt
                ? new Date(accountData?.createdAt).toLocaleDateString('en-GB')
                : 'N/A',
        },
        {
            label: "Interest Percentage",
            value: `${accountData?.interestRate ?? "N/A"}%` || "N/A",
        },
        {
            label: "Loan Tenure",
            value: `${accountData?.loanId.maturityPeriod ?? "N/A"}  Months ` || "N/A",
        },
        {
            label: "Delivery Date",
            value: accountData?.maturityDate
                ? new Date(accountData?.maturityDate).toLocaleDateString('en-GB')
                : 'N/A',
        },
        {
            label: "Loan Amount",
            value: spliceDecimals(accountData?.principalAmt, 2) || "N/A",
        },
    ];

    return (
        <>
            <Card sx={{ my: 3 }}>
                <Box
                    px={5}
                    alignItems={"center"}
                    sx={{
                        backgroundColor: "white",
                        padding: 2,
                        margin: 2,
                        borderRadius: 2,
                    }}
                >

                    <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
                        Customer Details
                    </Typography>
                    <Grid container spacing={2}>
                        {Loanfields.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box sx={{ padding: 2, height: "100%" }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
                                    >
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                        {item.value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Card>
        </>
    );
}
