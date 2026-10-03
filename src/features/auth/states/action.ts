import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/authApi';
import { putAccessToken, removeAccessToken } from '@/helpers/apiHelper';
import { showErrorDialog, showSuccessDialog } from '@/helpers/toolsHelper';
import type { AppDispatch } from '@/store';

export const ActionType = {
  SET_IS_AUTH_LOGIN: 'SET_IS_AUTH_LOGIN',
  SET_IS_AUTH_REGISTER: 'SET_IS_AUTH_REGISTER',
  SET_IS_AUTH_LOGOUT: 'SET_IS_AUTH_LOGOUT',
} as const;

export function setIsAuthLogin(isAuthLogin: boolean) {
  return { type: ActionType.SET_IS_AUTH_LOGIN, payload: { isAuthLogin } };
}
export function setIsAuthRegister(isAuthRegister: boolean) {
  return { type: ActionType.SET_IS_AUTH_REGISTER, payload: { isAuthRegister } };
}
export function setIsAuthLogout(isAuthLogout: boolean) {
  return { type: ActionType.SET_IS_AUTH_LOGOUT, payload: { isAuthLogout } };
}

export function asyncSetIsAuthLogin(payload: { email: string; password: string }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsAuthLogin(true));
    try {
      const data = await loginApi(payload);
      putAccessToken(data.data.token);
      await showSuccessDialog('Berhasil login');
      return data;
    } catch (error: any) {
      await showErrorDialog('Gagal login', error.message);
      throw error;
    } finally {
      dispatch(setIsAuthLogin(false));
    }
  };
}

export function asyncSetIsAuthRegister(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsAuthRegister(true));
    try {
      const data = await registerApi(payload);
      await showSuccessDialog('Berhasil registrasi', 'Silakan login dengan akun baru');
      return data;
    } catch (error: any) {
      await showErrorDialog('Gagal registrasi', error.message);
      throw error;
    } finally {
      dispatch(setIsAuthRegister(false));
    }
  };
}

export function asyncSetIsAuthLogout() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsAuthLogout(true));
    try {
      await logoutApi();
    } catch {
      /* ignore */
    } finally {
      removeAccessToken();
      dispatch(setIsAuthLogout(false));
    }
  };
}
