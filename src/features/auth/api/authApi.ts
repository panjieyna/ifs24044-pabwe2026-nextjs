import { apiFetch } from '@/helpers/apiHelper';

export async function login(payload: { email: string; password: string }) {
  return apiFetch('/auth/login', { method: 'POST', body: payload, auth: false });
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch('/auth/register', { method: 'POST', body: payload, auth: false });
}

export async function logout() {
  return apiFetch('/auth/logout', { method: 'POST' });
}
