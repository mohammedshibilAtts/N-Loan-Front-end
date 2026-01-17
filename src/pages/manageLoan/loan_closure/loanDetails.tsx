
import {
  Box,
  Card,
  Grid,
  Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "react-toastify/dist/ReactToastify.css";

// Configure dayjs
dayjs.locale("en");
export default function UserDetails({
  accountData,
  data,
}: any) {

  const Loanfields = [
    {
        label: "Loan Start Date",
        value: accountData?.createdAt
      ? new Date(accountData?.createdAt).toLocaleDateString('en-GB')
      : 'N/A',
          
      },
    {
      label: "Customer Name",
      value: data?.customerName||'N/A'
        
    },
    {
      label: "Customer Mobile",
      value: data?.mobile||'N/A'
        
    },
    {
      label: "Customer Address",
      value: data?.address||'N/A'
        
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
          Loan Details
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
