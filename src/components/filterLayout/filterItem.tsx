import { Box } from "@mui/material";

export default function FilterItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        width: 260,
        maxWidth: "100%",
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}
