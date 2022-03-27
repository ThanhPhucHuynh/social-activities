import { all, fork } from 'redux-saga/effects';
import loginSaga from './loginSaga/loginSaga';
import authSaga from './authSaga/authSaga';

export function* rootSaga() {
  yield all([fork(loginSaga), fork(authSaga)]);
}
