import { AxiosResponse } from 'axios';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import api from '../../../utils/api';
import { fetchLoginFailure, fetchLoginSuccess } from '../../actions';
import { LoginTypes } from '../../ActionTypes/authType';
import { FetchLoginRequest, FetchLoginRequestPayload, IOfficer } from '../../types/authI';

const getLogin = (P: FetchLoginRequestPayload) =>
  api.post('/login', {
    email: P.email,
    password: P.password,
  });
function* fetchLoginSaga(P: FetchLoginRequest) {
  try {
    const response: AxiosResponse<IOfficer> = yield call(getLogin, P.payload);
    yield put(
      fetchLoginSuccess({
        officer: response.data,
      })
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    yield put(
      fetchLoginFailure({
        error: e.message,
      })
    );
  }
}
function* loginSaga() {
  yield all([takeEvery(LoginTypes.FETCH_LOGIN_REQUEST, fetchLoginSaga)]);
}

export default loginSaga;
