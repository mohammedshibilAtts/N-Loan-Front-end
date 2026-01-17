import { takeEvery, call, put } from "redux-saga/effects";
import { API_REQUEST, API_SUCCESS, API_FAILURE } from "./actionTypes";
import { apiService } from "../services/apiService";

interface ApiAction {
  type: string;
  payload: {
    key: string;
    method: "get" | "post" | "put" | "delete";
    url: string;
    data?: any;
  };
}

function* handleApiRequest(action: ApiAction): Generator<any, void, any> {
  const { key, method, url, data } = action.payload;
  try {
    const response = yield call(apiService[method], url, data);
    console.log(response);
    yield put({ type: API_SUCCESS, payload: { key, data: response } });
  } catch (error: any) {
    console.log('error', error);
    yield put({ type: API_FAILURE, payload: { key, error: error.message } });
  }
}

export default function* rootSaga() {
  // yield takeLatest(API_REQUEST, handleApiRequest);
  yield takeEvery(API_REQUEST, handleApiRequest);
}
