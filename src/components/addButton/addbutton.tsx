import { Button } from "@mui/material";
import { Iconify } from "../iconify";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { GET_USER_ACCESS } from "../../store/actionTypes";

function Addbutton({ title, onClick, 
  // mainMenu, subMenu
}: any) {
  // const [access, setAccess] = useState<any>([]);

  const { accessData } = useSelector((states: any) => ({
    accessData: states[GET_USER_ACCESS]?.data,
  }));

  useEffect(() => {
    if (accessData?.success) {
      // setAccess(accessData.data);
    }
  }, [accessData]);

    // const matchedSubMenu = access
    //   ?.find((menu: any) => menu.title === mainMenu)
    //   ?.children?.find((child: any) => child.title === subMenu);

    // const a = true;

    // const hasAddAccess =a?? matchedSubMenu?.addPermit;

    // if (!hasAddAccess) return null;

  return (
    <Button
      variant="contained"
      color="inherit"
      startIcon={<Iconify icon="mingcute:add-line" />}
      onClick={onClick}
    >
      {title}
    </Button>
  );
}

export default Addbutton;
