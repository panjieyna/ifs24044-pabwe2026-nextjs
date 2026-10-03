import { ActionType } from './action';

const initialState = {
  isAuthLogin: false,
  isAuthRegister: false,
  isAuthLogout: false,
};

export default function authReducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_LOGIN:
      return { ...state, isAuthLogin: action.payload.isAuthLogin };
    case ActionType.SET_IS_AUTH_REGISTER:
      return { ...state, isAuthRegister: action.payload.isAuthRegister };
    case ActionType.SET_IS_AUTH_LOGOUT:
      return { ...state, isAuthLogout: action.payload.isAuthLogout };
    default:
      return state;
  }
}
