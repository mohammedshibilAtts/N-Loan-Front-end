import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";

interface ToastProps {
  message?: string;
  status?: AlertColor;
  autoHideDuration?: number;
  isClose?: boolean;
}

const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [status, setStatus] = useState<AlertColor>("info");
  const [duration, setDuration] = useState(3000);

  const showToast = (options: ToastProps) => {
    const { message = "Loading...", status = "info", autoHideDuration = 10000, isClose = true } = options;

    if (isClose) setOpen(false); // Close existing toast before opening a new one

    setTimeout(() => {
      setMessage(message);
      setStatus(status);
      setDuration(autoHideDuration);
      setOpen(true);
    }, isClose ? 300 : 0); // Small delay if closing first
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const Toast = () => (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ zIndex: 9999 }} // Ensuring it stays on top
    >
      <Alert onClose={handleClose} severity={status} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { showToast, Toast };
};

export default useToast;
