import { all, call, put, takeEvery } from 'redux-saga/effects';
import { getAuth } from '../../../services/auth';
import { loadAuthFailure, loadAuthSuccess } from '../../actions';
import { LoadAuth } from '../../ActionTypes/authType';
import { IOfficer } from '../../types/authI';

function* fetchAuthSaga() {
  try {
    const response: IOfficer = yield call(getAuth);
    yield put(
      loadAuthSuccess({
        officer: response,
      })
    );
  } catch (e: any) {
    // error
    yield put(
      loadAuthFailure({
        error: e,
      })
    );
  }
}
function* authSaga() {
  yield all([takeEvery(LoadAuth.LOAD_AUTH_REQUEST, fetchAuthSaga)]);
}

export default authSaga;
