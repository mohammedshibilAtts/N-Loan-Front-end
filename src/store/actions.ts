import { API_REQUEST, API_CLEAR, USER_INFO, USER_INFO_CLEAR, REFETCH_DATA } from "./actionTypes";

export const apiRequest = (key: string, method: string, url: string, data: any = null) => ({
  type: API_REQUEST,
  payload: { key, method, url, data },
});


export const apiClear = (key: string) => ({
  type: API_CLEAR,
  payload: { key },
});

export const addUserInfo = (data: any) => ({
  type: USER_INFO,
  payload: data
})

export const clearUserInfo = () => {
  localStorage.removeItem("userInfo")
  localStorage.removeItem("accessToken")
  return { type: USER_INFO_CLEAR, }
}

export const refetchTable = () => ({
  type: REFETCH_DATA,
});


