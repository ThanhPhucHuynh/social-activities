import { LoginTypes, LoadAuth } from '../../ActionTypes/authType';
import {
  FetchLoginFailure,
  FetchLoginFailurePayload,
  FetchLoginRequest,
  FetchLoginSuccess,
  FetchLoginSuccessPayload,
  FetchLoginRequestPayload,
  LoadAuthFailure,
  LoadAuthSuccess,
  LoadAuthRequest,
} from '../../types/authI';

export const fetchLoginRequest = (payload: FetchLoginRequestPayload): FetchLoginRequest => ({
  type: LoginTypes.FETCH_LOGIN_REQUEST,
  payload,
});

export const fetchLoginSuccess = (payload: FetchLoginSuccessPayload): FetchLoginSuccess => ({
  type: LoginTypes.FETCH_LOGIN_SUCCESS,
  payload,
});

export const fetchLoginFailure = (payload: FetchLoginFailurePayload): FetchLoginFailure => ({
  type: LoginTypes.FETCH_LOGIN_FAILURE,
  payload,
});

export const loadAuthRequest = (): LoadAuthRequest => ({
  type: LoadAuth.LOAD_AUTH_REQUEST,
});

export const loadAuthSuccess = (payload: FetchLoginSuccessPayload): LoadAuthSuccess => ({
  type: LoadAuth.LOAD_AUTH_SUCCESS,
  payload,
});

export const loadAuthFailure = (payload: FetchLoginFailurePayload): LoadAuthFailure => ({
  type: LoadAuth.LOAD_AUTH_FAILURE,
  payload,
});
