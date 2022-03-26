import { combineReducers } from 'redux';
import loginReducer from './loginReducer/loginReducer';
// import authReducer from './authReducer/authReducer';

const rootReducer = combineReducers({
  auth: loginReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
