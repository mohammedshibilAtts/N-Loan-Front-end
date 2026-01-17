import { Box, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CONFIG } from "../../../config-global";
import Page from "../../../components/Page";
import { useEmployee } from "./employeeHooks";

interface Field {
  name: string;
  label: string;
  value?: string | null;
}

function EmployeeDetails() {
  const { id } = useParams();
  const { employeeData, fetchEmployeeById } = useEmployee();

  useEffect(() => {
    if (id) {
      fetchEmployeeById(id);
    }
  }, [id]);

  const fields: Field[] = [
    {
      name: "Name",
      label: "Name",
      value: employeeData?.username || "N/A",
    },
    {
      name: "mobile",
      label: "Mobile Number",
      value: employeeData?.mobile || "N/A",
    },
    {
      name: "mobile",
      label: "Alternative Mobile Number",
      value: employeeData?.altMobile || "N/A",
    },
    {
      name: "branchId",
      label: "Branch",
      value: employeeData?.branchId?.branchName || "N/A",
    },
    {
      name: "address",
      label: "Address",
      value: employeeData?.address || "N/A",
    },
    {
      name: "genderId",
      label: "Gender",
      value: employeeData?.genderId?.genderName || "N/A",
    },
    {
      name: "date_of_birth",
      label: "Date of Birth",
      value: employeeData?.date_of_birth
        ? new Date(employeeData?.date_of_birth).toLocaleDateString("en-GB")
        : "N/A",
    },
  ];

  const empFields: Field[] = [
    {
      name: "date_of_joining",
      label: "Date of Joining",
      value: employeeData?.date_of_join
        ? new Date(employeeData?.date_of_join).toLocaleDateString("en-GB")
        : "N/A",
    },
    {
      name: "aadhar_number",
      label: "Aadhar Number",
      value: employeeData?.aadhar_number || "N/A",
    },
    {
      name: "user_role",
      label: "User Role",
      value: employeeData?.userRoleId?.roleName || "N/A",
    },
    {
      name: "department",
      label: "Department",
      value: employeeData?.departmentId?.departmentName || "N/A",
    },
    {
      name: "img",
      label: "Uploaded Profile Image",
      value: employeeData?.img || "N/A",
    },
    {
      name: "doc",
      label: "Uploaded Resume",
      value: employeeData?.doc
        ? new URL(employeeData?.doc).pathname.split("/").pop()
        : "N/A",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <Box display="flex" alignItems="center">
        <Typography variant="h6" flexGrow={1} marginLeft={2}>
          <span className="text-[#737791]">Masters</span> / View Employee
        </Typography>
      </Box>

      <Page>
        <Box
          px={5}
          alignItems={"center"}
          sx={{
            backgroundColor: "white",
            padding: 3,
            margin: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ m: 2 }}>
            Employee Details
          </Typography>
          <Grid container spacing={2}>
            {fields.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    padding: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "black",
                      mb: 0.5,
                      font: "500",
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {item.value || "-"}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} my={3}>
            {empFields.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    padding: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "black",
                      mb: 0.5,
                      font: "500",
                    }}
                  >
                    {item.label}
                  </Typography>

                  {item?.name === "img" ? (
                    <>
                      <Box
                        component="img"
                        src={item.value || ""}
                        alt={item.label || ""}
                        sx={{
                          width: 90,
                          height: 70,
                          maxHeight: 150,
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                        }}
                      >
                        {item.value || "-"}
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Page>
    </>
  );
}

export default EmployeeDetails;
