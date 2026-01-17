const API_ENDPOINTS = {
    AUTH: {
      LOGIN: "/user/login",
      // REGISTER: "/user/register",
    },
    COMPANY: {
      GET: "/company",
      POST: "/company",
      EDIT: (id: string) => `/company/${id}`,
      UPDATE: (id: string) => `/company/${id}`,
      DELETE: (id: string) => `/company/${id}`,
    },
    COUNTRY: {
      GET: "/country",
      GET_ALL: "/country",
    },
    MENU: {
      GET: "/menus",
      POST_TABLE: "/menus/list",
    },
    MENU_PERMISSION: {
      GET: "/menu-permission",
      POST_TABLE: "/menu-permission/list",
      POST_BY_ROLE: "/menu-permission/list-by-role",
    },
    SP:{
      POST: "/sp/execute",
    },
    SP_FILE:{
      POST_FILE: (tableName: string) => `/sp/store-file?tableName=${tableName}`,
    },
    DESIGN_LIB_FILE:{
      POST_FILE: "/design-lib/create",
    },

  };
  
  export default API_ENDPOINTS;
  