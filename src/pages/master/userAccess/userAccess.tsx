import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../../../store/actions";
import API_ENDPOINTS from "../../../services/endpoints";
import {
  GET_USER_ACCESS_BYROLE,
  USER_ROLE_LIST,
} from "../../../store/actionTypes";
import {
  Autocomplete,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TableContainer,
  TableCell,
  Button,
  CircularProgress,
} from "@mui/material";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import { Toast } from "../../../components/toast/toast";

const permissionFields = [
  // { key: "all", label: "All" },
  { key: "view", label: "View" },
  { key: "add", label: "Add" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "print", label: "Print" },
  { key: "export", label: "Export" },
];

export default function UserAccess() {
  const dispatch = useDispatch();

  const [menuData, setMenuData] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  const [permissions, setPermissions] = useState<any>({});
  const [initialPermissions, setInitialPermissions] = useState<any>({});
  const [dirtyActions, setDirtyActions] = useState<any[]>([]);

  const { userRoleList, accessData } = useSelector((states: any) => ({
    userRoleList: states[USER_ROLE_LIST]?.data,
    accessData: states[GET_USER_ACCESS_BYROLE]?.data,
  }));

  /* ---------------- FETCH ROLES ---------------- */

  useEffect(() => {
    dispatch(
      apiRequest(USER_ROLE_LIST, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAll",
        params: { tableName: "user_role",filters:{id_role:{$eq:1}} },
      })
    );
  }, []);

  /* ---------------- FETCH ACCESS ---------------- */

  useEffect(() => {
    if (!selectedRole?._id) return;
    setLoading(true); // 
    dispatch(
      apiRequest(GET_USER_ACCESS_BYROLE, "post", API_ENDPOINTS.SP.POST, {
        procedureName: "findAccessForEdit",
        params: {
          tableName: "access",
          roleId: selectedRole._id,
        },
      })
    );
  }, [selectedRole]);

  /* ---------------- SET DATA ---------------- */

  useEffect(() => {
    if (accessData?.success && Array.isArray(accessData?.data?.data)) {
      setMenuData(accessData.data.data);
      setDirtyActions([]);
      setLoading(false);
    }
      if (accessData && accessData.success === false) {
    setLoading(false);
  }
  }, [accessData]);

  useEffect(() => {
    if (userRoleList?.success) {
      setUserRole(userRoleList.data.data);
      setSelectedRole(userRoleList.data.data[0]);
    }
  }, [userRoleList]);

  /* ---------------- INIT PERMISSIONS ---------------- */

  useEffect(() => {
    if (!menuData.length) return;

    const perms: any = {};

    menuData.forEach((menu) => {
      menu.subMenus.forEach((submenu: any) => {
        perms[submenu.subMenuId] = {
          ...submenu.permissions,
          all: ["view", "add", "edit", "delete", "print", "export"]
            .every((p) => submenu.permissions[p]),
        };
      });
    });

    setPermissions(perms);
    setInitialPermissions(JSON.parse(JSON.stringify(perms)));
  }, [menuData]);

  /* ---------------- HELPERS ---------------- */

  const initPermission = (id: string) =>
    permissions[id] || {
      all: false,
      view: false,
      add: false,
      edit: false,
      delete: false,
      print: false,
      export: false,
    };

  const isMenuFullySelected = (menu: any) =>
    menu.subMenus.every((s: any) =>
      ["view", "add", "edit", "delete", "print", "export"].every(
        (p) => initPermission(s.subMenuId)[p]
      )
    );

  /* ---------------- ROW ---------------- */

  const handlePermissionChange = (subMenuId: string, type: string) => {
    const curr = initPermission(subMenuId);
    const updated =
      type === "all"
        ? {
            all: !curr.all,
            view: !curr.all,
            add: !curr.all,
            edit: !curr.all,
            delete: !curr.all,
            print: !curr.all,
            export: !curr.all,
          }
        : {
            ...curr,
            [type]: !curr[type],
            all: ["view", "add", "edit", "delete", "print", "export"]
              .every((p) => p === type ? !curr[type] : curr[p]),
          };

    setPermissions((p: any) => ({ ...p, [subMenuId]: updated }));
    setDirtyActions((d) => [...d, { type: "SUBMENU", subMenuId }]);
  };

  /* ---------------- HEADER ---------------- */

  const handleHeaderCheckboxChange = (menu: any, permission: string) => {
    setDirtyActions((d) => [...d, { type: "MENU_HEADER", menuId: menu.menuId, permission }]);

    setPermissions((prev: any) => {
      const updated = { ...prev };
      menu.subMenus.forEach((s: any) => {
        updated[s.subMenuId] = {
          ...initPermission(s.subMenuId),
          [permission]: true,
        };
      });
      return updated;
    });
  };

  /* ---------------- MENU ---------------- */

  const handleMenuToggle = (menu: any) => {
    const value = !isMenuFullySelected(menu);

    setDirtyActions((d) => [...d, { type: "MENU_ALL", menuId: menu.menuId, value }]);

    setPermissions((prev: any) => {
      const updated = { ...prev };
      menu.subMenus.forEach((s: any) => {
        updated[s.subMenuId] = {
          all: value,
          view: value,
          add: value,
          edit: value,
          delete: value,
          print: value,
          export: value,
        };
      });
      return updated;
    });
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    if (!dirtyActions.length) {
      Toast.show({ message: "No changes", type: "info" });
      return;
    }

    dispatch(
      apiRequest("BULK_SAVE_ACCESS", "post", API_ENDPOINTS.SP.POST, {
        procedureName: "create",
        params: {
          tableName: "access",
          roleId: selectedRole._id,
          actions: dirtyActions,
          permissions,
        },
      })
    );

    Toast.show({ message: "Permissions saved", type: "success" });
    setDirtyActions([]);
  };

  /* ---------------- CLEAR ---------------- */

  const handleClear = () => {
    setPermissions(JSON.parse(JSON.stringify(initialPermissions)));
    setDirtyActions([]);
    Toast.show({ message: "Changes cleared", type: "info" });
  };

  /* ---------------- UI ---------------- */
