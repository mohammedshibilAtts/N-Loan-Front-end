import  { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Icon } from "@iconify/react";

interface ImportButtonProps {
  onImportExcel?: () => void;
  onImportPdf?: () => void;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  buttonText?: string;
}

function ImportButton({
  onImportExcel,
  disabled = false,
  buttonText = "Export",
}: ImportButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

const handleImportExcel = () => {
  console.log("✅ Excel menu clicked");
  handleClose();
  console.log(onImportExcel)
  if (onImportExcel) {
    console.log("📞 Calling onImportExcel");
    onImportExcel();
  } else {
    console.log("❌ onImportExcel is undefined");
  }
};


  // const handleImportPdf = () => {
  //   handleClose();
  //   if (onImportPdf) {
  //     onImportPdf();
  //   }
  // };

  return (
    <>
      <Button
        onClick={handleImportExcel}
        sx={{
          px: 2,
          py: 1.25,
        }}
        disabled={disabled}
        variant="contained"
        color="inherit"
        endIcon={<Icon icon="mdi:microsoft-excel" width="24" height="24" />}
        // aria-controls={open ? "import-menu" : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? "true" : undefined}
      >
        {buttonText}
      </Button>
      <Menu
        id="import-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "import-button",
        }}
      >
        <MenuItem onClick={handleImportExcel}>
          <ListItemIcon>
            <Icon icon="vscode-icons:file-type-excel" width="20" />
          </ListItemIcon>
          <ListItemText>Excel</ListItemText> 
        </MenuItem>
        {/* <MenuItem onClick={handleImportPdf}>
          <ListItemIcon>
            <Icon icon="vscode-icons:file-type-pdf2" width="20" />
          </ListItemIcon>
          <ListItemText>PDF</ListItemText>
        </MenuItem> */}
      </Menu>
    </>
  );
}

export default ImportButton;
