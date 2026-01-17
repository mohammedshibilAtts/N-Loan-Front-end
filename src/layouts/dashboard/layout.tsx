import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { _langs, _notifications } from '../../_mock';


import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
// import { navData } from '../config-nav-dashboard';
// import { Searchbar } from '../components/searchbar';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { GET_USER_ACCESS, METAL_RATE_FETCH } from "../../store/actionTypes";
import { Divider, Grid, Typography } from '@mui/material';
// import notifications from "../../../src-tauri/icons/notification-status.svg"
// import settings from "../../../src-tauri/icons/settings.svg"
// import { branchId } from "../../const"
import { useDispatch, useSelector } from 'react-redux';
import API_ENDPOINTS from "../../services/endpoints";
import { apiRequest } from "../../store/actions";
import { formatNumber } from '../../utils/commonFunction';
import { navData } from '../config-nav-dashboard';



// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();


  let metals = [
    { label: "Gold", name: '22k', value: "" },
    { label: "Gold", name: '24k', value: "" },
    // { label: "Gold 18K", name: '18k', value: ""},
    { label: "Silver", name: '999', value: "" }
  ]

  const [navOpen, setNavOpen] = useState(false);
  const [metalValue, setMetalValue] = useState<any[]>([]);
  const [branchId, SetBranch] = useState<string | null>(null);
  const [isAdmin, setAdmin] = useState<boolean | null>(null);

  const userData = (localStorage.getItem("userInfo") || 'null');


  const userInfo = JSON.parse(userData);
  const adminRole = userInfo?.isAdmin;

  // const [navData,setNavData]=useState<any>([])
  let dispatch = useDispatch();

  const layoutQuery: Breakpoint = 'lg';


  const { fetchMetalRate, getNavData } = useSelector(
    (states: any) => ({
      fetchMetalRate: states[METAL_RATE_FETCH]?.data,

      getNavData: states[GET_USER_ACCESS]?.data
    })
  );

  useEffect(() => {
    if (getNavData?.success) {
      // setNavData(getNavData.data)
    }
  }, [getNavData])

  useEffect(() => {
    if (!userInfo) return;
    setAdmin(adminRole);
  }, []);

  useEffect(() => {
    if (!isAdmin && userInfo) {
      SetBranch(userInfo.branchId ?? null);
    }
  }, [isAdmin]);



  useEffect(() => {
    if (!branchId) return;
    // const branchValue: any = branchId?.value ?? "";

    dispatch(apiRequest(METAL_RATE_FETCH, 'post', API_ENDPOINTS.SP.POST, {
      procedureName: 'getMetalRates',
      params: {
        tableName: 'metalRate',
        filters: {
          branchId: branchId
        }
      },
    }));
  }, [branchId]);


  useEffect(() => {
    if (!fetchMetalRate?.success) return;

    const data = fetchMetalRate?.data || [];
    console.log("value ==> ", data)

    const newMetalValues = metals.map(metal => {
      const metalDigit = metal.name.replace(/\D/g, '');

      // Find all matches instead of just the first one
      const candidates = data.filter((item: any) => {
        const purityName = (item?.purity?.purityName || "").toLowerCase();

        // Exclude "kg" (Kilogram) to avoid mixing with "kt" (Karat)
        // Also ensure we only take valid rates
        if (purityName.includes("kg") || !item.rate || item.rate <= 0) return false;

        const purityDigit = purityName.replace(/\D/g, '');
        const itemMetalName = item?.material_type_id?.metalName || "";

        // Exact match on metal name (Gold/Silver) and fuzzy match on purity "digits" (22, 24, 999)
        return itemMetalName === metal.label && purityDigit === metalDigit;
      });

      // If matches found, prioritize standard naming ("KT") and recency
      if (candidates.length > 0) {
        candidates.sort((a: any, b: any) => {
          const nameA = a?.purity?.purityName || "";
          const nameB = b?.purity?.purityName || "";

          // Prioritize uppercase "KT"
          const hasKTA = nameA.includes("KT");
          const hasKTB = nameB.includes("KT");

          if (hasKTA && !hasKTB) return -1;
          if (!hasKTA && hasKTB) return 1;

          // Fallback to recency
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

        return { ...metal, value: candidates[0].rate };
      }
      return metal;
    });

    setMetalValue(newMetalValues);
  }, [fetchMetalRate]);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                {/* <Box>
                  <Typography variant="h6" display={{ xs: 'none', md: 'flex' }}>Dashboard</Typography>
                </Box> */}

                <NavMobile
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}

                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" flexDirection="row" alignItems="center">

                <Grid container spacing={1} display={{ xs: 'none', md: 'flex' }}>

                  {metalValue.map((metal) => (
                    <Grid item key={metal.id || metal.name}>
                      <Box sx={{
                        display: "flex",
                        gap: "5px",
                        flexDirection: "row",
                        alignItems: "center",
                        py: 1,
                        paddingInline: "10px",
                        borderRadius: 1,
                        border: 1,
                        borderColor: "#F2F2F9",
                        bgcolor: metal.name.toLowerCase().includes("999") ? "#C0C0C0" : "#FFE28D",
                        height: "38px",
                        width: "100%",
                      }}>
                        <Typography variant="subtitle2">
                          {metal.purity !== "999"
                            ? `${metal.label} (${metal.name})`
                            : metal.label}:
                        </Typography>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, paddingInline: "2px" }}>
                          {formatNumber({ value: metal.value, decimalPlaces: 2 })}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}



                </Grid>

                <Box display={"flex"} justifyContent={'space-between'} alignItems={"center"} gap={2}>
                  {/* <Box
                    component="img"
                    src={notifications}
                    alt="notifications"
                    sx={{
                      width: 28,
                      height: 28,
                    }}
                  /> */}

                  <Box display="flex" alignItems="center" height={28}>
                    {/* <Box
                      component="img"
                      src={settings}
                      alt="settings"
                      sx={{
                        width: 28,
                        height: 35,
                      }}
                    /> */}

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        mx: 2,
                        border: 1,
                        borderColor: "#D9D9D9",
                        height: 28,

                      }}
                    />
                  </Box>


                  <AccountPopover sx={{ marginLeft: "12px" }}
                  // data={[
                  //   {
                  //     label: 'Home',
                  //     href: '/',
                  //     icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                  //   },
                  //   {
                  //     label: 'Profile',
                  //     href: '#',
                  //     icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                  //   },
                  //   {
                  //     label: 'Settings',
                  //     href: '#',
                  //     icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                  //   },
                  // ]}
                  />

                </Box>


              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <Box display="flex">
          <NavDesktop data={navData} layoutQuery={layoutQuery} />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "#D9D9D9" }}
          />
        </Box>
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Divider sx={{ borderColor: "#D9D9D9", marginBottom: "10px" }} />
      <Main>{children}</Main>
    </LayoutSection>
  );
}


