import { Stack, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { useDispatch, useSelector } from "react-redux";
import { apiClear, apiRequest } from "../../../store/actions";
import { ITEM_LIST, LOAN_ACC_LIST } from "../../../store/actionTypes";
import API_ENDPOINTS from "../../../services/endpoints";
import FindUser from "../../findUser/findUser";
import LoanTopUpDetails from "./topUpDetails";

export interface itemType {
  _id:string,
  metalId: {
    _id: string;
    metalName: string;
  };
  purityId: {
    _id: string;
    purityName: string;
  };
  itemId: {
    _id: string;
    itemName: string;
  };
  grossWt: number;
  netWt: number;
  quantity: number;
}

function LoanTopUp() {
  const dispatch = useDispatch();
  const [itemData, setItemData] = useState<itemType[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [customerId, setCustomerId] = useState<string>("");
  // const [loanId, setLoanId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [loanAccountData, setLoanAccountData] = useState<any>();
  const [customerData, setCustomerData] = useState<{
    customerName: string;
    mobile: string;
  }>();

  useEffect(() => {
    dispatch(apiClear(ITEM_LIST));
    dispatch(apiClear(LOAN_ACC_LIST));
    setItemData([]);
    setTotalAmount(0);
    setCustomerId("");
    setBranchId("");
    setLoanAccountData({});
    setCustomerData({ customerName: "", mobile: "" });
    return () => {
      dispatch(apiClear(ITEM_LIST));
      dispatch(apiClear(LOAN_ACC_LIST));
      setItemData([]);
      setTotalAmount(0);
      setCustomerId("");
      setBranchId("");
      setLoanAccountData({});
      setCustomerData({ customerName: "", mobile: "" });
    };
  }, [dispatch]);

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
        procedureName: "findItemDetails",
        params: {
          tableName: "itemDetail",
          customerId,
          accountId: id,
          branchId,
        },
      })
    );
    dispatch(
      apiRequest(LOAN_ACC_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findById",
        params: {
          tableName: "loanAccount",
          id,
          populateFields: ["interestId"],
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
      setItemData(itemDetails.data.items);
      setTotalAmount(itemDetails.data.totalAmount);
    }
    if (accountData?.success) {
      setLoanAccountData(accountData.data);
    }
  }, [itemDetails, accountData]);

  return (
    <>
      <Box px={5}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Manage Loan" },
                { label: "Loan Topup", active: true },
              ]}
            />
          </Stack>
        </Stack>

        <FindUser
          title={"Loan Topup"}
          handleCustomerId={handleCustomerId}
          handleBranch={handleBranchId}
          handleLoanId={handleLoanId}
        />

        {accountData && (
          <LoanTopUpDetails
            accountData={loanAccountData}
            data={{
              customerName: customerData?.customerName,
              customerMobile: customerData?.mobile,
            }}
            tableData={itemData}
            totalAmount={totalAmount}
          />
        )}
      </Box>
    </>
  );
}

export default LoanTopUp;
