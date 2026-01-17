// import { Helmet } from 'react-helmet-async';
// import { useState } from 'react';
// import { CONFIG } from '../../../config-global';
// import { DataTable } from '../../../components/datatable/datatableComp';
// import API_ENDPOINTS from '../../../services/endpoints';
// import { METAL_DELETE_RES, METAL_EDIT_RES, METAL_TABLE } from '../../../store/actionTypes';
// import { DashboardContent } from '../../../layouts/dashboard';
// import { Box, Typography, Button } from '@mui/material';
// import { Iconify } from '../../../components/iconify';
// import { MetalForm } from './metalForm';
// import { useDispatch } from 'react-redux';
// import { apiRequest } from '../../../store/actions';
// import { ConfirmationDialog } from '../../../layouts/components/confirmationDialog';

// export default function MetalTable() {
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [isEdit, setEdit] = useState<any>(false);
//     const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // State for confirmation dialog
//     const [confirmationDialogConfig, setConfirmationDialogConfig] = useState({
//         title: '',
//         message: '',
//         positiveButtonLabel: "Delete",
//         negativeButtonLabel:"Cancel"
//         showNegativeButton: true,
//     });
//     const [metalToDelete, setMetalToDelete] = useState<any>(null); // Store the metal to delete
//     const dispatch = useDispatch();

    
//     // Handle view action
//     const handleView = (row: any) => {
//         console.log('View:', row);
//     };

//     // Handle edit action
//     const handleEdit = (row: any) => {
//         setEdit(true);
//         getMetalById(row);
//         setIsFormOpen(true);
//     };

//     const getMetalById = (data: any) => {
//         const body = {
//             procedureName: "findById",
//             params: {
//                 tableName: "metal",
//                 id: data._id,
//             },
//         };
//         dispatch(apiRequest(METAL_EDIT_RES, "post", API_ENDPOINTS.SP.POST, body));
//     };

//     // Handle delete action
//     const handleDelete = (row: any) => {
//         console.log('Delete:', row);
//         setMetalToDelete(row); // Set the metal to delete

//         // Configure the confirmation dialog
//         setConfirmationDialogConfig({
//             title: 'Delete Metal',
//             message: 'Are you sure you want to delete this Metal? You will not be able to recover this record!',
//             positiveButtonLabel: "Delete",
//             negativeButtonLabel:"Cancel"
//             showNegativeButton: true,
//         });

//         setConfirmationDialogOpen(true); // Open the confirmation dialog
//     };

//     // Handle confirmation dialog close
//     const handleConfirmationDialogClose = (confirmed: boolean) => {
//         setConfirmationDialogOpen(false); // Close the dialog

//         if (confirmed) {
//             // If the user confirmed, delete the Metal
//             deleteMetal(metalToDelete._id);
//         }
//     };

//     // Call the API to delete the Metal
//     const deleteMetal = (id: string) => {
//         const data = {
//             procedureName: "delete",
//             params: {
//                 tableName: "metal",
//                 id: id,
//             },
//         };
//         dispatch(apiRequest(METAL_DELETE_RES, "post", API_ENDPOINTS.SP.POST, data))
//     };

//     // Handle form submission success
//     const handleFormSubmitSuccess = () => {
//         setIsFormOpen(false);
//         setEdit(false);
//         // Optionally, refresh the table data here
//     };

//     // Reset form and close modal
//     const handleCloseForm = () => {
//         setIsFormOpen(false);
//         setEdit(false);
//     };

//     return (
//         <>
//             <Helmet>
//                 <title>{`Users - ${CONFIG.appName}`}</title>
//             </Helmet>

//             <DashboardContent>
//                 <Box display="flex" alignItems="center" mb={5}>
//                     <Typography variant="h4" flexGrow={1}>
//                         Metal
//                     </Typography>
//                     <Button
//                         variant="contained"
//                         color="inherit"
//                         startIcon={<Iconify icon="mingcute:add-line" />}
//                         onClick={() => setIsFormOpen(true)}
//                     >
//                         Add Metal
//                     </Button>
//                 </Box>

//                 <DataTable
//                     actionType={METAL_TABLE}
//                     endpoint={API_ENDPOINTS.SP.POST}
//                     tableName="metal"
//                     onView={handleView}
//                     onEdit={handleEdit}
//                     onDelete={handleDelete}
                   
//                 />

//                 {isFormOpen && (
//                     <MetalForm
//                         isEdit={isEdit}
//                         onClose={handleCloseForm}
//                         onSubmitSuccess={handleFormSubmitSuccess}
//                     />
//                 )}

//                 {/* Reusable Confirmation Dialog */}
//                 <ConfirmationDialog
//                     open={confirmationDialogOpen}
//                     onClose={handleConfirmationDialogClose}
//                     title={confirmationDialogConfig.title}
//                     message={confirmationDialogConfig.message}
//                     positiveButtonLabel={confirmationDialogConfig.positiveButtonLabel}
//                     negativeButtonLabel={confirmationDialogConfig.negativeButtonLabel}
//                     showNegativeButton={confirmationDialogConfig.showNegativeButton}
//                 />
//             </DashboardContent>
//         </>
//     );
// }