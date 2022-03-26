// // import { getAuth } from '../../../services/auth';
// import { LoadAuth } from '../../ActionTypes/authType';
// import { LoadAuthActions, LoginState } from '../../types/authI';

// const initialState: LoginState = {
//   pending: false,
//   officer: null,
//   error: null,
// };

// export default (state = initialState, action: LoadAuthActions) => {
//   switch (action.type) {
//     case LoadAuth.LOAD_AUTH_REQUEST:
//       return {
//         ...state,
//         pending: true,
//       };
//     case LoadAuth.LOAD_AUTH_SUCCESS:
//       return {
//         ...state,
//         pending: false,
//         officer: action.payload.officer,
//         error: null,
//       };
//     case LoadAuth.LOAD_AUTH_FAILURE:
//       return {
//         ...state,
//         pending: false,
//         officer: null,
//         error: 'error',
//       };
//     default:
//       return {
//         ...state,
//       };
//   }
// };
export {};
