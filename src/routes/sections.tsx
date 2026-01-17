import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from '../layouts/auth';
import { DashboardLayout } from '../layouts/dashboard';
import DayBookReport from '../reports/inventory reports/dayBookReport';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../store/actions';
import { GET_USER_ACCESS } from '../store/actionTypes';
import API_ENDPOINTS from '../services/endpoints';
import InterestPayment from '../pages/payment/interestPayment/interestPayment';
import OverduePayment from '../pages/payment/overduePayment/overduePayment';
import ChargesPayment from '../pages/payment/chargesPayment/chargesPayment';
import PrincipalPayment from '../pages/payment/principalAmtPayment/principalPayment';
import PreClosePayment from '../pages/payment/preClosePayment/preClosePayment';
import IncomeExpensesReport from '../newReports/incomeExpensesReport';
import CashFlowReport from '../newReports/cashFlowReport';
import LoanClosureHistory from '../pages/manageLoan/loan_closure/loanClosureHistory';
import ViewLoanClosure from '../pages/manageLoan/loan_closure/viewLoanClosure';



// import CreateEmployee from '../pages/master/createEmployee/createEmployeeForm';
// import { METAL_CREATE_RES } from '../store/actionTypes';

// Lazy loading pages

// Masters
const HomePage = lazy(() => import('../pages/home'));
const Metal = lazy(() => import('../pages/master/metal/metalTable'));
const PurityTable = lazy(() => import('../pages/master/purity/purityTable'));
const DepartmentTable = lazy(() => import('../pages/master/department/departmentTable'))
const ItemCreationTable = lazy(() => import('../pages/master/itemCreation/itemCreationTable'))
const UserRole = lazy(() => import('../pages/master/userRole/userRoleTable'))
const TopupForm = lazy(() => import('../pages/master/topup/topup'))
const DaliyCashUpdate = lazy(() => import('../pages/master/dailyCashUpdate/dailyCashUpdate'))
const LocalityTable = lazy(() => import('../pages/master/locality/localityTable'))
const ViewLoan = lazy(() => import('../pages/loan/viewLoan'))
const EmployeeCreation = lazy(() => import('../pages/master/createEmployee/createEmployeeForm'))

// expense 
const ExpenseTable = lazy(() => import('../pages/expense/createExpense/createExpenseTable'))
const SubExpense = lazy(() => import('../pages/expense/subExpense/subExpenseTable'))

// income
const IncomeTable = lazy(() => import('../pages/income/createIncome/createIncomeTable'))

const BlogPage = lazy(() => import('../pages/blog'));
const UserPage = lazy(() => import('../pages/user'));


// const SignInPage = lazy(() => import('../pages/sign-in'));
const SignInPage = lazy(() => import('../sections/auth/sign-in-view'));
const ProductsPage = lazy(() => import('../pages/products'));



const BranchTable = lazy(() => import('../pages/settings/branch/branchTable'));
const Organisation = lazy(() => import('../pages/settings/organisation/organisationForm'));
const Page404 = lazy(() => import('../pages/page-not-found'));
// const NoAccessPage = lazy(() => import('../pages/403Page'));
const LoanCreationFormPage = lazy(() => import('../pages/loan/loanCreationPage'));

const InterestCreation = lazy(() => import('../pages/master/interestCreation/InterestCreation'));
const MetalRate = lazy(() => import('../pages/master/metalRate/MetalRate'));

const LoanTable = lazy(() => import('../pages/loan/loanTable'));

const Locker = lazy(() => import('../pages/settings/lockerCreation/lockerTable'))
const LockerFrom = lazy(() => import('../pages/settings/lockerCreation/lockerForm'))
const LockerTransfer = lazy(() => import('../pages/locker/locker_transfer/lockerTransfer'))
const Settlement = lazy(() => import('../pages/locker/locker_settlement/settlement'))

const ExpenseEntriesTable = lazy(() => import('../pages/expense/expenseEntries/expenseEntriesTable'));
const ViewEmployee = lazy(() => import('../pages/master/createEmployee/ViewEmployee'));
const EmployeeDetails = lazy(() => import('../pages/master/createEmployee/EmployeeDetails'));
const UserAccess = lazy(() => import('../pages/master/userAccess/userAccess'))
const LoanTopUp = lazy(() => import('../pages/manageLoan/loanTopUp/loanTopUp'))
const LoanTopUpHistory = lazy(() => import('../pages/manageLoan/loanTopUp/loanTopupHistory'))



// Manage Loan
const NewLoan = lazy(() => import('../pages/manageLoan/customer/newLoan'))
const ExistingLoanAccounts = lazy(() => import('../pages/manageLoan/existingLoans/ExistingLoanAccounts'))
const ViewLoanAccounts = lazy(() => import('../pages/manageLoan/existingLoans/ViewLoanAccounts'))
const LoanPdfView = lazy(() => import('../pdf/pdfView'))
const ClosurePdf = lazy(() => import('../pdf/loanclosurePdf'))



