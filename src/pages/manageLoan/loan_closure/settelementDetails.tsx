import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "dayjs/locale/en";
import SubTable from "../../../components/subTable/subTable";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ImageUpload from "../../../components/imageUpload/uploadImage";
import { spliceDecimals } from "../../../const";
import { useEffect } from "react";

const today = dayjs();
const tenDaysAgo = today.subtract(10, "day");
const tenDaysLater = today.add(10, "day");

export default function SettelementDetails({
  accountData,
  itemData,
  closureData,
  setClosureData,
  customerData,
}: any) {
  const Loanfields = [
    {
      label: "Loan Amount (Principal)",
      value: spliceDecimals(accountData?.principalAmt, 2) || "N/A",
    },
    {
      label: "Total Interest Accrued",
      value: `${accountData ? accountData?.interestRate + "%" : ""}` || "N/A",
    },
    {
      label: "Total Amount Paid",
      value: spliceDecimals(accountData?.totalPaid, 2) || "N/A",
    },
  ];

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "metal", label: "Metal" },
    { id: "Purity", label: "Purity" },
    { id: "Gross wt", label: "Gross wt" },
    { id: "Net wt", label: "Net WT" },
  ];

  const columnsData = itemData?.map((item: any, index: any) => ({
    id: index + 1,
    metal: item?.metalName,
    Purity: item?.purityName,
    "Gross wt": item?.grossWt,
    "Net wt": item?.netWt,
  }));

  useEffect(() => {
    if (closureData?.closedThrough == "1") {
      setClosureData((prev: any) => ({
        ...prev,
        additionalCharges: 0,
      }));
    }
  }, [closureData.closedThrough]);
  return (
    <>
      <Card sx={{ my: 1 }}>
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
          <Typography variant="h4" gutterBottom sx={{ m: 1 }}>
            Loan Settlement Details
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

            {/* New Input: Settlement Date */}
            <Grid item xs={12} sm={6} md={3} mt={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
              >
                Settlement Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={
                    closureData.settlementDate
                      ? dayjs(closureData.settlementDate)
                      : null
                  }
                  onChange={(newValue) => {
                    setClosureData((prev: any) => ({
                      ...prev,
                      settlementDate: newValue
                        ? newValue.toDate().toISOString()
                        : null,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  minDate={tenDaysAgo}
                  maxDate={tenDaysLater}
                />
              </LocalizationProvider>
            </Grid>

            {/* New Input: Other Charges */}
            <Grid item xs={12} sm={6} md={3} marginLeft={2}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
              >
                Other Charges (Processing Fees)
              </Typography>
              <TextField
                fullWidth
                type="text"
                value={closureData.additionalCharges}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setClosureData((prev: any) => ({
                    ...prev,
                    additionalCharges: value,
                  }));
                }}
                sx={{
                  bgcolor:
                    closureData?.closedThrough === "1"
                      ? "grey.200"
                      : "transparent",
                }}
                InputProps={{
                  readOnly: closureData?.closedThrough == "1" ? true : false,
                  inputProps: { min: 0, step: 1 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Button
                        sx={{
                          height: "48px",
                          minWidth: "unset",
                          boxShadow: "none",
                          textTransform: "none",
                          fontWeight: 500,
                          color: "black",
                        }}
                      >
                        ₹
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} marginLeft={2}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
              >
                closer Photo
              </Typography>
              <ImageUpload
                onChange={(file) =>
                  setClosureData((prev: any) => ({
                    ...prev,
                    closerImg: file,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} marginLeft={2}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "black", mb: 0.5 }}
              >
                Customer Profile
              </Typography>
              <img src={customerData.img} alt="" />
            </Grid>
          </Grid>
        </Box>

        <Box px={2} py={2}>
          <SubTable
            coloums={coloums}
            data={columnsData}
            action={false}
            hidePagination={true}
          />
        </Box>
      </Card>
    </>
  );
}
