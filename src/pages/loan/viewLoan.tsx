import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/breadCrumbComp";
import { Box, Typography, Stack, Card, Grid, Divider } from "@mui/material";
import { useEffect } from "react";

import { spliceDecimals } from "../../const";
import { useLoan } from "./loanHooks";
function ViewLoan() {
  const { id } = useParams();
  const { fetchLoanById, selectedLoan } = useLoan();
  useEffect(() => {
    if (id) {
      fetchLoanById(id);
    }
  }, [id]);

  const Loanfields = [
    {
      label: "Loan Code",
      value: selectedLoan?.loanCode || "N/A",
    },
    {
      label: "Loan Name",
      value: selectedLoan?.loanName || "N/A",
    },
    {
      label: "Item Description",
      value: selectedLoan?.itemDescription || "N/A",
    },
    {
      label: "Condition Report",
      value: selectedLoan?.conditionReport || "N/A",
    },
    {
      label: "Loan Agreement (PDF)",
      value: selectedLoan?.loanAgreement ? (
        <a
          href={selectedLoan.loanAgreement}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-grey hover:text-gray-900"
        >
          View Document
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      label: "Intimation Letter (PDF)",
      value: selectedLoan?.intimationLetter ? (
        <a
          href={selectedLoan.intimationLetter}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-grey hover:text-gray-900"
        >
          View Document
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      label: "Legal Disclosures",
      value: selectedLoan?.legalDisclosures || "N/A",
    },
  ];

  const charges = [
    {
      label: "Processing Fee",
      value: spliceDecimals(selectedLoan?.processingFee, 2),
    },
    {
      label: "Additional Charges",
      value: spliceDecimals(selectedLoan?.additionalCharges, 2),
    },
    {
      label: "Due Date Alerts",
      value: selectedLoan?.dueDateAlerts ? "Enabled" : "Disabled",
    },
    {
      label: "Maturity Period",
      value: selectedLoan?.maturityPeriod
        ? `${selectedLoan.maturityPeriod} months `
        : "N/A",
    },
  ];

  return (
    <>
      <Box display="flex" alignItems="center" mb={3} px={4}>
        <Typography variant="h4" flexGrow={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "Loan Creation" },
                { label: "View Loan", active: true },
              ]}
            />
          </Stack>
        </Typography>
      </Box>
      <Card sx={{ my: 3, mx: 3 }}>
        <Box
          alignItems={"center"}
          sx={{
            backgroundColor: "white",

            margin: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
            View Loan
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

          {/* <Divider sx={{bgcolor:"#F2F2F9"}} /> */}
          <Divider sx={{ mt: 3, bgcolor: "#F2F2F9" }} />
          <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
            charges
          </Typography>
          <Grid container spacing={2}>
            {charges.map((item, index) => (
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

export default ViewLoan;
