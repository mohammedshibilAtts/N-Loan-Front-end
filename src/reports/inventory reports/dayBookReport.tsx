import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../config-global";
import { DataTable } from "../../components/datatable/datatableComp";
import API_ENDPOINTS from "../../services/endpoints";
import { INTEREST_COLLECTION_REPORTS, CASH_FLOW,STOCK_LEDGER } from "../../store/actionTypes";
import ControlledAccordions from "../../components/accordion/accordion";
import { useState } from "react";
import { Box, Card, Typography } from "@mui/material";

const list = [
  {
    title: "Interest Payment",
    procedureName:"interestCollection",
    tableName: "loanAccount",
    table_type:"reports-interstCollectionreport",
    populateFields:[],
    id: "1",
    actionType: INTEREST_COLLECTION_REPORTS,
  },
  {
    title: "Cash Flow",
    procedureName:"cashFlow",
    tableName: "Payment",
    table_type:"reports-cashFlow",
    populateFields:[],
    id: "2",
    actionType: CASH_FLOW,
  },
  // {
  //   title: "Expenses",
  //   procedureName:"find",
  //   tableName: "expenseEntries",
  //   table_type:"expenseEntries-table",
  //   populateFields:["branch", "expense", "subExpense", "paymentMethod", "paymentProvider"],
  //   id: "3",
  //   actionType: EXPENSE_ENTRIES_TABLE,
  // },
  {
    title: "Item Closing",
    procedureName:"stockLedger",
    tableName: "loanAccount",
    table_type:"reports-stockLedger",
    populateFields:[],
    id: "3",
    actionType: STOCK_LEDGER,
  },
];

export default function DayBookReport() {
  const [expanded, setExpanded] = useState<false | string>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <>
      <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <Box display="flex" alignItems="center" mb={5}>
                    <Typography variant="h6" flexGrow={1} marginLeft={2}>
                    <span className='text-[#737791]'>Inventory Reports</span> / Day Book
                    </Typography>
                   
                </Box>

      
        {list.map((data) =>(
            <Card sx={{mx:3,my:2}}>
          <ControlledAccordions
            panelId={data.id}
            children={
              <DataTable
                style={{border: 'none', boxShadow: 'none' }} 
                actionType={data.actionType}
                endpoint={API_ENDPOINTS.SP.POST}
                procedureName={data.procedureName}
                populateFields={data.populateFields}
                tableName={data.tableName}
                table_type={data.table_type}
                exportOptions={true}
          
              />
            }
            expanded={expanded}
            title={data.title}
            key={data.id}
            handleChange={handleChange}
          />
      </Card>
        ))}
    </>
  );
}
