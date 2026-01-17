import { SvgColor } from "../components/svg-color";


export const icon = (name: string) => (
  <SvgColor
    width="100%"
    height="100%"
    src={name}
  />
);

export const navData = [
  {
    title: "Dashboard",
    path: "/",
    icon: "dashboard",
  },
  {
    title: "Masters",
    path: "/masters",
    icon:"masters",
    children: [
      {
        title: "Metal",
        path: "/masters/metal",
        icon: icon("ic-list"),
      },
      {
        title: "Purity",
        path: "/masters/purity",
        icon: icon("ic-plus"),
      },
      {
        title: "Metal Rate",
        path: "/masters/metalrate",
        icon: icon("ic-upload"),
      },
      {
        title: "Department",
        path: "/masters/department",
        icon: icon("ic-plus"),
      },
      {
        title: "Notification Setup",
        path: "/masters/topup",
        icon: icon("ic-upload"),
      },
      {
        title: "Item Creation",
        path: "/masters/itemcreation",
        icon: icon("ic-plus"),
      },
      {
        title: "User Role",
        path: "/masters/userrole",
        icon: icon("ic-upload"),
      },
      // {
      //   title: "User Access",
      //   path: "/masters/useraccess",
      //   icon: icon("ic-upload"),
      // },
      {
        title: "Loan Creation",
        path: "/masters/loancreate",
        icon: icon("ic-upload"),
      },
      {
        title: "View Loan",
        path: "/masters/loans",
        icon: icon("ic-upload"),
      },
      {
        title: "Interest Creation",
        path: "/masters/interestcreation",
        icon: icon("ic-upload"),
      },
      {
        title: 'Create Employee',
        path: '/masters/createemployee',
        icon: icon('ic-upload'),
      },
      {
        title: 'View Employee',
        path: '/masters/viewemployee',
        icon: icon('ic-upload'),
      },
      // {
      //   title: 'Daily Cash Update',
      //   path: '/masters/daily-cash-update',
      //   icon: icon('ic-upload'),
      // },
      {
        title: 'Locality',
        path: '/masters/locality',
        icon: icon('ic-upload'),
      },
    ]
  },
  {
    title: "Income",
    path: "/income",
    icon: "expense",
    children: [
      {
        title: "Income Creation",
        path: "/income/createincome",
        icon: icon("ic-list"),
      },
      // {
      //   title: "Sub Income ", 
      //   path: "/income/subincome",
      //   icon: icon("ic-plus"),
      // },
      // {
      //   title: "Income Entries",
      //   path: "/income/income-entries",
      //   icon: icon("ic-plus"),
      // },
    ],
  },
  {
    title: "Expense",
    path: "/expense",
    icon: "expense",
    children: [
      {
        title: "Expense Creation",
        path: "/expense/createexpense",
        icon: icon("ic-list"),
      },
      {
        title: "Sub Expense ",
        path: "/expense/subexpense",
        icon: icon("ic-plus"),
      },
      {
        title: "Expense Entries",
        path: "/expense/expense-entries",
        icon: icon("ic-plus"),
      },
    ],
  },
  {
    title: "Manage Loan",
    path: "/manageloan",
    icon:"manageLoan",
    children: [
      {
        title: " New Loans",
        path: "/manageloan/new-loan",
        icon: icon("ic-list"),
      },
      {
        title: "Existing Loans",
        path: "/manageloan/existingloan",
        icon: icon("ic-plus"),
      },
      {
        title: "Loan Top up",
        path: "/manageloan/topup",
        icon: icon("ic-plus"),
      },
      {
        title: "Loan Top up History",
        path: "/manageloan/topup-history",
        icon: icon("ic-plus"),
      },
      {
        title: "Loan Closure",
        path: "/manageloan/loan-closure",
        icon: icon("ic-plus"),
      },
      {
        title: "Loan Closure History",
        path: "/manageloan/loan-closure-history",
        icon: icon("ic-plus"),
      },
    ],
  },
  {
    title: "Customer",
    path: "/customer",
    icon: "customer",
    children: [
      // {
      //   title: "Customer Overview",
      //   path: "/customer/overview",
      //   icon: icon("ic-list"),
      // },
      {
        title: "Existing Customers",
        path: "/customer/existingcustomer",
        icon: icon("ic-plus"),
      },
  
     
    ],
  },
  {
    title: "Locker",
    path: "/locker",
    icon: "locker",
    children: [
      {
        title: "Lockers",
        path: "/locker/lockers",
        icon: icon("ic-list"),
      },
      {
        title: "Locker Transfer",
        path: "/locker/locker-transfer",
        icon: icon("ic-plus"),
      },
      {
        title: "Locker Settlement",
        path: "/locker/locker-settelment",
        icon: icon("ic-plus"),
      },
    ],
  },
  {
    title: "Payment",
    path: "/payment",
    icon: "payment",
    children: [
      {
        title: "Manage Payment",
        path: "/payment/managepayment",
        icon: icon("ic-plus"),
      },
      {
        title: "Interest Payment",
        path: "/payment/interest-payment",
        icon: icon("ic-plus"),
      },
      {
        title: "Overdue Payment",
        path: "/payment/overdue-payment",
        icon: icon("ic-plus"),
      },
      {
        title: "Charges Payment",
        path: "/payment/charges-payment",
        icon: icon("ic-plus"),
      },
      {
        title: "Principal Payment",
        path: "/payment/principal-payment",
        icon: icon("ic-plus"),
      },
      {
        title: "Pre Close Payment",
        path: "/payment/pre-close-payment",
        icon: icon("ic-plus"),
      },
      {
        title: "Principal Amount Adjustment",
        path: "/payment/principal-amount",
        icon: icon("ic-plus"),
      },
      {
        title: "Principal Amount Adjustment History",
        path: "/payment/principal-history",
        icon: icon("ic-plus"),
      },
    ]
  },
  {
    title: "Reports",
    path: "/reports",
    icon: "inventoryReport",
    children: [
      {
        title: "Overdue Report",
        path: "/reports/overduereport",
        icon: icon("ic-list"),
      },
      {
        title: "Income Expenses Report",
        path: "/reports/income-expenses-report",
        icon: icon("ic-list"),
      },
      {
        title: "Loan Account Report",
        path: "/reports/loan-account-report",
        icon: icon("ic-list"),
      },
      {
        title: "Cash Flow Report",
        path: "/reports/cash-flow-report",
        icon: icon("ic-list"),
      },
      {
        title: "Payment Mode",
        path: "/reports/payment-mode-report",
        icon: icon("ic-list"),
      },
      {
        title: "Stock Ledger",
        path: "/reports/stock-ledger-report",
        icon: icon("ic-list"),
      },
      {
        title: "Payment Report",
        path: "/reports/payment-report",
        icon: icon("ic-list"),
      },
    
    ]
  },
  // {
  //   title: "Inventory Reports",
  //   path: "/inventoryreports",
  //   icon: "inventoryReport",
  //   children: [
  //     {
  //       title: "Item Wise Report",
  //       path: "/inventoryreports/itemwisereports",
  //       icon: icon("ic-list"),
  //     },
  //     {
  //       title: "Metal Wise Report",
  //       path: "/inventoryreports/metalwisereports",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Day Book Report",
  //       path: "/inventoryreports/daybookreport",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Stock Ledger",
  //       path: "/inventoryreports/stockledger",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Recovery Item",
  //       path: "/inventoryreports/recoveryitem",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Account Closure",
  //       path: "/inventoryreports/accountsclosure",
  //       icon: icon("ic-plus"),  
  //     },
  //     {
  //       title: "OverDue Report",
  //       path: "/inventoryreports/overduereport",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Loan History",
  //       path: "/inventoryreports/loanhistory",
  //       icon: icon("ic-plus"),
  //     },
   
  //     {
  //       title: "Item History",
  //       path: "/inventoryreports/itemhistory",
  //       icon: icon("ic-plus"),
  //     },
      
  //   ],
  // },
  // {
  //   title: "Account Reports",
  //   path: "/accountreports",
  //   icon:"accountReport",
  //   children: [
  //     {
  //       title: "Payment Ledger Report",
  //       path: "/accountreports/paymentledger",
  //       icon: icon("ic-list"),
  //     },
  //     {
  //       title: "Transaction Report",
  //       path: "/accountreports/transactionreports",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Loan Account Report",
  //       path: "/accountreports/loanaccountreport",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Interest Collection",
  //       path: "/accountreports/interestcollection",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Customer Report",
  //       path: "/accountreports/customerreport",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Account Report",
  //       path: "/accountreports/loanreport",
  //       icon: icon("ic-plus"),  
  //     },
  //     {
  //       title: "CashFlow Report",
  //       path: "/accountreports/cashflowreport",
  //       icon: icon("ic-plus"),
  //     },
  //     {
  //       title: "Income & Expenses",
  //       path: "/accountreports/expensesincome",
  //       icon: icon("ic-plus"),
  //     },
     
  //   ],
  // },
  {
    title: "Settings",
    path: "/settings",
    icon: "settings",
    children: [
      {
        title: "Branch",
        path: "/settings/branch",
        icon: icon("ic-list"),
      },
      {
        title: "Organisation",
        path: "/settings/organisation",
        icon: icon("ic-plus"),
      },
      {
        title: "Menu",
        path: "/settings/menu",
        icon: icon("ic-plus"),
      },
      {
        title: "Sub Menu",
        path: "/settings/sub-menu",
        icon: icon("ic-plus"),
      },
      {
        title: "Legal & Policies",
        path: "/settings/legal-policies",
        icon: icon("ic-plus"),
      },
    ],
  },
];