//Customer Overview
const CustomerOverview = lazy(() => import('../pages/customer overview/CustomerOverview'));
const ExistingCustomer = lazy(() => import('../pages/customer overview/ExistingCustomer'))
const CustomerCreation = lazy(() => import('../pages/manageLoan/customer/customerCreation'))



//payments 
const AddPayment = lazy(() => import('../pages/payment/interestPayment/interestPayment'))
const PaymentTable = lazy(() => import('../pages/payment/interestPayment/paymentTable'))
const PrincipalAmount = lazy(() => import('../pages/payment/principalPayment/principalAmount'))
const PrincipalAmountHistory = lazy(() => import('../pages/payment/principalPayment/principalAmountHistory'))
const LoanClosure = lazy(() => import('../pages/manageLoan/loan_closure/loanClosure'))

//Reports 
const ItemWiseReports = lazy(() => import('../reports/inventory reports/ItemWiseReports'))
const MetalWiseReports = lazy(() => import('../reports/inventory reports/MetalWiseReports'))
const LoanHistory = lazy(() => import('../reports/inventory reports/LoanHistory'))
const ItemHistory = lazy(() => import('../reports/inventory reports/ItemHistory'))
const CustomerHistory = lazy(() => import('../reports/accounts reports/CustomerHistory'))
const RecoveryItem = lazy(() => import('../reports/inventory reports/RecoveryItem'))
const AccountsClosure = lazy(() => import('../reports/inventory reports/AccountsClosure'))
const PaymentLedger = lazy(() => import('../reports/accounts reports/paymentLedger'))
const TransactionReports = lazy(() => import('../reports/accounts reports/transactionReports'))
// const OverDueReport = lazy(()=>import('../reports/inventory reports/OverDueReport'))
const OverDueReport = lazy(() => import('../newReports/overDueReport'))
const LoanReports = lazy(() => import('../reports/accounts reports/LoanReports'))
const LoanAccountReport = lazy(() => import('../newReports/loanAccountReport'))
const InterestCollection = lazy(() => import('../reports/accounts reports/InterestCollection'))
const StockLedger = lazy(() => import('../reports/inventory reports/StockLedger'))
const ExpensesIncome = lazy(() => import('../reports/accounts reports/ExpensesReport'))
const CashFlow = lazy(() => import('../reports/accounts reports/CashFlow'))
const MenuCreation = lazy(() => import('../pages/settings/menu/menuCreation'))
const SubMenuCreation = lazy(() => import('../pages/settings/submenu/submenu'))
const PaymentModeReport = lazy(() => import('../newReports/paymentModeReport'))
const StockLedgerReport = lazy(() => import('../newReports/stockLedgerReport'))
const PaymentReport = lazy(() => import('../newReports/paymentReport'))



// Loader Component
const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Protected Route for authenticated pages
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  //Using for userAccess
  const [navData, setNavData] = useState<any>([])

  const { getNavData } = useSelector(
    (states: any) => ({
      getNavData: states[GET_USER_ACCESS]?.data
    })
  );

  useEffect(() => {
    if (getNavData?.success) {
      setNavData(getNavData.data)
    }
  }, [getNavData])




  const accessToken = localStorage.getItem('accessToken');
  const currentPath = location.pathname;
  const isAllowed = navData.some((menu: any) => {
    if (menu.path === currentPath) return true;

    return menu.children?.some((child: any) => child.path === currentPath);
  });


  if (!accessToken) {
    localStorage.clear();
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAllowed) {
    // return (<NoAccessPage/>);
  }

  return children;
};

// Prevent logged-in users from accessing Sign-in Page
const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const accessToken = localStorage.getItem('accessToken');

  return accessToken ? <Navigate to="/" replace /> : children;
};

