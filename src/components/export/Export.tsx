import React from "react";
import { ChevronDown } from "lucide-react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import exportIcon from "../../../src-tauri/icons/exportIcon.svg";

type Props = {
  data: any[];
  tableName: string;
  columns: any[];
  anchorElMap?: any;
  setAnchorElMap?: any;
  printRef?: any;
};

const ExportDropdown: React.FC<Props> = ({
  data,
  tableName,
  columns,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleExportExcel = () => {
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, tableName);
      XLSX.writeFile(wb, `${tableName}.xlsx`);
    });
    handleClose();
  };

  const handleExportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        const tableColumn = columns.map((col) => col.label || col.id);
        const tableRows = data.map((row) =>
          tableColumn.map((key) => row[key])
        );

        (doc as any).autoTable({
          head: [tableColumn],
          body: tableRows,
        });
        doc.save(`${tableName}.pdf`);
      });
    });
    handleClose();
  };


  return (
    <Box>
      <Button
        variant="contained"
        color="inherit"
        onClick={handleClick}
        startIcon={<img src={exportIcon} height={20} alt="export" />}
        endIcon={
          <ChevronDown
            size={18}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        }
        sx={{ textTransform: "none" }}
      >
        Export
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleExportExcel}>Excel</MenuItem>
        <MenuItem onClick={handleExportPdf}>PDF</MenuItem>
      </Menu>
    </Box>
  );
};

export default ExportDropdown;
