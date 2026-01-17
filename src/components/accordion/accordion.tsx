import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Checkbox,
} from "@mui/material";
import { ChevronDown } from "lucide-react";

interface Props {
  panelId: string;
  title: string;
  expanded: string | false;
  handleChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  children: React.ReactNode;
}

const CustomAccordion: React.FC<Props> = ({
  panelId,
  title,
  expanded,
  handleChange,
  children,
}) => {
  const isChecked = expanded === panelId;

  return (
    <Accordion expanded={isChecked} onChange={handleChange(panelId)}>
      <AccordionSummary
        expandIcon={<ChevronDown />}
        aria-controls={`${panelId}-content`}
        id={`${panelId}-header`}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Checkbox
            checked={isChecked}
            sx={{
              "&.Mui-checked": {
                color: "black",
              },
            }}
          />
          <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
