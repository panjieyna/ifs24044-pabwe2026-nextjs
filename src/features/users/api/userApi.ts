import { apiFetch } from '@/helpers/apiHelper';

export async function getUsers() {
  return apiFetch('/users');
}

export async function getProfile() {
  return apiFetch('/users/me');
}

export async function updateProfile(payload: { name: string; email: string }) {
  return apiFetch('/users/me', { method: 'PUT', body: payload });
}

export async function changePhoto(file: File) {
  const formData = new FormData();
  formData.append('photo', file);
  return apiFetch('/users/me/photo', { method: 'POST', body: formData, isFormData: true });
}

export async function changePassword(payload: {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}) {
  return apiFetch('/users/password', { method: 'PUT', body: payload });
}
