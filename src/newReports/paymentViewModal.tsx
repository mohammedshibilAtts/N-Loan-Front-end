import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    DialogActions,
} from "@mui/material";
import SubTable from "../components/subTable/subTable";
import { spliceDecimals } from "../const";

interface PaymentViewModalProps {
    open: boolean;
    onClose: () => void;
    data: any[]; // Array of paymentMode objects
    paymentMethods: any[]; // List of available payment methods (for looking up names)
    paymentProviders: any[]; // List of available payment providers (for looking up names)
}

const PaymentViewModal: React.FC<PaymentViewModalProps> = ({
    open,
    onClose,
    data,
    paymentMethods,
    paymentProviders,
}) => {
    const columns = [
        { id: "id", label: "S.NO" },
        { id: "paymentMethod", label: "Payment Method" },
        { id: "paymentProvider", label: "Payment Provider" },
        { id: "amount", label: "Amount" },
    ];

    const mappedData = data?.map((item: any, index: number) => {
        // Determine Payment Method Name
        let methodName = "-";
        if (item.paymentMethod && typeof item.paymentMethod === 'object' && item.paymentMethod.mode) {
            methodName = item.paymentMethod.mode;
        } else {
            const methodId = item.paymentMethodId || item.paymentMethod;
            const methodObj = paymentMethods?.find((m: any) => m._id === methodId);
            methodName = methodObj?.mode || "-";
        }

        // Determine Payment Provider Name
        let providerName = "-";
        if (item.paymentProvider && typeof item.paymentProvider === 'object' && item.paymentProvider.providerName) {
            providerName = item.paymentProvider.providerName;
        } else {
            const providerId = item.paymentProviderId || item.paymentProvider;
            const providerObj = paymentProviders?.find((p: any) => p._id === providerId);
            providerName = providerObj?.providerName || "-";
        }

        return {
            id: index + 1,
            paymentMethod: methodName,
            paymentProvider: providerName,
            amount: `₹${spliceDecimals(item.amount, 2)}`,
        };
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Payment Details</DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    {data && data.length > 0 ? (
                        <SubTable
                            coloums={columns}
                            data={mappedData}
                            action={false}
                        />
                    ) : (
                        <Box p={2} textAlign="center">No payment details available</Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentViewModal;