export function Router() {

  const token = localStorage.getItem('accessToken')

  const dispatch = useDispatch();
  //the userrole willbe dynamic
  useEffect(() => {
    if (token) {
      const data = {
        procedureName: "find",
        params: {
          tableName: "access",
        },
      };
      dispatch(apiRequest(GET_USER_ACCESS, "post", API_ENDPOINTS.SP.POST, data));
    }
  });


  return useRoutes([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <HomePage />, index: true },

        // masters
        { path: "masters/metal", element: <Metal /> },
        { path: "masters/purity", element: <PurityTable /> },
        { path: "masters/department", element: <DepartmentTable /> },
        { path: "masters/itemcreation", element: <ItemCreationTable /> },
        { path: "masters/topup", element: <TopupForm /> },
        { path: "masters/userrole", element: <UserRole /> },
        { path: "masters/useraccess", element: <UserAccess /> },
        { path: "masters/createemployee", element: <EmployeeCreation /> },
        { path: "masters/editemployee/:id", element: <EmployeeCreation /> },
        { path: "masters/viewemployee/:id", element: <EmployeeDetails /> },
        { path: "masters/viewemployee", element: <ViewEmployee /> },
        { path: "masters/interestcreation", element: <InterestCreation /> },
        { path: "masters/metalrate", element: <MetalRate /> },
        { path: "masters/daily-cash-update", element: <DaliyCashUpdate /> },
        { path: "masters/locality", element: <LocalityTable /> },


        // expense
        { path: '/expense/createexpense', element: <ExpenseTable /> },
        { path: '/expense/subexpense', element: <SubExpense /> },
        { path: '/expense/expense-entries', element: <ExpenseEntriesTable /> },

        // income
        { path: '/income/createincome', element: <IncomeTable /> },


        // loan
        { path: '/masters/loancreate', element: <LoanCreationFormPage /> },
        { path: '/masters/loans', element: <LoanTable /> },
        { path: '/masters/view-loan/:id', element: <ViewLoan /> },
        { path: '/manageloan/existingloan', element: <ExistingLoanAccounts /> },
        { path: '/manageloan/loan-print/:id', element: <LoanPdfView /> },

        // Manage Loan 
        { path: '/manageloan/new-loan', element: <NewLoan /> },
        { path: '/manageloan/topup', element: <LoanTopUp /> },
        { path: '/manageloan/topup-history', element: <LoanTopUpHistory /> },
        { path: '/manageloan/viewexistingloan/:id', element: <ViewLoanAccounts /> },
        { path: '/manageloan/loan-closure-history', element: <LoanClosureHistory /> },
        { path: '/manageloan/loan-closure/:id', element: <ViewLoanClosure /> },



        //Reports
        { path: '/inventoryreports/itemwisereports', element: <ItemWiseReports /> },
        { path: '/inventoryreports/metalwisereports', element: <MetalWiseReports /> },
        { path: '/inventoryreports/loanhistory', element: <LoanHistory /> },
        { path: '/inventoryreports/itemhistory', element: <ItemHistory /> },
        { path: '/inventoryreports/recoveryitem', element: <RecoveryItem /> },
        { path: '/inventoryreports/accountsclosure', element: <AccountsClosure /> },
        { path: '/inventoryreports/overduereport', element: <OverDueReport /> },
        { path: '/inventoryreports/stockledger', element: <StockLedger /> },
        { path: "/inventoryreports/daybookreport", element: <DayBookReport /> },


        { path: '/accountreports/paymentledger', element: <PaymentLedger /> },
        { path: '/accountreports/transactionreports', element: <TransactionReports /> },
        { path: '/accountreports/customerreport', element: <CustomerHistory /> },
        { path: '/accountreports/loanreport', element: <LoanReports /> },
        { path: '/accountreports/loanaccountreport', element: <LoanAccountReport /> },
        { path: '/accountreports/interestcollection', element: <InterestCollection /> },
        { path: '/accountreports/expensesincome', element: <ExpensesIncome /> },
        { path: '/accountreports/cashflowreport', element: <CashFlow /> },






        //customer
        { path: '/customer/overview', element: <CustomerOverview /> },
        { path: '/customer/existingcustomer', element: <ExistingCustomer /> },
        { path: '/customer/editcustomer/:id', element: <CustomerCreation /> },

        // Payment 
        { path: "/payment/addpayment", element: <AddPayment /> },
        { path: "/payment/managepayment", element: <PaymentTable /> },
        { path: "/payment/interest-payment", element: <InterestPayment /> },
        { path: "/payment/overdue-payment", element: <OverduePayment /> },
        { path: "/payment/charges-payment", element: <ChargesPayment /> },
        { path: "/payment/principal-payment", element: <PrincipalPayment /> },
        { path: "/payment/pre-close-payment", element: <PreClosePayment /> },
        { path: "/payment/principal-amount", element: <PrincipalAmount /> },
        { path: "/payment/principal-history", element: <PrincipalAmountHistory /> },

        // Reports
        { path: "/reports/overduereport", element: <OverDueReport /> },
        { path: "/reports/income-expenses-report", element: <IncomeExpensesReport /> },
        { path: "/reports/loan-account-report", element: <LoanAccountReport /> },
        { path: "/reports/cash-flow-report", element: <CashFlowReport /> },
        { path: "/reports/payment-mode-report", element: <PaymentModeReport /> },
        { path: "/reports/stock-ledger-report", element: <StockLedgerReport /> },
        { path: "/reports/payment-report", element: <PaymentReport /> },

        // Loan Closure 
        { path: "/manageloan/loan-closure", element: <LoanClosure /> },
        { path: "/manageloan/print-closure/:id", element: <ClosurePdf /> },

        // locker 
        { path: "/locker/lockers", element: <Locker /> },
        { path: "/locker/locker-creation", element: <LockerFrom /> },
        { path: "/locker/editlocker/:id", element: <LockerFrom /> },
        { path: "/locker/locker-transfer", element: <LockerTransfer /> },
        { path: "/locker/locker-settelment", element: <Settlement /> },


        { path: 'user', element: <UserPage /> },



        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },

        // settings
        { path: "settings/branch", element: <BranchTable /> },
        { path: "settings/organisation", element: <Organisation /> },
        { path: "settings/legal-policies", element: <ItemCreationTable /> },

        // only for developement
        { path: "settings/menu", element: <MenuCreation /> },
        { path: "settings/sub-menu", element: <SubMenuCreation /> },


      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthGuard>
          <AuthLayout>
            <SignInPage />
          </AuthLayout>
        </AuthGuard>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
