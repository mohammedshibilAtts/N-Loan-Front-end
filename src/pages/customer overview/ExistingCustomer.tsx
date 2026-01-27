import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Stack } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { DashboardContent } from "../../layouts/dashboard";
import { Breadcrumb } from "../../components/breadCrumbComp";
import { Iconify } from "../../components/iconify";
import { useCustomer } from "./customerHooks";
import SubTable from "../../components/subTable/subTable";
import { useTablePagination } from "../../hooks/commonhooks/paginationHooks";
import { useTableFilters } from "../../hooks/commonhooks/tableFilterHooks";
import FilterBar from "../../components/filterLayout/filterLayout";
import FilterItem from "../../components/filterLayout/filterItem";
import Search from "../../components/search/search";

export default function ExistingCustomer() {
  const navigate = useNavigate();
  const { customers, fetchTable, loading } = useCustomer();

  const {
    page,
    rowsPerPage,
    totalCount,
    setTotalCount,
    onPageChange,
    onRowsPerPageChange,
  } = useTablePagination();

  const { search, setSearch } = useTableFilters();

  // Reset page on search/filter change
  useEffect(() => {
    onPageChange(null, 0);
  }, [search]);

  // Fetch data
  useEffect(() => {
    fetchTable({
      page: page + 1,
      limit: rowsPerPage,
      search,
    }).then(setTotalCount);
  }, [page, rowsPerPage, search]);

  const columns = [
    { id: "id", label: "S.No" },
    { id: "firstName", label: "Name" },
    { id: "img", label: "Image" },
    { id: "mobile", label: "Mobile" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = customers.map((item, index) => ({
   id: page * rowsPerPage + index + 1,
    _id: item._id,
    firstName: item.name,
    img: item.image ? (
      <Avatar
        src={item.image}
        alt="Customer"
        sx={{
          width: 50,
          height: 50,
        }}
      />
    ) : (
      <Avatar
        sx={{
          width: 50,
          height: 50,
          bgcolor: "grey.300",
        }}
      >
        {/* Show initials or leave empty */}
        {item.firstName?.charAt(0) || ""}
      </Avatar>
    ),
    mobile: item.mobile,
    createdAt: new Date(item.createdAt).toLocaleDateString(),
  }));

  return (
    <>
      <Helmet>
        <title>Customers</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Customer" },
                { label: "Existing Customer", active: true },
              ]}
            />
          </Stack>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("/manageloan/new-loan")}
          >
            Add Customer
          </Button>
        </Box>

        <Box bgcolor="#fff" px={2} py={1} borderRadius={1}>
          <FilterBar
            rows={[
              <Box display="flex" gap={1} flexWrap="wrap">
                <FilterItem>
                  <Search onSearch={(v) => setSearch(v)} loading={loading} />
                </FilterItem>
              </Box>
              
            ]}
          />
          <SubTable
            coloums={columns}
            data={tableData}
            loading={loading}
              page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            onEdit={(row: any) => navigate(`/customer/editcustomer/${row._id}`)}
          />
        </Box>
      </DashboardContent>
    </>
  );
}
