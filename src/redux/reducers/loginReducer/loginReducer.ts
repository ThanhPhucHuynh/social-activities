import { storeAuth } from '../../../services/auth';
import { LoginTypes, LoadAuth } from '../../ActionTypes/authType';
import { LoadAuthActions, LoginActions, LoginState } from '../../types/authI';

const initialState: LoginState = {
  pending: false,
  officer: null,
  error: null,
};

export default (state = initialState, action: LoginActions | LoadAuthActions) => {
  switch (action.type) {
    case LoginTypes.FETCH_LOGIN_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case LoginTypes.FETCH_LOGIN_SUCCESS:
      storeAuth(action.payload.officer);
      return {
        ...state,
        pending: false,
        officer: action.payload.officer,
        error: null,
      };
    case LoginTypes.FETCH_LOGIN_FAILURE:
      return {
        ...state,
        pending: false,
        officer: null,
        error: action.payload.error,
      };
    case LoadAuth.LOAD_AUTH_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case LoadAuth.LOAD_AUTH_SUCCESS:
      return {
        ...state,
        pending: false,
        officer: action.payload.officer,
        error: null,
      };
    case LoadAuth.LOAD_AUTH_FAILURE:
      return {
        ...state,
        pending: false,
        officer: null,
        error: 'error',
      };
    default: {
      return {
        ...state,
      };
    }
  }
};
