// import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import { BRANCH_LIST } from '../../../store/actionTypes'; // REMOVED
// import { _tasks, _posts, _timeline } from '../../../_mock';
import { DashboardContent } from '../../../layouts/dashboard';
import { formatJoinDate, formatNumber } from "../../../utils/commonFunction"
import { isAdmin, spliceDecimals } from "../../../const";
import { Autocomplete, Box, Card, InputAdornment, Grid, TextField, Avatar, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { Store, ChevronDown, ChevronRight } from "lucide-react";
import { PieChart } from '@mui/x-charts/PieChart';
import DateRange from '../../../components/dateRange/dateRange';
import { useDashboard } from '../useDashboard';
import { useBranch } from '../../../pages/settings/branch/branchHooks';

import wheel from "../../../../src-tauri/icons/wheel.svg"
import locker1 from "../../../../src-tauri/icons/locker 1.svg"
import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';



// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {

  // const [branchData, setBranchData] = useState<{ branchName: string; _id: string }[]>([]); // using branches from hook directly
  const [filterValues, setFilterValues] = useState<{ [key: string]: any }>({});
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });

  const userData = (localStorage.getItem("userInfo") || 'null');
  const userInfo = JSON.parse(userData);
  const username = userInfo?.username.charAt(0).toUpperCase() + userInfo?.username.slice(1);

  let navigate = useNavigate();
  // const dispatch = useDispatch();

  // Use the new custom hook
  const {
    collectionStats,
    loanStatusCounts,
    accountBalance,
    recentUsers,
    lockerCount,
    fetchDashboardData
  } = useDashboard();

  const { branches, fetchBranches } = useBranch();

  useEffect(() => {
    fetchBranches();
  }, []);

  // --- Date Formatting ---
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // --- Fetch Dashboard Data ---
  useEffect(() => {
    const params = {
      branchId: filterValues?.branch || userInfo?.branchId,
      fromDate: formatDate(dateRange.startDate),
      toDate: formatDate(dateRange.endDate)
    };
    fetchDashboardData(params);
  }, [filterValues?.branch, dateRange, fetchDashboardData, userInfo?.branchId]);



  useEffect(() => {
    if (!isAdmin && !(filterValues.branch)) {
      setFilterValues(() => ({
        branch: userInfo ? userInfo?.branchId : "",
      }));
    }
  }, [isAdmin])


  const getOptionsForField = (fieldName: string) => {
    if (fieldName === "branch") {
      return branches.map((option) => ({
        label: option.branchName,
        value: option._id,
      }));
    }

  };



  /* 
     Mapped Data for UI
  */
  const collectionData: any = [
    { label: "Collection Amount", value: collectionStats?.totalCollection || 0, link: "/reports/payment-report", type: "" },
    { label: "Interest Collected", value: collectionStats?.interestCollected || 0, link: "/reports/payment-report", type: "Interest" },
    { label: "Principal Amount", value: collectionStats?.principalCollected || 0, link: "/reports/payment-report", type: "Principal" },
    { label: "Account Balance", value: accountBalance || 0, link: "/reports/income-expenses-report" }
  ];

  const newUsers = (recentUsers || []).slice(0, 5).map((user: any, index: number) => ({
    id: user?._id || index + 1,
    name: `${user?.firstName} ${user?.lastName}`,
    avatarUrl: user?.img || `/api/placeholder/60/60`,
    joinDate: formatJoinDate(user?.createdAt), // optional: formatting date
    mobile: user?.mobile
  }));



  const loandetails = [
    {
      label: 'Create',
      value: loanStatusCounts?.create || 0,
      color: "#E21269"

    },
    {
      label: 'Closed',
      value: loanStatusCounts?.closed || 0,
      color: "#560BAD"

    },
    {
      label: 'OverDue',
      value: loanStatusCounts?.overDue || 0,
      color: "#FFC300"

    },

  ];



  const safeLockerList = Array.isArray(lockerCount) ? lockerCount : [];

  return (
    <DashboardContent maxWidth="xl">

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ my: { xs: 2, md: 3 } }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          flexWrap="wrap"
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              fontSize: "24px",
            }}
          >
            Hi, {username}!
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: "24px",
            }}
          >
            Welcome Back.!
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <Box sx={{ minWidth: 120 }}>
            <DateRange value={dateRange} onChange={(range) => setDateRange(range)} disableInitialRange={true} />
          </Box>
          <Autocomplete
            options={getOptionsForField("branch") ?? []}
            getOptionLabel={(option) => option.label}
            value={
              (getOptionsForField("branch") || []).find(
                (opt) => opt.value === filterValues["branch"]
              ) || null
            }
            onChange={(_, value) => {
              setFilterValues(() => ({
                branch: value ? value.value : "",
              }));
            }}
            popupIcon={<ChevronDown size={20} color="#000" />}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Branch"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          backgroundColor: "#FFF6D6",
                          padding: "6px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 1,
                        }}
                      >
                        <Store size={18} color="#FFC107" />
                      </Box>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    border: 2,
                    borderColor: "#F5F5F5",
                    paddingLeft: "4px",
                    height: 44,
                  },
                  "& .MuiInputBase-input": {
                    fontWeight: 600,
                    fontSize: "16px",
                    "&::placeholder": {
                      color: "#000",
                      opacity: 1,
                      fontWeight: 500,
                      fontSize: "16px",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              />
            )}
            sx={{ width: 235 }}
          />
        </Box>
      </Box>

      <Box sx={{ py: 3, flexDirection: { xs: "column", md: "row" }, }} gap={3} display={"flex"} justifyContent={"space-between"} >
        <Box sx={{ flex: 0.6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} >
              <Card sx={{
                border: 1,
                borderColor: "#F2F2F9",
                boxShadow: 0,
                height: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                {/* Card Content */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mx: 3, pt: 2, fontWeight: 600, fontSize: "22px" }}>
                    Collection Summary
                  </Typography>
                  <Typography sx={{ mx: 3, pt: 1, fontSize: "18px", fontWeight: 600 }}>
                    {collectionStats?.paidCount || 0}/{collectionStats?.totalDueCount || 0}
                  </Typography>
                </Box>


                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box
                    sx={{

                      px: 2,
                      py: 1,
                      mx: 1,
                      display: "flex",
                      // alignItems: "center",
                    }}
                  >
                    <Box
                      onClick={() => {
                        const queryParams = new URLSearchParams();
                        if (dateRange.startDate) queryParams.append("fromDate", formatDate(dateRange.startDate));
                        if (dateRange.endDate) queryParams.append("toDate", formatDate(dateRange.endDate));

                        navigate(`/reports/loan-account-report?${queryParams.toString()}`);
                      }}
                      sx={{
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#737791",
                        cursor: "pointer",
                        textDecoration: "underline",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      View All
                    </Box>
                    <ChevronRight size={18} style={{ marginTop: "1px" }} />
                  </Box>
                  <Chip
                    label={`Over Due: ${collectionStats?.overdueCollected || 0}`}
                    color="error"
                    variant="outlined"
                    sx={{ m: "8px", borderColor: "red" }}
                  />
                </Box>
              </Card>
            </Grid>

            {collectionData?.map((e: any, index: number) => (
              <Grid item xs={12} md={6} key={index} >
                <Card sx={{
                  border: 1,
                  borderColor: "#F2F2F9",
                  boxShadow: 0,
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  {/* Card Content */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mx: 3, pt: 2, fontWeight: 600, fontSize: "22px" }}>
                      {e.label}
                    </Typography>
                    <Typography sx={{ mx: 3, pt: 1, fontSize: "18px", fontWeight: 600 }}>
                      {formatNumber({ value: (e?.value), decimalPlaces: 2 })}
                    </Typography>
                  </Box>


                  <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box
                      sx={{

                        px: 2,
                        py: 1,
                        mx: 1,
                        display: "flex",
                        // alignItems: "center",
                      }}
                    >
                      <Box

                        sx={{
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          gap: 0.5,
                          color: "#737791",
                          textDecoration: "underline",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => {
                          const queryParams = new URLSearchParams();
                          if (dateRange.startDate) queryParams.append("fromDate", formatDate(dateRange.startDate));
                          if (dateRange.endDate) queryParams.append("toDate", formatDate(dateRange.endDate));
                          if (e.type) queryParams.append("mode", e.type);

                          navigate(`${e.link}?${queryParams.toString()}`);
                        }}
                      >
                        View All
                      </Box>
                      <ChevronRight size={18} style={{ marginTop: "1px" }} />
                    </Box>

                  </Box>
                </Card>
              </Grid>
            ))}


            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  border: 1,
                  boxShadow: 0,
                  borderColor: "#F2F2F9",
                  height: "340px",
                  position: "relative",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mx: 3, pt: 2, fontWeight: 600, fontSize: "22px" }}
                >
                  Locker Details
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "300px",
                      height: "240px",
                      mx: "auto",
                    }}
                  >
                    {/* Locker Image */}
                    <Box
                      component="img"
                      src={locker1}
                      alt="locker1"
                      sx={{
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                      }}
                    />

                    {/* Text Overlaid Inside Locker */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: "60px",
                        top: "30px",
                        zIndex: 2,
                        color: "#000",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {
                        safeLockerList.map((e: any, i: number) => (
                          <Box key={i} display="flex" alignItems="center" gap={0.5}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {e?.metalName}:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500, color: "#737791" }}
                            >
                              {`${spliceDecimals(e?.weight || 0, 3).toFixed(3)}g`}
                            </Typography>
                          </Box>
                        ))
                      }
                    </Box>

                    {/* Rotating Wheel */}
                    <Box
                      component="img"
                      src={wheel}
                      alt="rotating wheel"
                      sx={{
                        width: "60px",
                        height: "60px",
                        position: "absolute",
                        animation: "spin 15s linear infinite",
                        border: "2px solid #d8d8d9",
                        borderRadius: "50%",
                        boxSizing: "border-box",
                        left: "200px",
                        top: "80px",
                        "@keyframes spin": {
                          "0%": {
                            transform: "rotate(0deg)",
                          },
                          "100%": {
                            transform: "rotate(360deg)",
                          },
                        },
                        zIndex: 2,
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>


            {/* <Grid item xs={12} md={6}>
              <Box
                sx={{
                  border: 1,
                  py: "2px",
                  borderColor: "#F2F2F9",
                  bgcolor: "white",
                  height: "250px",
                  width: "400px",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mx: 3, pt: 2, fontWeight: 600, fontSize: "22px" }}
                >
                  Top-up Details
                </Typography>

                <Stack width="100%" direction="row" flexWrap="wrap">
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                    <Gauge
                      width={350}
                      height={150}
                      value={[60, 75, 30]} 
                      valueMax={100}
                      startAngle={-90}
                      endAngle={90}
                      innerRadius="80%"
                      outerRadius="87%"
                      arcs={[
                        { color: '#FF0000', length: 0.4 },  
                        { color: '#00FF00', length: 0.3 },  
                        { color: '#0000FF', length: 0.3 }   
                      ]}
                      text={({ value, valueMax }) => `${valueMax}`}
                    />

                  </Box>
                </Stack>
              </Box>
            </Grid> */}


          </Grid>
        </Box>

        <Box sx={{
          flex: 0.4, bgcolor: "white", borderRadius: 1,
          border: 1, borderColor: "#F2F2F9", display: "flex", justifyContent: "space-between", px: "12px", flexDirection: "column", height: "100%", gap: 2
        }}>

          <Box sx={{
            paddingInline: "8px",
            height: "350px",
            bgcolor: "white",
            // maxWidth: '20rem', 
            width: "90%",
          }}>
            <Typography variant="subtitle2" sx={{ pt: 2, fontWeight: 600, fontSize: "22px" }}>
              Loan Details
            </Typography>
            <Box sx={{ py: 3 }}>

              <PieChart
                series={[
                  {
                    data: loandetails,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}

                sx={{

                  '& .MuiPieChart': {
                    fontWeight: 'bold',
                    color: "pink"
                  },
                }}

                slotProps={{
                  legend: {
                    direction: 'row',

                    position: {
                      vertical: 'top',
                      horizontal: 'center',
                    },

                  } as any,
                }}
                height={200}
                width={200}
              />
            </Box>
          </Box>

          <Divider sx={{ border: 2, borderColor: "#F5F5F5", marginBottom: "10px", width: "90%", marginInline: "5px" }} />

          <Box sx={{
            py: 1,
            height: "350px",
            bgcolor: "white",
            // width: "100%",
            maxWidth: '42rem',
          }}>

            {/* <Paper
              elevation={2}
              sx={{
                p:{xs:0.5,sm:2,md:2,lg:2}, 
                
              }}
            > */}
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 4 }} // mb-8 in Tailwind
            >
              Recent User Joined
            </Typography>

            <Box>

              {newUsers.map((user: any, index: number) => (
                <Box key={user.id} >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'space-between',
                      // py: 1
                    }}

                  >

                    <Avatar
                      src={user.avatarUrl}
                      alt={user.name}
                      sx={{
                        backgroundColor: "red",
                        width: 45,
                        height: 45,
                        mr: { xs: 0.5, sm: 1, md: 1, lg: 1 },
                        bgcolor: '#f5f5f5',
                        border: 2,
                        borderColor: "#D9D9D9",
                      }}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        px: 1,
                        // py: 5,
                      }}
                    >
                      {/* Left Section */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          flexShrink: 0,
                          maxWidth: '50%',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{ fontWeight: 'bold', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'nowrap',
                            color: 'text.secondary',
                          }}
                        >
                          {user.mobile}
                        </Typography>
                      </Box>

                      {/* Right Section */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          flexShrink: 0,
                          maxWidth: '50%',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}
                        >
                          Join Date:{" "}
                          <Box component="span" sx={{ fontWeight: 'bold', display: 'inline' }}>
                            {user.joinDate}
                          </Box>
                        </Typography>
                      </Box>
                    </Box>

                  </Box>


                  {/* Add divider except for the last item */}
                  {index < newUsers.length - 1 && (
                    <Divider sx={{ my: "20px" }} />
                  )}
                </Box>
              ))}
            </Box>
            {/* </Paper> */}


          </Box>

        </Box>


      </Box>
    </DashboardContent>
  );
}
