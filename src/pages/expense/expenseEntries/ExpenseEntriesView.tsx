import { Typography, Box, Grid } from "@mui/material";
import { spliceDecimals } from "../../../const";

function ExpenseEntriesView({ data }: { data: any }) {
  const fields: any[] = [
    {
      name: "expenseDate",
      label: "Expense Date",
      value: data?.expenseDate
        ? new Date(data.expenseDate).toLocaleDateString("en-GB")
        : "-",
    },
    // {
    //   name: "expenseTime",
    //   label: "Time",
    //   value: data?.expenseDate
    //     ? new Date(data.expenseDate).toLocaleTimeString("en-GB", {
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: true,
    //       }).toUpperCase()
    //     : "-",
    // },

    {
      name: "branch",
      label: "Branch",
      value: data?.branch?.branchName || "-",
    },
    {
      name: "expense",
      label: "Expense",
      value: data?.expense?.expenseName || "-",
    },
    {
      name: "subExpense",
      label: "Sub Expense",
      value: data?.subExpense?.name || "-",
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      value: data?.paymentMethod?.mode || "-",
    },
    {
      name: "paymentProvider",
      label: "Payment Provider",
      value: data?.paymentProvider?.providerName || "-",
    },
    {
      name: "amount",
      label: "Amount",
      value: `₹${spliceDecimals(data?.amount, 2)}` || "-",
    },
    {
      name: "remarks",
      label: "Remarks",
      value: data?.remarks || "-",
    },
    {
      name: "createdAt",
      label: "Created At",
      value: data?.createdAt
        ? new Date(data.createdAt)
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .toUpperCase()
        : "-",
    },
  ];

  return (
    <>
      <Box
        px={5}
        alignItems={"center"}
        sx={{
          backgroundColor: "white",
          padding: 2,
          margin: 2,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2}>
          {fields.map((item, index) => (
            <Grid item xs={12} sm={6} md={12} key={index}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "black", mb: 0.5, font: "500" }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", fontSize: "14px" }}
                >
                  {item.value || "-"}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default ExpenseEntriesView;
