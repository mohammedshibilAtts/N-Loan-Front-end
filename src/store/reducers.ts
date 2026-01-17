import { API_REQUEST, API_SUCCESS, API_FAILURE, API_CLEAR, USER_INFO, USER_INFO_CLEAR, REFETCH_DATA } from "./actionTypes";
const storedUserInfo = localStorage.getItem("userInfo");
const initialState: Record<string, any> = {
  userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
  refetchTable: false,
};

const apiReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case API_REQUEST:
      return {
        ...state,
        [action.payload.key]: { loading: true, data: null, error: null }
      };

    case API_SUCCESS:
      return {
        ...state,
        [action.payload.key]: { data: action.payload.data, loading: false, error: null }
      };

    case API_FAILURE:
      return {
        ...state,
        [action.payload.key]: { error: action.payload.error, loading: false, data: null }
      };

    case USER_INFO:
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return {
        ...state,
        userInfo: {}
      }
    case USER_INFO_CLEAR:
      localStorage.removeItem("userInfo");
      return {
        ...state,
        userInfo: {}
      }
    // case API_RESET: 
    //   const newState = { ...state };
    //   delete newState[action.payload.key];
    //   return newState;

    case API_CLEAR:
      const updatedState: any = {
        ...state,
        [action.payload.key]: { ...state[action.payload.key], data: null, error: null }
      };
      return updatedState;

    case REFETCH_DATA:
      return {
        ...state,
        refetchTable: !state.refetchTable,
      };

    default:
      return state;
  }
};

export default apiReducer;
