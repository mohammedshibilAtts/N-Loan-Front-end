import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import FindUser from "../../findUser/findUser";
import { useEffect, useState } from "react";

import UserDetails from "./loanDetails";
import SettelementDetails from "./settelementDetails";
import { Grid } from "@mui/material";
import { Toast } from "../../../components/toast/toast";
import { userInfo } from "../../../const";
import { useCloseType } from "../../../hooks/commonhooks/closedHook";
import { useLoanAccount } from "../customer/loanAccountHooks";

function LoanClosure() {
  // const [userData, setUserData] = useState<{
  //   username: string;
  //   mobile: number;
  // } | null>({ mobile: userInfo.mobile, username: userInfo.username });
  const userData = { mobile: userInfo?.mobile, username: userInfo.username };
  const [customerData, setCustomerData] = useState<{
    customerName: string;
    mobile: string;
    address: string;
    img: string;
  }>();
  const [closureData, setClosureData] = useState<{
    settlementDate: Date | null;
    additionalCharges: number;
    closedThrough: string;
    remark: string;
    closedBy: "";
    closerImg: any;
  }>({
    settlementDate: null,
    additionalCharges: 0,
    closedThrough: "",
    remark: "",
    closedBy: "",
    closerImg: "",
  });
  const [loanId, setLoanId] = useState<string>("");

  const { GetClosedTypes, closedType } = useCloseType();
  const { fetchLoanById, selectedLoan } = useLoanAccount();
  const { loanClose, loading } = useLoanAccount();

  useEffect(() => {
    GetClosedTypes();
  }, []);

  const handleCustomerId = (data: any) => {
    setCustomerData({
      customerName: `${data.firstName}${data.lastName}`,
      mobile: data?.mobile,
      address: data.address,
      img: data.img,
    });
  };

  const handleLoanId = (id: string) => {
    setLoanId(id);
    fetchLoanById(id);
  };

  const handleSubmit = () => {
    if (
      closureData.closedThrough === null ||
      closureData.closedThrough === undefined
    ) {
      Toast.show({
        message: "Please select a 'Closed Through' option.",
        type: "error",
      });
      return;
    }

    if (!closureData.settlementDate) {
      Toast.show({
        message: "Settlement Date is required",
        type: "error",
      });
      return;
    }
    if (!userInfo?.id) {
      Toast.show({
        message: "Something went wrong. Please log in again and try.",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    if (closureData.closerImg) {
      formData.append("closerImg", closureData.closerImg);
    }
    // const data: any = {
    //   procedureName: "loanClosure",
    const data = {
      loanId: selectedLoan?.loanData?._id,
      closureData: {
        loanStatus: 1,
        closedThrough: Number(closureData.closedThrough),
        additionalCharges:
          selectedLoan.additionalCharges + closureData.additionalCharges,
        closedBy: userInfo?.id,
        settlementDate: closureData?.settlementDate,
      },
    };

    formData.append("data", JSON.stringify(data));

    loanClose(formData);
  };

  return (
    <>
      <Box px={6}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Manage Loan" },
                { label: "Loan Closure", active: true },
              ]}
            />
          </Stack>
        </Stack>

        <FindUser
          title={"Loan Closure"}
          handleCustomerId={handleCustomerId}
          handleLoanId={handleLoanId}
          loanType={2}
        />

        {loanId && (
          <>
            <UserDetails
              accountData={selectedLoan?.loanData}
              data={customerData}
            />
            <SettelementDetails
              accountData={selectedLoan?.loanData}
              itemData={selectedLoan?.items?.item}
              setClosureData={setClosureData}
              closureData={closureData}
              customerData={customerData}
            />

            <Box sx={{ flexGrow: 1, py: 2 }}>
              <Grid container spacing={2}>
                {/* Left Side */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <InputLabel
                      htmlFor="paymentDate"
                      className="mb-2 flex items-center gap-1"
                      style={{ color: "#09090F" }}
                    >
                      Closed Through
                      <span className="text-[#F04438] text-lg">*</span>
                    </InputLabel>
                    <Autocomplete
                      options={closedType}
                      getOptionLabel={(option: any) => option.name || ""}
                      onChange={(_, newValue) => {
                        setClosureData((prev) => ({
                          ...prev,
                          closedThrough: String(newValue?.no) || "",
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                      sx={{ mb: 2 }}
                    />

                    <InputLabel
                      htmlFor="paymentDate"
                      className="mb-2 flex items-center gap-1"
                      style={{ color: "#09090F" }}
                    >
                      Remark
                    </InputLabel>
                    <TextField variant="outlined" fullWidth />
                  </Card>
                </Grid>

                {/* Right Side */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <InputLabel
                      htmlFor="paymentDate"
                      className="mb-1 flex items-center gap-1"
                      style={{ color: "#09090F" }}
                    >
                      Staff Name
                      <span className="text-[#F04438] text-lg">*</span>
                    </InputLabel>
                    <TextField
                      value={
                        userData?.username
                          ? userData?.username.charAt(0).toUpperCase() +
                            userData?.username.slice(1)
                          : ""
                      }
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <InputLabel
                      htmlFor="paymentDate"
                      className="mb-2 flex items-center gap-1"
                      style={{ color: "#09090F" }}
                    >
                      Staff Number
                      <span className="text-[#F04438] text-lg">*</span>
                    </InputLabel>
                    <TextField
                      value={userData?.mobile}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Grid
              item
              sx={{ mt: 3, py: 2, display: "flex", justifyContent: "end" }}
            >
              <Button
                sx={{
                  backgroundColor: "#F5F5F5",
                  color: "#000",
                  textTransform: "none",
                  px: 3,
                }}
                type="button"
                // variant="outlined"

                className="border-2 border-gray-800 text-[#344054] font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "black",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
                onClick={handleSubmit}
                style={{ background: "black" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Save"
                )}
              </Button>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}

export default LoanClosure;
