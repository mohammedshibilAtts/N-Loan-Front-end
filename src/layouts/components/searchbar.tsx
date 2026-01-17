// import type { BoxProps } from '@mui/material/Box';

import Box from "@mui/material/Box";
// import { formatNumber } from '../../utils/commonFunction';
import { Grid, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export function Searchbar() {
  return (
    <Grid container spacing={2} p={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Box
          p={5}
          borderRadius={2}
          border={1}
          borderColor="#F2F2F9"
          bgcolor={"#FFE28D"}
          sx={{ height: "5px", width: "100%" }}
        >
          <Typography variant="h6">Gold</Typography>
          <Typography fontWeight={500}>2000</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
