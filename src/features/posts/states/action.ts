import * as api from '../api/postApi';
import { showErrorDialog, showSuccessDialog } from '@/helpers/toolsHelper';
import type { AppDispatch } from '@/store';

export const ActionType = {
  SET_POSTS: 'SET_POSTS',
  SET_POST: 'SET_POST',
  SET_IS_POST: 'SET_IS_POST',
  SET_IS_POST_ADD: 'SET_IS_POST_ADD',
  SET_IS_POST_ADDED: 'SET_IS_POST_ADDED',
  SET_IS_POST_CHANGE: 'SET_IS_POST_CHANGE',
  SET_IS_POST_CHANGED: 'SET_IS_POST_CHANGED',
  SET_IS_POST_CHANGE_COVER: 'SET_IS_POST_CHANGE_COVER',
  SET_IS_POST_CHANGED_COVER: 'SET_IS_POST_CHANGED_COVER',
  SET_IS_POST_DELETE: 'SET_IS_POST_DELETE',
  SET_IS_POST_DELETED: 'SET_IS_POST_DELETED',
  SET_IS_POST_LIKE: 'SET_IS_POST_LIKE',
  SET_IS_POST_LIKED: 'SET_IS_POST_LIKED',
  SET_IS_POST_ADD_COMMENT: 'SET_IS_POST_ADD_COMMENT',
  SET_IS_POST_ADDED_COMMENT: 'SET_IS_POST_ADDED_COMMENT',
  SET_IS_POST_DELETE_COMMENT: 'SET_IS_POST_DELETE_COMMENT',
  SET_IS_POST_DELETED_COMMENT: 'SET_IS_POST_DELETED_COMMENT',
} as const;

export function setPosts(posts: any[]) {
  return { type: ActionType.SET_POSTS, payload: { posts } };
}
export function setPost(post: any) {
  return { type: ActionType.SET_POST, payload: { post } };
}
export function setIsPost(isPost: boolean) {
  return { type: ActionType.SET_IS_POST, payload: { isPost } };
}
export function setIsPostAdd(v: boolean) {
  return { type: ActionType.SET_IS_POST_ADD, payload: { isPostAdd: v } };
}
export function setIsPostAdded(v: boolean) {
  return { type: ActionType.SET_IS_POST_ADDED, payload: { isPostAdded: v } };
}
export function setIsPostChange(v: boolean) {
  return { type: ActionType.SET_IS_POST_CHANGE, payload: { isPostChange: v } };
}
export function setIsPostChanged(v: boolean) {
  return { type: ActionType.SET_IS_POST_CHANGED, payload: { isPostChanged: v } };
}
export function setIsPostChangeCover(v: boolean) {
  return { type: ActionType.SET_IS_POST_CHANGE_COVER, payload: { isPostChangeCover: v } };
}
export function setIsPostChangedCover(v: boolean) {
  return { type: ActionType.SET_IS_POST_CHANGED_COVER, payload: { isPostChangedCover: v } };
}
export function setIsPostDelete(v: boolean) {
  return { type: ActionType.SET_IS_POST_DELETE, payload: { isPostDelete: v } };
}
export function setIsPostDeleted(v: boolean) {
  return { type: ActionType.SET_IS_POST_DELETED, payload: { isPostDeleted: v } };
}
export function setIsPostLike(v: boolean) {
  return { type: ActionType.SET_IS_POST_LIKE, payload: { isPostLike: v } };
}
export function setIsPostLiked(v: boolean) {
  return { type: ActionType.SET_IS_POST_LIKED, payload: { isPostLiked: v } };
}

export function asyncGetPosts(params: Record<string, any> = {}) {
  return async (dispatch: AppDispatch) => {
    try {
      const data = await api.getPosts(params);
      dispatch(setPosts(data.data.posts || []));
    } catch (error: any) {
      await showErrorDialog('Gagal mengambil postingan', error.message);
    }
  };
}

export function asyncGetPostById(id: string | number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPost(true));
    try {
      const data = await api.getPostById(id);
      dispatch(setPost(data.data.post));
      return data.data.post;
    } catch (error: any) {
      dispatch(setPost(null));
      await showErrorDialog('Gagal mengambil detail', error.message);
      throw error;
    } finally {
      dispatch(setIsPost(false));
    }
  };
}

export function asyncAddPost(payload: { description: string }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostAdd(true));
    dispatch(setIsPostAdded(false));
    try {
      await api.addPost(payload);
      dispatch(setIsPostAdded(true));
      await showSuccessDialog('Postingan berhasil ditambahkan');
    } catch (error: any) {
      await showErrorDialog('Gagal menambah postingan', error.message);
      throw error;
    } finally {
      dispatch(setIsPostAdd(false));
    }
  };
}

export function asyncChangePost(id: string | number, payload: { description: string }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostChange(true));
    dispatch(setIsPostChanged(false));
    try {
      await api.updatePost(id, payload);
      dispatch(setIsPostChanged(true));
      await showSuccessDialog('Postingan berhasil diubah');
    } catch (error: any) {
      await showErrorDialog('Gagal mengubah postingan', error.message);
      throw error;
    } finally {
      dispatch(setIsPostChange(false));
    }
  };
}

export function asyncChangePostCover(id: string | number, file: File) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostChangeCover(true));
    dispatch(setIsPostChangedCover(false));
    try {
      await api.changeCover(id, file);
      dispatch(setIsPostChangedCover(true));
      await showSuccessDialog('Cover berhasil diubah');
    } catch (error: any) {
      await showErrorDialog('Gagal mengubah cover', error.message);
      throw error;
    } finally {
      dispatch(setIsPostChangeCover(false));
    }
  };
}

export function asyncDeletePost(id: string | number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostDelete(true));
    dispatch(setIsPostDeleted(false));
    try {
      await api.deletePost(id);
      dispatch(setIsPostDeleted(true));
      await showSuccessDialog('Postingan berhasil dihapus');
    } catch (error: any) {
      await showErrorDialog('Gagal menghapus', error.message);
      throw error;
    } finally {
      dispatch(setIsPostDelete(false));
    }
  };
}

export function asyncLikePost(id: string | number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostLike(true));
    try {
      await api.likePost(id);
      dispatch(setIsPostLiked(true));
    } catch (error: any) {
      await showErrorDialog('Gagal like', error.message);
      throw error;
    } finally {
      dispatch(setIsPostLike(false));
    }
  };
}

export function asyncAddComment(id: string | number, comment: string) {
  return async (dispatch: AppDispatch) => {
    try {
      await api.addComment(id, { comment });
      await dispatch(asyncGetPostById(id));
      await showSuccessDialog('Komentar ditambahkan');
    } catch (error: any) {
      await showErrorDialog('Gagal menambah komentar', error.message);
      throw error;
    }
  };
}

export function asyncDeleteComment(postId: string | number, commentId: string | number) {
  return async (dispatch: AppDispatch) => {
    try {
      await api.deleteComment(postId, commentId);
      await dispatch(asyncGetPostById(postId));
      await showSuccessDialog('Komentar dihapus');
    } catch (error: any) {
      await showErrorDialog('Gagal menghapus komentar', error.message);
      throw error;
    }
  };
}
