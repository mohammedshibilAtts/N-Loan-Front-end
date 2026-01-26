import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { CONFIG } from "../../../config-global";
import API_ENDPOINTS from "../../../services/endpoints";
import {
  EXPENSE_ENTRIES_DELETE_RES,
  EXPENSE_ENTRIES_TABLE,
  EXPENSE_ENTRIES_EDIT_RES,
} from "../../../store/actionTypes";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { apiRequest } from "../../../store/actions";
import { ConfirmationDialog } from "../../../layouts/components/confirmationDialog";

import dayjs from "dayjs";
import "dayjs/locale/en";
import { SettlementProvider } from "./settlementProvider";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { DataTableRefactored } from "../../../components/datatable/DataTableRefactored";
import SubTable from "../../../components/subTable/subTable";

dayjs.locale("en");

export default function ExpenseEntriesTable() {
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

        {/* <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
          <SubTable
            coloums={columns}
            data={tableData}
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box> */}
      </DashboardContent>
    </>
  );
}
