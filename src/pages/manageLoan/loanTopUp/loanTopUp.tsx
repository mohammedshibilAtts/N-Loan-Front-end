import { Stack, Box } from "@mui/material";
import { useState } from "react";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import FindUser from "../../findUser/findUser";
import LoanTopUpDetails from "./topUpDetails";
import { useLoanAccount } from "../customer/loanAccountHooks";

export interface itemType {
  _id: string;
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
  const [customerData, setCustomerData] = useState<{
    customerName: string;
    mobile: string;
  }>();

  const { fetchLoanById, selectedLoan } = useLoanAccount();

  const handleCustomerId = (data: any) => {
    setCustomerData({
      customerName: `${data.firstName}${data.lastName}`,
      mobile: data.mobile,
    });
  };
  const handleLoanId = (id: string) => {
    fetchLoanById(id);
  };

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
          handleLoanId={handleLoanId}
        />

        {selectedLoan && (
          <LoanTopUpDetails
            accountData={selectedLoan?.loanData}
            data={{
              customerName: customerData?.customerName,
              customerMobile: customerData?.mobile,
            }}
            tableData={selectedLoan?.items?.item}
            totalAmount={selectedLoan?.items?.totalAmount}
          />
        )}
      </Box>
    </>
  );
}

export default LoanTopUp;
