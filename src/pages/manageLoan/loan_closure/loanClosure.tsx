import {
  Autocomplete,
  Box,
  Button,
  Card,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import FindUser from "../../findUser/findUser";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../../../store/actions";
import {
  CLOSE_TYPES,
  ITEM_DETAILS_LIST,
  LOAN_ACC_LIST,
  LoanAccount_UPDATE_RES,
} from "../../../store/actionTypes";
import API_ENDPOINTS from "../../../services/endpoints";
import { itemType } from "../loanTopUp/loanTopUp";
import UserDetails from "./loanDetails";
import SettelementDetails from "./settelementDetails";
import { Grid } from "@mui/material";
import { Toast } from "../../../components/toast/toast";

function LoanClosure() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userInfo);
  // const [userData, setUserData] = useState<{
  //   username: string;
  //   mobile: number;
  // } | null>({ mobile: userInfo.mobile, username: userInfo.username });
  const userData = { mobile: userInfo.mobile, username: userInfo.username };
  const [loanAccountData, setLoanAccountData] = useState<any>();
  const [itemData, setItemData] = useState<itemType[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [customerData, setCustomerData] = useState<{
    customerName: string;
    mobile: string;
    address: string;
    img: string
  }>();
  const [closureData, setClosureData] = useState<{
    settlementDate: Date | null;
    additionalCharges: number;
    closedThrough: string;
    remark: string;
    closedBy: "";
    closerImg: any
  }>({
    settlementDate: null,
    additionalCharges: 0,
    closedThrough: "",
    remark: "",
    closedBy: "",
    closerImg: ""
  });
  const [loanId, setLoanId] = useState<string>("");
  const [closedType, setClosedType] = useState<any>([]);

  const handleCustomerId = (data: any) => {
    setCustomerId(data._id);
    setCustomerData({
      customerName: `${data.firstName}${data.lastName}`,
      mobile: data.mobile,
      address: data.address,
      img: data.img
    });
  };

  const handleBranchId = (id: string) => {
    setBranchId(id);
  };

  const handleLoanId = (id: string) => {
    setLoanId(id);
    dispatch(
      apiRequest(ITEM_DETAILS_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "itemDetail",
          filters: {
            branchId,
            customerId,
            accountId: id,
          },
          populateFields: ["metalId", "purityId", "itemId"],
        },
      })
    );
    dispatch(
      apiRequest(LOAN_ACC_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findCloseAccount",
        params: {
          tableName: "loanAccount",
          id,
          populateFields: ["loanId"],
        },
      })
    );
  };

  const { itemDetails, accountData, closedList, closedRes } = useSelector(
    (states: any) => ({
      itemDetails: states[ITEM_DETAILS_LIST]?.data,
      accountData: states[LOAN_ACC_LIST]?.data,
      closedList: states[CLOSE_TYPES]?.data,
      closedRes: states[LoanAccount_UPDATE_RES]?.data,
    })
  );

  useEffect(() => {
    dispatch(
      apiRequest(CLOSE_TYPES, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "closedThrough",
        },
      })
    );
  }, []);

  useEffect(() => {
    if (itemDetails?.success) {
      setItemData(itemDetails.data.data);
    }
    if (accountData?.success) {
      setLoanAccountData(accountData.data);
    }
    if (closedList?.success) {
      setClosedType(closedList.data.data);
    }

  }, [itemDetails, accountData, closedList]);

  useEffect(() => {
    if (closedRes) {
      // setLoading(false)
      if (closedRes?.success) {
        return Toast.show({ message: "Account Closed Successfuly", type: "success" });
      }
      return Toast.show({ message: closedRes.message, type: "error" });

    }
  }, [closedRes])

  const handleSubmit = () => {
    if (closureData.closedThrough === null || closureData.closedThrough === undefined) {
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
      return

    }
    if (!userInfo?.id) {
      Toast.show({
        message: "Something went wrong. Please log in again and try.",
        type: "error",
      });
      return
    }


    const formData = new FormData();
    if (closureData.closerImg) {
      formData.append("closerImg", closureData.closerImg);
    }
    const data: any = {
      procedureName: "loanClosure",
      params: {
        tableName: "loanAccount",
        id: loanAccountData._id,
        data: {
          loanStatus: 1,
          closedThrough: Number(closureData.closedThrough),
          additionalCharges: loanAccountData.additionalCharges + closureData.additionalCharges,
          closedBy: userInfo?.id,
          settlementDate: closureData?.settlementDate
        },
      },
    };
    formData.append("data", JSON.stringify(data));
    formData.append("procedureName", data.procedureName);
    dispatch(
      apiRequest(LoanAccount_UPDATE_RES, "postFile", API_ENDPOINTS.SP_FILE.POST_FILE('loanClousure'), formData)
    );



    return
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
          handleBranchId={handleBranchId}
          handleLoanId={handleLoanId}
          loanType={2}
        />

        {loanId && (
          <>
            <UserDetails accountData={loanAccountData} data={customerData} />
            <SettelementDetails
              accountData={loanAccountData}
              itemData={itemData}
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
                        <TextField
                          {...params}
                          variant="outlined"
                        />
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
              >
                Save
              </Button>
            </Grid>
          </>
        )}

      </Box>
    </>
  );
}

export default LoanClosure;
