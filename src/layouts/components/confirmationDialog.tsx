import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";

// Slide transition for the dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmationDialogProps {
  open: boolean; // Controls visibility of the dialog
  onClose: (confirmed: boolean) => void; // Callback when dialog is closed
  title: string; // Dynamic title for the dialog
  message: string; // Dynamic message for the dialog
  positiveButtonLabel?: string; // Label for the positive button (e.g., "Delete", "OK")
  negativeButtonLabel?: string; // Label for the negative button (e.g., "No", "Cancel")
  showNegativeButton?: boolean; // Whether to show the negative button
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  title,
  message,
  positiveButtonLabel = "Delete",
  negativeButtonLabel = "No",
  showNegativeButton = true, // Default to showing both buttons
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => onClose(false)} // Close with `false` if the user clicks outside the dialog
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {showNegativeButton && (
          <Button
            variant="contained"
            sx={{
              bgcolor: "#F5F5F5",
              color: "#737791",
              "&:hover": {
                bgcolor: "#F5F5F5",
              },
            }}
            onClick={() => onClose(false)}
          >
            {negativeButtonLabel}
          </Button>
        )}
        <Button
          variant="contained"
          sx={{ bgcolor: "#F04438","&:hover": {
                bgcolor: "#F04438",
              }, }}
          onClick={() => onClose(true)}
        >
          {positiveButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
