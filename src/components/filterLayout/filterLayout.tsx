// src/components/filterBar/FilterBar.tsx
import { Box } from "@mui/material";

interface FilterBarProps {
  rows: React.ReactNode[];
  gap?: number;
}

const FilterBar = ({ rows, gap = 1 }: FilterBarProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={gap} mt={2}>
      {rows.map((row, index) => (
        <Box key={index}>{row}</Box>
      ))}
    </Box>
  );
};

export default FilterBar;
