// import {
//   Box,
//   IconButton,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Skeleton,
// } from "@mui/material";
// import { Icon } from "@iconify/react";
// import CustomPagination from "../pagination/pagination";
// import CustomScrollTableContainer from "../datatable/scroll";

// const SubTable = ({
//   coloums,
//   data,
//   onDelete,
//   onView,
//   onEdit,
//   page = 0,
//   count = 0,
//   rowsPerPage = 5,
//   onPageChange,
//   onRowsPerPageChange,
//   loading = false, // Add loading prop
//   hidePagination=false
// }: any) => {
//   const showActions = !!(onView || onEdit || onDelete);
//   return (
//     <Box>
//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//         p={2}
//       ></Box>

//       <CustomScrollTableContainer>
//         <Table sx={{ minWidth: "100%" }}>
//           <TableHead>
//             <TableRow sx={{ bgcolor: "#f2f5f7" }}>
//               {coloums?.map((column: any) => (
//                 <TableCell
//                   key={column.id}
//                   sx={{
//                     padding: "12px 16px",
//                     whiteSpace: "nowrap",
//                     fontWeight: 600,
//                     fontSize: "0.875rem",
//                     color: "#647482",
//                     borderBottom: "2px solid #e4e6eb",
//                     borderBottomColor: "divider",
//                   }}
//                 >
//                   <Box display="flex" alignItems="center">
//                     {column.label}
//                   </Box>
//                 </TableCell>
//               ))}
//               {showActions && (
//                 <TableCell align="center">
//                   Actions
//                 </TableCell>
//               )}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               // Loading Skeleton
//               [...Array(rowsPerPage)].map((_, index) => (
//                 <TableRow key={`skeleton-${index}`}>
//                   {coloums?.map((column: any) => (
//                     <TableCell
//                       key={`skeleton-cell-${column.id}-${index}`}
//                       sx={{ padding: "12px 16px" }}
//                     >
//                       <Skeleton variant="text" width="80%" height={24} />
//                     </TableCell>
//                   ))}
                
//                 </TableRow>
//               ))
//             ) : data?.length > 0 ? (
//               data.map((row: any, index: any) => (
//                 <TableRow
//                   key={index}
//                   hover
//                   sx={{
//                     borderBottom: 1,
//                     borderColor: "#e4e6eb",
//                     "&:hover": {
//                       bgcolor: "action.hover",
//                     },
//                     "&:last-child td": {
//                       borderBottom: 0,
//                     },
//                   }}
//                 >
//                   {coloums?.map((column: any) => (
//                     <TableCell
//                       key={column.id}
//                       sx={{
//                         padding: "12px 16px",
//                         whiteSpace: "nowrap",
//                         fontSize: "0.875rem",
//                       }}
//                     >
//                       {row[column.id] ?? "-"}
//                     </TableCell>
//                   ))}
//                   {showActions && (
//                     <TableCell align="center">
//                       {onView && (
//                         <IconButton onClick={() => onView(row)}>
//                           <Icon icon="eva:eye-outline" width={20} />
//                         </IconButton>
//                       )}

//                       {onEdit && (
//                         <IconButton onClick={() => onEdit(row)}>
//                           <Icon icon="eva:edit-outline" width={20} />
//                         </IconButton>
//                       )}

//                       {onDelete && (
//                         <IconButton onClick={() => onDelete(row)}>
//                           <Icon icon="eva:trash-2-outline" width={20} />
//                         </IconButton>
//                       )}
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={coloums?.length + (showActions ? 1 : 0)}
//                   sx={{
//                     padding: "40px 16px",
//                     textAlign: "center",
//                     color: "text.secondary",
//                   }}
//                 >
//                   No data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </CustomScrollTableContainer>

//       {!hidePagination&&(
//         <CustomPagination
//         count={count}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         onPageChange={onPageChange}
//         onRowsPerPageChange={onRowsPerPageChange}
//       />
//       )}
//     </Box>
//   );
// };

// export default SubTable;


import {
  Box,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomPagination from "../pagination/pagination";
import CustomScrollTableContainer from "../datatable/scroll";

const SubTable = ({
  coloums,
  data,
  onDelete,
  onView,
  onEdit,
  page = 0,
  count = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  hidePagination = false
}: any) => {
  const showActions = !!(onView || onEdit || onDelete);
  
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      ></Box>

      <CustomScrollTableContainer>
        <Table sx={{ minWidth: "100%" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f2f5f7" }}>
              {coloums?.map((column: any) => (
                <TableCell
                  key={column.id}
                  sx={{
                    padding: "12px 16px",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#647482",
                    borderBottom: "2px solid #e4e6eb",
                    borderBottomColor: "divider",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {column.label}
                  </Box>
                </TableCell>
              ))}
              {showActions && (
                <TableCell 
                  align="center"
                  sx={{
                    position: "sticky",
                    right: 0,
                    bgcolor: "#f2f5f7",
                    zIndex: 1,
                    padding: "12px 16px",
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#647482",
                    borderBottom: "2px solid #e4e6eb",
                    borderBottomColor: "divider",
                    boxShadow: "-2px 0 4px rgba(0,0,0,0.05)", // Optional: adds shadow for depth
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading Skeleton
              [...Array(rowsPerPage)].map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {coloums?.map((column: any) => (
                    <TableCell
                      key={`skeleton-cell-${column.id}-${index}`}
                      sx={{ padding: "12px 16px" }}
                    >
                      <Skeleton variant="text" width="80%" height={24} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.length > 0 ? (
              data.map((row: any, index: any) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    borderBottom: 1,
                    borderColor: "#e4e6eb",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  {coloums?.map((column: any) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        padding: "12px 16px",
                        whiteSpace: "nowrap",
                        fontSize: "0.875rem",
                      }}
                    >
                      {row[column.id] ?? "-"}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell 
                      align="center"
                      sx={{
                        position: "sticky",
                        right: 0,
                        bgcolor: "background.paper",
                        zIndex: 1,
                        padding: "12px 16px",
                        boxShadow: "-2px 0 4px rgba(0,0,0,0.05)", // Optional: adds shadow for depth
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      {onView && (
                        <IconButton onClick={() => onView(row)}>
                          <Icon icon="eva:eye-outline" width={20} />
                        </IconButton>
                      )}

                      {onEdit && (
                        <IconButton onClick={() => onEdit(row)}>
                          <Icon icon="eva:edit-outline" width={20} />
                        </IconButton>
                      )}

                      {onDelete && (
                        <IconButton onClick={() => onDelete(row)}>
                          <Icon icon="eva:trash-2-outline" width={20} />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={coloums?.length + (showActions ? 1 : 0)}
                  sx={{
                    padding: "40px 16px",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CustomScrollTableContainer>

      {!hidePagination && (
        <CustomPagination
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Box>
  );
};

export default SubTable;