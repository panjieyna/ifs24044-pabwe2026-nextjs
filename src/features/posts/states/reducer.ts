import { ActionType } from './action';

const initialState = {
  posts: [] as any[],
  post: null as any,
  isPost: false,
  isPostAdd: false,
  isPostAdded: false,
  isPostChange: false,
  isPostChanged: false,
  isPostChangeCover: false,
  isPostChangedCover: false,
  isPostDelete: false,
  isPostDeleted: false,
  isPostLike: false,
  isPostLiked: false,
};

export default function postsReducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case ActionType.SET_POSTS:
      return { ...state, posts: action.payload.posts };
    case ActionType.SET_POST:
      return { ...state, post: action.payload.post };
    case ActionType.SET_IS_POST:
      return { ...state, isPost: action.payload.isPost };
    case ActionType.SET_IS_POST_ADD:
      return { ...state, isPostAdd: action.payload.isPostAdd };
    case ActionType.SET_IS_POST_ADDED:
      return { ...state, isPostAdded: action.payload.isPostAdded };
    case ActionType.SET_IS_POST_CHANGE:
      return { ...state, isPostChange: action.payload.isPostChange };
    case ActionType.SET_IS_POST_CHANGED:
      return { ...state, isPostChanged: action.payload.isPostChanged };
    case ActionType.SET_IS_POST_CHANGE_COVER:
      return { ...state, isPostChangeCover: action.payload.isPostChangeCover };
    case ActionType.SET_IS_POST_CHANGED_COVER:
      return { ...state, isPostChangedCover: action.payload.isPostChangedCover };
    case ActionType.SET_IS_POST_DELETE:
      return { ...state, isPostDelete: action.payload.isPostDelete };
    case ActionType.SET_IS_POST_DELETED:
      return { ...state, isPostDeleted: action.payload.isPostDeleted };
    case ActionType.SET_IS_POST_LIKE:
      return { ...state, isPostLike: action.payload.isPostLike };
    case ActionType.SET_IS_POST_LIKED:
      return { ...state, isPostLiked: action.payload.isPostLiked };
    default:
      return state;
  }
}
