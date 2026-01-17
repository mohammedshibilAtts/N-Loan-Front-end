import { Helmet } from 'react-helmet-async';
import {  useState } from 'react';
import { CONFIG } from '../../../config-global';
import API_ENDPOINTS from '../../../services/endpoints';
import { EXPENSE_ENTRIES_DELETE_RES, EXPENSE_ENTRIES_TABLE, EXPENSE_ENTRIES_EDIT_RES } from '../../../store/actionTypes';
import { DashboardContent } from '../../../layouts/dashboard';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../../../store/actions';
import { ConfirmationDialog } from '../../../layouts/components/confirmationDialog';

import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { SettlementProvider } from './settlementProvider';
import { Breadcrumb } from '../../../components/breadCrumbComp';
import { DataTableRefactored } from '../../../components/datatable/DataTableRefactored';



dayjs.locale('en');

export default function ExpenseEntriesTable() {
  
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [confirmationDialogConfig, setConfirmationDialogConfig] = useState({
        title: '',
        message: '',
        positiveButtonLabel: "Delete",
        negativeButtonLabel:"Cancel",
        showNegativeButton: true,
    });
    const [entryToDelete, setEntryToDelete] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lockerData,setLockerData]=useState<string>('')
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(apiRequest(BRANCH_LIST, 'post', API_ENDPOINTS.SP.POST, { procedureName: 'findAll', params: { tableName: 'branch' } }));
    //     dispatch(apiRequest(EXPENSE_LIST, 'post', API_ENDPOINTS.SP.POST, { procedureName: 'findAll', params: { tableName: 'expense' } }));
    //     dispatch(apiRequest(SUBEXPENSE_LIST, 'post', API_ENDPOINTS.SP.POST, { procedureName: 'findAll', params: { tableName: 'subExpense' } }));
    //     dispatch(apiRequest(PAYMENT_MODE_LIST, 'post', API_ENDPOINTS.SP.POST, { procedureName: 'findAll', params: { tableName: 'paymentMode' } }));
    // }, [dispatch]);

  



    const handleEdit = (row: any) => {
        setIsView(false);
        setIsEdit(true);
        getEntryById(row);
        setIsFormOpen(true);
        setLockerData(row)
    };

    const getEntryById = (data: any) => {
        const body = {
            procedureName: "findById",
            params: {
                tableName: "expenseEntries",
                id: data._id,
            },
        };
        dispatch(apiRequest(EXPENSE_ENTRIES_EDIT_RES, "post", API_ENDPOINTS.SP.POST, body));
    };

    const handleDelete = (row: any) => {
        setEntryToDelete(row);
        setConfirmationDialogConfig({
            title: 'Delete Expense Entry',
            message: 'Are you sure you want to delete this Expense Entry? You will not be able to recover this record!',
            positiveButtonLabel: "Delete",
            negativeButtonLabel:"Cancel",
            showNegativeButton: true,
        });
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = (confirmed: boolean) => {
        setConfirmationDialogOpen(false);
        if (confirmed) {
            setIsLoading(true);
            deleteEntry(entryToDelete._id);
        }
    };

    const deleteEntry = (id: string) => {
        const data = {
            procedureName: "delete",
            params: {
                tableName: "expenseEntries",
                id: id,
            },
        };
        dispatch(apiRequest(EXPENSE_ENTRIES_DELETE_RES, "post", API_ENDPOINTS.SP.POST, data));
    };

    const handleFormSubmitSuccess = () => {
        setIsFormOpen(false);
        setIsView(false);
        setIsEdit(false);
        setIsLoading(false);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setIsView(false);
        setIsEdit(false);
        setIsLoading(false);
    };


    return (
        <>
            <Helmet>
                <title>{`Expense Entries - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                    <Breadcrumb items={[{label:"Locker"},{label:"settlement",active:true}]} />
                </Box>


               

                <DataTableRefactored
                    actionType={EXPENSE_ENTRIES_TABLE}
                    endpoint={API_ENDPOINTS.SP.POST}
                    tableName="lockerSettelment"
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    populateFields={["branch", "expense", "subExpense", "paymentMethod", "paymentProvider"]}
                />

                {isFormOpen && (
                    <SettlementProvider
                        isView={isView}
                        isEdit={isEdit}
                        onClose={handleCloseForm}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        onSubmitSuccess={handleFormSubmitSuccess}
                        lockerData={lockerData}
                    />
                )}

               

                <ConfirmationDialog
                    open={confirmationDialogOpen}
                    onClose={handleConfirmationDialogClose}
                    title={confirmationDialogConfig.title}
                    message={confirmationDialogConfig.message}
                    positiveButtonLabel={confirmationDialogConfig.positiveButtonLabel}
                    negativeButtonLabel={confirmationDialogConfig.negativeButtonLabel}
                    showNegativeButton={confirmationDialogConfig.showNegativeButton}
                 />


                


            </DashboardContent>


        </>
    );
}


