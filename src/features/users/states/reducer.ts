import { ActionType } from './action';

const initialState = {
  users: [] as any[],
  profile: null as any,
  isProfile: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
};

export default function usersReducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case ActionType.SET_USERS:
      return { ...state, users: action.payload.users };
    case ActionType.SET_PROFILE:
      return { ...state, profile: action.payload.profile };
    case ActionType.SET_IS_PROFILE:
      return { ...state, isProfile: action.payload.isProfile };
    case ActionType.SET_IS_CHANGE_PROFILE:
      return { ...state, isChangeProfile: action.payload.isChangeProfile };
    case ActionType.SET_IS_CHANGE_PROFILE_PHOTO:
      return { ...state, isChangeProfilePhoto: action.payload.isChangeProfilePhoto };
    case ActionType.SET_IS_CHANGE_PROFILE_PASSWORD:
      return {
        ...state,
        isChangeProfilePassword: action.payload.isChangeProfilePassword,
      };
    default:
      return state;
  }
}
