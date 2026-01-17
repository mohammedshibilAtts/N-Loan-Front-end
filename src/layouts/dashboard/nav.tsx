import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useEffect } from "react";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer, { drawerClasses } from "@mui/material/Drawer";

import { usePathname } from "../../routes/hooks";
import { RouterLink } from "../../routes/components";

import { varAlpha } from "../../theme/styles";

import { Logo } from "../../components/logo";
import { Scrollbar } from "../../components/scrollbar/index";

import { SvgColor } from "../../components/svg-color";



const iconFormate = (name: string) => (
  <SvgColor
    width="100%"
    height="100%"
    src={`../../../assets/icons/navbar/${name}.svg`}
  />
);


// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };

  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,

  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: "none",
        position: "fixed",
        flexDirection: "column",
        bgcolor: "var(--layout-nav-bg)",
        zIndex: "var(--layout-nav-zIndex)",
        width: "var(--layout-nav-vertical-width)",
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey["500Channel"], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: "flex",
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: "unset",
          bgcolor: "var(--layout-nav-bg)",
          width: "var(--layout-nav-mobile-width)",
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

// export function NavContent({ data, slots, sx }: NavContentProps) {
//   const pathname = usePathname();

//   return (
//     <>
//       <Logo />

//       {slots?.topArea}

//       <Scrollbar fillContent>
//         <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
//           <Box component="ul" gap={1.5} display="flex" flexDirection="column">
//             {data.map((item) => {
//               const isActived = item.path === pathname;

//               return (
//                 <ListItem disableGutters disablePadding key={item.title}>
//                   <ListItemButton
//                     disableGutters
//                     component={RouterLink}
//                     href={item.path}
//                     sx={{
//                       pl: 2,
//                       py: 2,
//                       gap: 2,
//                       pr: 1.5,
//                       borderRadius: 0.75,
//                       typography: 'body2',
//                       fontWeight: 'fontWeightMedium',
//                       color: 'var(--layout-nav-item-color)',
//                       minHeight: 'var(--layout-nav-item-height)',
//                       ...(isActived && {
//                         fontWeight: 'fontWeightSemiBold',
//                         bgcolor: 'var(--layout-nav-item-active-bg)',
//                         color: 'var(--layout-nav-item-active-color)',
//                         '&:hover': {
//                           bgcolor: 'var(--layout-nav-item-hover-bg)',
//                         },
//                       }),
//                     }}
//                   >
//                     <Box component="span" sx={{ width: 24, height: 24 }}>
//                       {item.icon}
//                     </Box>

//                     <Box component="span" flexGrow={1}>
//                       {item.title}
//                     </Box>

//                     {item.info && item.info}
//                   </ListItemButton>
//                 </ListItem>
//               );
//             })}
//           </Box>
//         </Box>
//       </Scrollbar>

//       {slots?.bottomArea}

//       {/* <NavUpgrade /> */}
//     </>
//   );
// }

import React, { useState } from "react";

import { ChevronRight, ChevronDown } from "lucide-react";
import { Collapse } from "@mui/material";

export function  NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderMenuItem = (item: any) => {
    const isActived = item.path.split("/")[1] === pathname.split("/")[1];
    const hasChildren = item.children && item.children.length > 0;
    const isMenuOpen = openMenus[item.title];

    return (
      <Box key={item.title}>
        <ListItemButton
          disableGutters
          component={hasChildren ? "div" : RouterLink}
          onClick={hasChildren ? () => toggleMenu(item.title) : undefined}
          href={hasChildren ? undefined : item.path}
          sx={{
            pl: 2,
            py: 2,
            gap: 2,
            pr: 1.5,
            borderRadius: 0.75,
            typography: "body2",
            fontWeight: "fontWeightMedium",
            color: "black",
            minHeight: "var(--layout-nav-item-height)",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            ...(isActived && {
              fontWeight: "fontWeightSemiBold",
              bgcolor: "#09090F",
              color: "white",
              "&:hover": {
                bgcolor: "#09090F",
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24 }}>
            {iconFormate(item.icon)}                               
          </Box>

          <Box component="span" flexGrow={1}>
            {item.title}
          </Box>

          {hasChildren && (
            <Box component="span">
              {isMenuOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Box>
          )}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
            <Box
              component="ul"
              sx={{
                pl: 3,
                my: 1,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 28,
                  width: "1.5px",
                  backgroundColor: "#E1E1E1", // Light grey vertical line
                },
              }}
            >
              {item.children.map((child: any) => {
                const isChildActived = child.path === pathname;

                return (
                  <ListItemButton
                    key={child.title}
                    component={RouterLink}
                    href={child.path}
                    disableGutters
                    sx={{
                      py: 1.5,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: "body2",
                      color: "var(--layout-nav-item-color)",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 4, // Align with the vertical line
                        top: "50%",
                        width: "18px",
                        height: "2px",
                        backgroundColor: "#E1E1E1", // Light grey horizontal connector line
                      },

                      ...(isChildActived && {
                        fontWeight: "fontWeightSemiBold",
                        color: "black",
                      }),
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ width: 24, height: 24, opacity: 0.6 }}
                    >
                      {child.icon}
                    </Box>

                    <Box component="span" flexGrow={1}>
                      {child.title}
                    </Box>
                  </ListItemButton>
                );
              })}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <>
     <Box display="flex" alignItems="center" justifyContent="center">
  <Logo />
</Box>


      {slots?.topArea}

      <Scrollbar fillContent>
        <Box
          component="nav"
          display="flex"
          flex="1 1 auto"
          flexDirection="column"
          sx={sx}
        >
          <Box component="ul" gap={1.5} display="flex" flexDirection="column">
            {data.map((item) => renderMenuItem(item))}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
