import { Box, Stack } from "@mui/material";
import FindUser from "../../findUser/findUser";
import { useEffect, useState } from "react";
import CustomerDetails from "../customerDetails";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import Payment from "../payment";
import { usePayment } from "../paymentHooks";

function OverduePayment() {
  const {
    fetchLoanDetails,
    loanAccountData,
    itemData,
    setLoanAccountData,
    setItemData
  } = usePayment();

  const [customerId, setCustomerId] = useState<string>("");

  const [customerData, setCustomerData] = useState<{
    customerName: string;
    mobile: string;
  }>();

  const handleCustomerId = (data: any) => {
    setCustomerId(data._id);
    setCustomerData({
      customerName: `${data.firstName} ${data.lastName}`,
      mobile: data.mobile,
    });
  };

  const handleLoanId = (id: string) => {
    fetchLoanDetails(id);
  };

  useEffect(() => {
    return () => {
      setItemData([]);
      setLoanAccountData(null);
      setCustomerData({
        customerName: "",
        mobile: "",
      });
      setCustomerId("");
    };
  }, []);

  return (
    <>
      <Box px={5}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Breadcrumb
              items={[
                { label: "Payment" },
                { label: "Overdue Payment", active: true },
              ]}
            />
          </Stack>
        </Stack>
        <FindUser
          title={"Overdue Payment"}
          handleCustomerId={handleCustomerId}
          handleLoanId={handleLoanId}
        />

        {loanAccountData && (
          <>
            <CustomerDetails
              accountData={loanAccountData}
              data={customerData}
            />

            <Payment
              customerId={customerId}
              loanId={loanAccountData?._id}
              itemData={itemData}
              accountData={loanAccountData}
              defaultPaymentBasis={2}
            />
          </>
        )}
      </Box>
    </>
  );
}

export default OverduePayment;
