
type branchType ={
 label:String,
 value:String,
}
export const branchId:branchType={
    label:"Coimbatore",
    value:"67ebac8195ba348114d2f00a"
}

export const isAdmin:boolean=false

export const roleData ={
    name:"Mohammed Shibil",
    branch:{
        label:"Coimbatore",
        value:"67ebac8195ba348114d2f00a"
    },
    isBranchSelection: true,
    
}



export const closedThrough = [
  {
  label:"Payment Settlement",
  id:0
  },
  {
    label:"Pawned Items Sell",
    id:1
  },

]

export function spliceDecimals(num:number, decimals:number=2) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(num * factor) / factor;
}

  export const valueFormatter = (item: { value: number }) => `${item.value}%`;





export const mobileLength:number=10 // todo for mobile validation by country


import {Chip } from '@mui/material';
export const statusBadge = (status: number) => {
  const statusConfig: Record<
    number,
    { label: string; color: string }
  > ={
  0: { label: "OPEN", color: "#22C55E" },     // Vibrant Green
  1: { label: "CLOSED", color: "#EF4444" },   // Vibrant Red
  2: { label: "PRE", color: "#F59E0B" },      // Amber
  3: { label: "AUCT", color: "#3B82F6" },     // Blue
  4: { label: "ELIG", color: "#06B6D4" },     // Cyan
}

  const config = statusConfig[status] || {
    label: "N/A",
    color: "default",
  };

  return (
    <Chip
      label={config.label}
      size="small"
      variant="filled"
      sx={{
        width: 64,           // 🔒 fixed width
        height: 26,          // 🔒 fixed height
        fontSize: "11px",
        fontWeight: 600,
        textAlign: "center",
        color:"white",
        bgcolor:config.color,
        "& .MuiChip-label": {
          padding: 0,
          width: "100%",
        },
      }}
    />
  );
};