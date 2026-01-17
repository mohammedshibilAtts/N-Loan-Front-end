import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../../config-global";
import { DashboardContent } from "../../../layouts/dashboard";
import { Box, Stack } from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import SubTable from "../../../components/subTable/subTable";
import { useUserRole } from "./userRolehooks";
import { useEffect } from "react";
import { formatDateTime } from "../../../utils/dateFormate";

export default function UserRoleTable() {
  const { roles, loading, fetchUserRoles } = useUserRole();

  useEffect(() => {
    fetchUserRoles();
  }, []);


  const columns = [
    { id: "id", label: "S.NO" },
    { id: "roleName", label: "Role Name" },
    { id: "createdAt", label: "Created At" },
  ];

  const tableData = roles.map((role: any, index: number) => ({
    id: index + 1,
    roleName: role.roleName,
    createdAt: formatDateTime(role.createdAt),
  }));

  return (
    <>
      <Helmet>
        <title>{`User Role - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Stack flexGrow={1}>
            <Breadcrumb
              items={[
                { label: "Masters" },
                { label: "User Role", active: true },
              ]}
            />
          </Stack>
        </Box>

        <Box bgcolor="#ffffff" px={2} py={1} sx={{ borderRadius: 1 }}>
            <SubTable
            hidePagination={true}
          coloums={columns}
          data={tableData}
         
          loading={loading}
        />
        </Box>
      </DashboardContent>
    </>
  );
}
