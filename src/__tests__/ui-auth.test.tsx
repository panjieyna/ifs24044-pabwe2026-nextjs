import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithStore } from './testUtils';
import LoginPage from '@/app/auth/login/page';
import RegisterPage from '@/app/auth/register/page';
import AuthLayout from '@/app/auth/layout';
import RootPage from '@/app/page';
import RootLayout, { metadata } from '@/app/layout';
import * as authApi from '@/features/auth/api/authApi';

const replace = vi.fn();
const redirect = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  redirect: (p: string) => redirect(p),
}));
vi.mock('@/features/auth/api/authApi');
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('LoginPage', () => {
  it('validasi field kosong', async () => {
    renderWithStore(<LoginPage />);
    const form = screen.getByRole('button', { name: /masuk/i }).closest('form')!;
    fireEvent.submit(form);
    expect(await screen.findByText(/wajib diisi/i)).toBeInTheDocument();
  });

  it('login sukses lalu redirect ke /posts', async () => {
    (authApi.login as any).mockResolvedValue({ data: { token: 'T' } });
    renderWithStore(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText('Kata Sandi'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /masuk/i }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/posts'));
    expect(localStorage.getItem('accessToken')).toBe('T');
  });

  it('login gagal tidak redirect', async () => {
    (authApi.login as any).mockRejectedValue(new Error('salah'));
    renderWithStore(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText('Kata Sandi'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /masuk/i }));
    await waitFor(() => expect(authApi.login).toHaveBeenCalled());
    expect(replace).not.toHaveBeenCalled();
  });
});

describe('RegisterPage', () => {
  it('validasi field kosong', async () => {
    renderWithStore(<RegisterPage />);
    fireEvent.submit(screen.getByRole('button', { name: /daftar/i }).closest('form')!);
    expect(await screen.findByText(/semua field wajib diisi/i)).toBeInTheDocument();
  });

  it('register sukses redirect ke login', async () => {
    (authApi.register as any).mockResolvedValue({});
    renderWithStore(<RegisterPage />);
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Budi' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'b@b.com' } });
    fireEvent.change(screen.getByLabelText('Kata Sandi'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /daftar/i }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/auth/login'));
  });

  it('register gagal tidak redirect', async () => {
    (authApi.register as any).mockRejectedValue(new Error('x'));
    renderWithStore(<RegisterPage />);
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Budi' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'b@b.com' } });
    fireEvent.change(screen.getByLabelText('Kata Sandi'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /daftar/i }));
    await waitFor(() => expect(authApi.register).toHaveBeenCalled());
    expect(replace).not.toHaveBeenCalled();
  });
});

describe('AuthLayout', () => {
  it('menampilkan children jika belum login', () => {
    renderWithStore(<AuthLayout><p>isi</p></AuthLayout>);
    expect(screen.getByText('isi')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirect ke /posts jika sudah login', () => {
    localStorage.setItem('accessToken', 'T');
    renderWithStore(<AuthLayout><p>isi</p></AuthLayout>);
    expect(replace).toHaveBeenCalledWith('/posts');
  });
});

describe('Root', () => {
  it('RootPage redirect ke /posts', () => {
    RootPage();
    expect(redirect).toHaveBeenCalledWith('/posts');
  });

  it('RootLayout membungkus children', () => {
    const el: any = RootLayout({ children: <p>x</p> });
    expect(el.type).toBe('html');
    expect(el.props.lang).toBe('id');
    expect(metadata.title).toBeTruthy();
  });
});
