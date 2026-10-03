import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/states/reducer';
import usersReducer from '@/features/users/states/reducer';
import postsReducer from '@/features/posts/states/reducer';

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      posts: postsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
