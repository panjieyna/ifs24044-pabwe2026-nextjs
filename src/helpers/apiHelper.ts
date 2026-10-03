import { DELCOM_BASEURL } from '@/lib/config';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function putAccessToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('accessToken', token);
  else localStorage.removeItem('accessToken');
}

export function removeAccessToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  isFormData?: boolean;
  auth?: boolean;
};

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const {
    method = 'GET',
    body = null,
    params = null,
    isFormData = false,
    auth = true,
  } = options;

  let url = `${DELCOM_BASEURL}${path.startsWith('/') ? path : `/${path}`}`;

  if (params && typeof params === 'object') {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        search.append(key, String(value));
      }
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (!isFormData) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = { method, headers };
  if (body !== null && body !== undefined) {
    fetchOptions.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  let data: any;
  try {
    data = await response.json();
  } catch {
    data = { status: 'fail', message: 'Respons tidak valid' };
  }

  if (!response.ok || data.status === 'fail') {
    const error: any = new Error(data.message || 'Terjadi kesalahan');
    error.data = data.data || null;
    error.status = data.status || 'fail';
    throw error;
  }

  return data;
}
