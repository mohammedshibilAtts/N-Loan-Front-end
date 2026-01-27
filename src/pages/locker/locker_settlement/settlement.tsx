import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { SettlementProvider } from "./settlementProvider";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import SubTable from "../../../components/subTable/subTable";
import { useLockerSettlement } from "./lockerSettlHooks";
import { formatDateTime } from "../../../utils/dateFormate";
import { useEffect, useState } from "react";

dayjs.locale("en");

export default function ExpenseEntriesTable() {

        const [isFormOpen, setIsFormOpen] = useState(false);
        const [lockerData,setLockerData]=useState({})

  const { data, loading, table } = useLockerSettlement();

  useEffect(() => {
    table({});
  }, []);

  const columns = [
    { id: "id", label: "S.No" },
    { id: "lockerName", label: "Locker Name" },
    { id: "amount", label: "Amount" },
    { id: "lastPaidDate", label: "Last Paid Date" },
    { id: "action", label: "Last Paid Date" },
  ];

  const handlePay=(row:any)=>{
        setIsFormOpen(true);
        setLockerData(row)
  }

  const tableData = data.map((item, index) => ({
    id: index + 1,
    _id: item?._id,
    lockerName: item?.lockerName,
    amount: item?.Amount,
    lastPaidDate: formatDateTime(item?.lastPaidDate),
    action: (<>
    <Button onClick={()=>handlePay(item)} sx={{background:"black",color:"white"}}>
        Pay
    </Button>
    </>),
  }));

      const handleFormSubmitSuccess = () => {
        setIsFormOpen(false);
      
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
       
    };
  return (
    <>
      <Helmet>
        <title>{`Expense Entries - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Breadcrumb
            items={[{ label: "Locker" }, { label: "settlement", active: true }]}
          />
        </Box>

        <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
          <SubTable
            coloums={columns}
            data={tableData}
            loading={loading}
            hidePagination={true}
            // onEdit={handleEdit}
            // onView={handleView}
            // onDelete={handleDelete}
            // page={page}
            // rowsPerPage={rowsPerPage}
            // count={totalCount}
            // onPageChange={onPageChange}
            // onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>

        {isFormOpen && (
          <SettlementProvider
            onClose={handleCloseForm}
            lockerData={lockerData}
          />
        )}
      </DashboardContent>
    </>
  );
}
