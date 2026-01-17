import { Box, Stack } from "@mui/material";
import FindUser from "../../findUser/findUser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { apiClear, apiRequest } from "../../../store/actions";
import API_ENDPOINTS from "../../../services/endpoints";
import { ITEM_LIST, LOAN_ACC_LIST } from "../../../store/actionTypes";
import { itemType } from "../../manageLoan/loanTopUp/loanTopUp";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import Payment from "../interestPayment/payment";
import CustomerDetails from "../interestPayment/customerDetails";

function PreClosePayment() {
  const dispatch = useDispatch();

  const [itemData, setItemData] = useState<itemType[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  // const [loanId, setLoanId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [loanAccountData, setLoanAccountData] = useState<any>();

  const [customerData, setCustomerData] = useState<{
    customerName: string;
    mobile: string;
  }>();

  const handleCustomerId = (data: any) => {
    setCustomerId(data._id);
    setCustomerData({
      customerName: `${data.firstName}${data.lastName}`,
      mobile: data.mobile,
    });
  };


  const handleLoanId = (id: string) => {
    // setLoanId(id);
    dispatch(
      apiRequest(ITEM_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: {
          tableName: "itemDetail",
          filters: {
            customerId,
            accountId: id,
          },
          populateFields: ["metalId", "purityId", "itemId"],
        },
      })
    );
    dispatch(
      apiRequest(LOAN_ACC_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findById",
        params: {
          tableName: "loanAccount",
          id,
          filters: { branchId },
          populateFields: ["loanId"],
        },
      })
    );
  };
  const handleBranchId = (id: string) => {
    setBranchId(id);
  };

  const { itemDetails, accountData } = useSelector((states: any) => ({
    itemDetails: states[ITEM_LIST]?.data,
    accountData: states[LOAN_ACC_LIST]?.data,
  }));

  useEffect(() => {
    if (itemDetails?.success) {
      setItemData(itemDetails.data.data);
    }
    if (accountData?.success) {
      setLoanAccountData(accountData.data);
    }
  }, [itemDetails, accountData]);


  useEffect(() => {
    dispatch(apiClear(ITEM_LIST));
    setItemData([]);
    setLoanAccountData(null);
    setCustomerData({
      customerName: "",
      mobile: "",
    });
    setCustomerId("");
    setBranchId("");
    return () => {
      dispatch(apiClear(LOAN_ACC_LIST));

    };
  }, [dispatch]);

  return (
    <>
      <Box px={5}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Payment" },
                { label: "Pre Close Payment", active: true },
              ]}
            />
          </Stack>
        </Stack>
        <FindUser
          title={"Pre Close Payment"}
          handleCustomerId={handleCustomerId}
          handleBranch={handleBranchId}
          handleLoanId={handleLoanId}
        />

        {accountData && (
          <>
            <CustomerDetails
              accountData={loanAccountData}
              data={customerData}
            />

            <Payment customerId={customerId} loanId={loanAccountData?._id} itemData={itemData} accountData={loanAccountData} defaultPaymentBasis={5} />
          </>
        )}
      </Box>
    </>
  );
}

export default PreClosePayment;