if(loading){
  return(
      <Box
    position="fixed"
    top={0}
    left={0}
    width="100vw"
    height="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgcolor="rgba(255,255,255,0.6)"
    zIndex={2000}
  >
    <CircularProgress />
  </Box>
  )
}

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Breadcrumb items={[{ label: "Masters" }, { label: "User Access", active: true }]} />
        <Stack direction="row" gap={2}>
          <Button variant="outlined" onClick={handleClear}>Clear</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Stack>
      </Stack>

      <Card sx={{p:3}}>
        <Box mb={2} display="flex" justifyContent="flex-end" >
          <Autocomplete
          size="small"
            sx={{width:200}}
            options={userRole}
            value={selectedRole}
            onChange={(_, v) => setSelectedRole(v)}
            getOptionLabel={(o: any) => o?.role_name || ""}
            renderInput={(p) => <TextField {...p} placeholder="Select Role" />}
          />
        </Box>

        {menuData.map((menu) => (
          <Accordion key={menu.menuId}>
            <AccordionSummary>
              <Checkbox checked={isMenuFullySelected(menu)} onChange={() => handleMenuToggle(menu)} sx={{mt:0}}/>
              <Typography sx={{mt:1}}>{menu.menuName}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sub Menu</TableCell>
                      {permissionFields.map((f) => (
                        <TableCell key={f.key}>
                          <Checkbox onChange={() => handleHeaderCheckboxChange(menu, f.key)} />
                          {f.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {menu.subMenus.map((s: any) => (
                      <TableRow key={s.subMenuId}>
                        <TableCell>{s.subMenuName}</TableCell>
                        {permissionFields.map((f) => (
                          <TableCell key={f.key}>
                            <Checkbox
                              checked={initPermission(s.subMenuId)[f.key]}
                              onChange={() => handlePermissionChange(s.subMenuId, f.key)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Card>
    </Box>
  );
}
