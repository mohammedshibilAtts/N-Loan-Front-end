import {
  Box,
  Typography,
  Button,
  Pagination,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

interface CustomPaginationProps {
  page: number;                 // zero-based
  rowsPerPage: number;
  count: number;                // total records
  onPageChange: (
    event: unknown,
    newPage: number
  ) => void;
  onRowsPerPageChange:any
  
}

export default function CustomPagination({
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
}: CustomPaginationProps) {
  const totalPages = Math.ceil(count / rowsPerPage);
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={2}
      px={2}
    >
      {/* LEFT — Showing count */}
      <Box flex={1} minWidth={176}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            // fontFamily: "Inter, sans-serif",
            letterSpacing: "0.03em",
          }}
        >
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            <Box color="#6C7086">Showing</Box>
            <Box color="#000">{from}</Box>
            <Box color="#6C7086">to</Box>
            <Box color="#000">{to}</Box>
            <Box color="#6C7086">of</Box>
            <Box color="#000">{count}</Box>
            <Box color="#6C7086">entries</Box>
          </Box>
        </Typography>
      </Box>

      {/* CENTER — Pagination */}
      {totalPages > 1 && (
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            onClick={(e) => onPageChange(e, page - 1)}
            disabled={page === 0}
            sx={{ minWidth: 32, padding: "4px", borderRadius: "4px" ,color:"#6C7086"}}
          >
            {"<<"}
          </Button>

          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(e, newPage) =>
              onPageChange(e, newPage - 1)
            }
            siblingCount={0}
            boundaryCount={1}
            hidePrevButton
            hideNextButton
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "4px",
                minWidth: "32px",
                height: "32px",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#1c252e !important",
                color: "#fff !important",
              },
            }}
          />

          <Button
            onClick={(e) => onPageChange(e, page + 1)}
            disabled={page >= totalPages - 1}
            sx={{ minWidth: 32, padding: "4px", borderRadius: "4px",color:"#6C7086" }}
          >
            {">>"}
          </Button>
        </Box>
      )}

      {/* RIGHT — Rows per page */}
      <Box
        flex={1}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={1}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            // fontFamily: "Inter, sans-serif",
            letterSpacing: "0.03em",
            color: "#6C7086",
          }}
        >
          Rows per page
        </Typography>

        <FormControl size="small">
          <Select
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            sx={{
              fontSize: 13,
              height: 32,
              "& .MuiSelect-select": { py: "4px" },
            }}
          >
            {[1,2,3,5, 10, 25].map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
