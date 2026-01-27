import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

// import dayjs from "dayjs";
import "dayjs/locale/en";
import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { spliceDecimals } from "../../../const";
import { useLoanAccount } from "../customer/loanAccountHooks";
import SubTable from "../../../components/subTable/subTable";

interface Field {
  name: string;
  label: string;
  value?: string | null;
}

function ViewLoanAccounts() {
  const { id } = useParams();

  const { fetchLoanById, selectedLoan } = useLoanAccount();

  useEffect(() => {
    if (id) {
      fetchLoanById(id);
    }
  }, [id]);

    const loanData = selectedLoan?.loanData;
    const itemData = selectedLoan?.items?.item;

  // ✅ HARD GUARD (PREVENTS CRASH)
  if (!loanData) {
    return (
      <Page>
        
      </Page>
    );
  }

  console.log(loanData.loanStatus)


  const fields: Field[] = [
    {
      name: "firstName",
      label: "First Name",
      value: loanData.customerId?.firstName || "N/A",
    },
    {
      name: "lastName",
      label: "Last Name",
      value: loanData.customerId?.lastName || "N/A",
    },
    {
      name: "branchId",
      label: "Branch",
      value: loanData.branchId?.branchName || "N/A",
    },
    {
      name: "mobile",
      label: "Mobile No",
      value: loanData.customerId?.mobile || "N/A",
    },
    {
      name: "whatsappNo",
      label: "Whatsapp No",
      value: loanData.customerId?.whatsappNo || "N/A",
    },
    {
      name: "genderId",
      label: "Gender",
      value: loanData.customerId?.genderId?.genderName || "N/A",
    },
    {
      name: "address",
      label: "Address",
      value: loanData.customerId?.address || "N/A",
    },
    {
      name: "pan_card",
      label: "Pan Card",
      value: loanData.customerId?.pan_card || "N/A",
    },
    {
      name: "aadhar_number",
      label: "Aadhar No",
      value: loanData.customerId?.aadhar_number || "N/A",
    },
    {
      name: "martialStatus",
      label: "Marital Status",
      value: loanData.customerId?.martialStatus?.name || "N/A",
    },
    {
      name: "date_of_birth",
      label: "Date of Birth",
      value: loanData.customerId?.date_of_birth
        ? new Date(
            selectedLoan.loanData.customerId.date_of_birth
          ).toLocaleDateString("en-GB")
        : "N/A",
    },
    {
      name: "img",
      label: "Uploaded Profile Image",
      value: loanData.customerId?.img || "N/A",
    },
    {
    name: "doc",
    label: "Uploaded Document",
    value: loanData.customerId?.doc && loanData.customerId?.doc.startsWith('http')
        ? new URL(loanData.customerId.doc).pathname.split('/').pop()
        : 'N/A'
}

    
  ];

  const loanStatus:any = {
  0: { label: "OPEN", color: "#22C55E" },     // Vibrant Green
  1: { label: "CLOSED", color: "#EF4444" },   // Vibrant Red
  2: { label: "PRE", color: "#F59E0B" },      // Amber
  3: { label: "AUCT", color: "#3B82F6" },     // Blue
  4: { label: "ELIG", color: "#06B6D4" }, 

  }

  const Loanfields: Field[] = [
    {
      name: "branchId",
      label: "Branch",
      value: loanData.branchId?.branchName || "N/A",
    },
    {
      name: "Loan No",
      label: "Loan No",
      value: loanData.loanNo || "N/A",
    },
    {
      name: "Loan Type",
      label: "Loan Type",
      value: loanData.loanId?.loanName || "N/A",
    },
    {
      name: "Pay on Create",
      label: "Pay on Create",
      value: `${loanData.collectPaymentOnCreate ? "Yes" : "No"}`,
    },
    {
      name: "loanStatus",
      label: "Loan Status",
      value: loanStatus[`${loanData.loanStatus}`].label,
    },
    {
      name: "Principal Amount",
      label: "Principal Amount",
      value: spliceDecimals(loanData.principalAmt, 2) || "N/A",
    },
    {
      name: "Interest Rate",
      label: "Interest Rate",
      value: loanData.interestRate
        ? `${loanData.interestRate}%`
        : "N/A",
    },
    {
      name: "Maturity Period",
      label: "Maturity Period",
      value: loanData.loanId?.maturityPeriod || "N/A",
    },
    {
      name: "Installment",
      label: "Installment",
      value: loanData.installment || "N/A",
    },
    {
      name: "Additional Charges",
      label: "Additional Charges",
      value:
        spliceDecimals(loanData.additionalCharges, 2) || "N/A",
    },
    {
      name: "Created Date",
      label: "Join Date",
      value: loanData.createdAt
        ? new Date(selectedLoan.loanData.createdAt).toLocaleDateString("en-GB")
        : "N/A",
    },
  ];

    const tableData = itemData?.map((item:any, index:number) => ({
    id: index + 1, // S.NO
    tagNo: item?.tagId, // S.NO
    metal: item?.metalName,
    Purity: item?.purityName,
    "item": item?.itemName,
    "Net wt": item?.netWt,
    "Gross wt": item?.grossWt,
    LockerName: item?.lockerName,
  }));

    const coloums = [
    { id: "id", label: "S.NO" },
    { id: "tagNo", label: "Tag.No" },
    { id: "metal", label: "Metal" },
    { id: "Purity", label: "Purity" },
    { id: "item", label: "Item" },
    { id: "Net wt", label: "Net WT" },
    { id: "Gross wt", label: "Gross wt" },
    { id: "LockerName", label: "Locker Name" },
  ];


  return (
    <>
      <Page>
        <Box
          px={5}
          alignItems={"center"}
          sx={{
            backgroundColor: "white",
            padding: 3,
            margin: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
            Customer Details
          </Typography>
          <Grid container spacing={2}>
            {fields.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    padding: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "black",
                      mb: 0.5,
                      font: "500",
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {item.name === "img" ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "start",
                          padding: 1,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={typeof item.value === "string" ? item.value : ""}
                          alt={item.label}
                          style={{
                            width: "100px",
                            height: "80px",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    ) : (
                      item.value || "-"
                    )}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          px={5}
          alignItems={"center"}
          sx={{
            backgroundColor: "white",
            padding: 3,
            margin: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
            Item Details
          </Typography>

          <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
                    <SubTable
                      coloums={coloums}
                      data={tableData}
                      hidePagination={true}
                    />
                  </Box>
        </Box>

        <Box
          px={5}
          alignItems={"center"}
          sx={{
            backgroundColor: "white",
            padding: 3,
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
                <Box
                  sx={{
                    padding: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "black",
                      mb: 0.5,
                      font: "500",
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {item.value || "-"}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Page>
    </>
  );
}

export default ViewLoanAccounts;
