import { LoginTypes, LoadAuth } from '../ActionTypes/authType';

export interface IOfficer {
  _id: string;
  name: string;
  email: string;
  code: string;
  role: 'admin' | 'root' | 'officer';
  avatar: string;
  token: string;
}

export interface LoginState {
  pending: boolean;
  officer: IOfficer | null;
  error: string | null;
}

export interface FetchLoginSuccessPayload {
  officer: IOfficer;
}

export interface FetchLoginRequestPayload {
  email: string;
  password: string;
}
export interface FetchLoginFailurePayload {
  error: string;
}

export interface FetchLoginRequest {
  type: typeof LoginTypes.FETCH_LOGIN_REQUEST;
  payload: FetchLoginRequestPayload;
}

export type FetchLoginSuccess = {
  type: typeof LoginTypes.FETCH_LOGIN_SUCCESS;
  payload: FetchLoginSuccessPayload;
};

export type FetchLoginFailure = {
  type: typeof LoginTypes.FETCH_LOGIN_FAILURE;
  payload: FetchLoginFailurePayload;
};

export interface LoadAuthSuccessPayload {
  officer: IOfficer;
}

export interface LoadAuthFailurePayload {
  error: string;
}

export interface LoadAuthRequest {
  type: typeof LoadAuth.LOAD_AUTH_REQUEST;
}

export type LoadAuthSuccess = {
  type: typeof LoadAuth.LOAD_AUTH_SUCCESS;
  payload: FetchLoginSuccessPayload;
};

export type LoadAuthFailure = {
  type: typeof LoadAuth.LOAD_AUTH_FAILURE;
  payload: FetchLoginFailurePayload;
};

export type LoginActions = FetchLoginRequest | FetchLoginSuccess | FetchLoginFailure;

export type LoadAuthActions = LoadAuthRequest | LoadAuthSuccess | LoadAuthFailure;
