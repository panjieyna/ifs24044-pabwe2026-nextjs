import {
  getUsers as getUsersApi,
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
  changePhoto as changePhotoApi,
  changePassword as changePasswordApi,
} from '../api/userApi';
import { showErrorDialog, showSuccessDialog } from '@/helpers/toolsHelper';
import type { AppDispatch } from '@/store';

export const ActionType = {
  SET_USERS: 'SET_USERS',
  SET_PROFILE: 'SET_PROFILE',
  SET_IS_PROFILE: 'SET_IS_PROFILE',
  SET_IS_CHANGE_PROFILE: 'SET_IS_CHANGE_PROFILE',
  SET_IS_CHANGE_PROFILE_PHOTO: 'SET_IS_CHANGE_PROFILE_PHOTO',
  SET_IS_CHANGE_PROFILE_PASSWORD: 'SET_IS_CHANGE_PROFILE_PASSWORD',
} as const;

export function setUsers(users: any[]) {
  return { type: ActionType.SET_USERS, payload: { users } };
}
export function setProfile(profile: any) {
  return { type: ActionType.SET_PROFILE, payload: { profile } };
}
export function setIsProfile(isProfile: boolean) {
  return { type: ActionType.SET_IS_PROFILE, payload: { isProfile } };
}
export function setIsChangeProfile(isChangeProfile: boolean) {
  return { type: ActionType.SET_IS_CHANGE_PROFILE, payload: { isChangeProfile } };
}
export function setIsChangeProfilePhoto(isChangeProfilePhoto: boolean) {
  return { type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO, payload: { isChangeProfilePhoto } };
}
export function setIsChangeProfilePassword(isChangeProfilePassword: boolean) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    payload: { isChangeProfilePassword },
  };
}

export function asyncGetUsers() {
  return async (dispatch: AppDispatch) => {
    try {
      const data = await getUsersApi();
      dispatch(setUsers(data.data.users || []));
    } catch (error: any) {
      await showErrorDialog('Gagal mengambil data pengguna', error.message);
    }
  };
}

export function asyncGetProfile() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsProfile(true));
    try {
      const data = await getProfileApi();
      dispatch(setProfile(data.data.user));
      return data.data.user;
    } catch (error) {
      dispatch(setProfile(null));
      throw error;
    } finally {
      dispatch(setIsProfile(false));
    }
  };
}

export function asyncChangeProfile(payload: { name: string; email: string }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfile(true));
    try {
      const data = await updateProfileApi(payload);
      dispatch(setProfile(data.data.user));
      await showSuccessDialog('Profil berhasil diperbarui');
      return data;
    } catch (error: any) {
      await showErrorDialog('Gagal mengubah profil', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfile(false));
    }
  };
}

export function asyncChangeProfilePhoto(file: File) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfilePhoto(true));
    try {
      await changePhotoApi(file);
      const data = await getProfileApi();
      dispatch(setProfile(data.data.user));
      await showSuccessDialog('Foto profil berhasil diubah');
    } catch (error: any) {
      await showErrorDialog('Gagal mengubah foto', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfilePhoto(false));
    }
  };
}

export function asyncChangeProfilePassword(payload: {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfilePassword(true));
    try {
      await changePasswordApi(payload);
      await showSuccessDialog('Kata sandi berhasil diubah');
    } catch (error: any) {
      await showErrorDialog('Gagal mengubah kata sandi', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfilePassword(false));
    }
  };
}
