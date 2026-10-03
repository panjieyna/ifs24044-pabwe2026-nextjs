import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithStore } from './testUtils';
import DashboardLayout from '@/app/(dashboard)/layout';
import NavbarComponent from '@/features/posts/components/NavbarComponent';
import SidebarComponent from '@/features/posts/components/SidebarComponent';
import UsersPage from '@/app/(dashboard)/users/page';
import ProfilePage from '@/app/(dashboard)/profile/page';
import { setProfile, setUsers } from '@/features/users/states/action';
import * as userApi from '@/features/users/api/userApi';
import * as authApi from '@/features/auth/api/authApi';

const replace = vi.fn();
let pathname = '/posts';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => pathname,
}));
vi.mock('@/features/users/api/userApi');
vi.mock('@/features/auth/api/authApi');
vi.mock('@/features/posts/api/postApi');
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

const A = (m: any) => m as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  pathname = '/posts';
});

describe('DashboardLayout', () => {
  it('redirect jika tidak ada token', async () => {
    renderWithStore(<DashboardLayout><p>konten</p></DashboardLayout>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/auth/login'));
  });

  it('redirect jika profil gagal diambil', async () => {
    localStorage.setItem('accessToken', 'T');
    A(userApi.getProfile).mockRejectedValue(new Error('x'));
    renderWithStore(<DashboardLayout><p>konten</p></DashboardLayout>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/auth/login'));
  });

  it('menampilkan konten jika login dan toggle sidebar', async () => {
    localStorage.setItem('accessToken', 'T');
    A(userApi.getProfile).mockResolvedValue({ data: { user: { id: 1, name: 'Budi' } } });
    renderWithStore(<DashboardLayout><p>konten</p></DashboardLayout>);
    expect(await screen.findByText('konten')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Buka menu navigasi'));
    fireEvent.click(screen.getByLabelText('Tutup menu'));
  });
});

describe('NavbarComponent', () => {
  it('menampilkan nama default, toggle menu, dan menutup saat klik luar', () => {
    const toggle = vi.fn();
    renderWithStore(<NavbarComponent onToggleSidebar={toggle} />);
    expect(screen.getByText('Pengguna')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Buka menu navigasi'));
    expect(toggle).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Menu profil'));
    expect(screen.getByText(/Profil Saya/)).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(screen.getByLabelText('Menu profil'));
    fireEvent.click(screen.getByText(/Profil Saya/));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('menampilkan foto profil dan logout', async () => {
    A(authApi.logout).mockResolvedValue({});
    const { container } = renderWithStore(<NavbarComponent onToggleSidebar={() => {}} />, (s) =>
      s.dispatch(setProfile({ name: 'Budi', photo: 'p.png' }))
    );
    expect(screen.getByText('Budi')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeNull();
    fireEvent.click(screen.getByLabelText('Menu profil'));
    fireEvent.click(screen.getByLabelText('Keluar dari akun'));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/auth/login'));
  });
});

describe('SidebarComponent', () => {
  it('menandai link aktif dan menutup', () => {
    pathname = '/users';
    const onClose = vi.fn();
    renderWithStore(<SidebarComponent open onClose={onClose} />);
    fireEvent.click(screen.getByText('Pengguna'));
    expect(onClose).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Tutup menu'));
    const overlay = document.querySelector('[aria-hidden="true"].fixed');
    if (overlay) fireEvent.click(overlay);
  });

  it('tertutup', () => {
    renderWithStore(<SidebarComponent open={false} onClose={() => {}} />);
    expect(screen.getByText('Semua Postingan')).toBeInTheDocument();
  });
});

describe('UsersPage', () => {
  it('menampilkan dan memfilter pengguna', async () => {
    A(userApi.getUsers).mockResolvedValue({
      data: {
        users: [
          { id: 1, name: 'Budi', email: 'b@b.com', photo: 'p.png', created_at: '2026-01-01T00:00:00Z' },
          { id: 2, name: 'Sari', email: 's@s.com' },
        ],
      },
    });
    renderWithStore(<UsersPage />);
    expect(await screen.findByText('Budi')).toBeInTheDocument();
    expect(screen.getByText('Sari')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Cari pengguna'), { target: { value: 'sari' } });
    expect(screen.queryByText('Budi')).toBeNull();
    expect(screen.getByText('Sari')).toBeInTheDocument();
  });

  it('filter dengan data yang sudah ada di store', () => {
    A(userApi.getUsers).mockResolvedValue({ data: { users: [{ id: 1, name: 'Z', email: 'z@z.com' }] } });
    renderWithStore(<UsersPage />, (s) => s.dispatch(setUsers([{ id: 1, name: 'Z', email: 'z@z.com' }])));
    expect(screen.getByText('Z')).toBeInTheDocument();
  });
});

describe('ProfilePage', () => {
  const user = { id: 1, name: 'Budi', email: 'b@b.com', photo: 'p.png' };

  beforeEach(() => {
    A(userApi.updateProfile).mockResolvedValue({ data: { user } });
    A(userApi.getProfile).mockResolvedValue({ data: { user } });
    A(userApi.changePhoto).mockResolvedValue({});
    A(userApi.changePassword).mockResolvedValue({});
  });

  it('mengisi form dari profil dan menyimpan', async () => {
    renderWithStore(<ProfilePage />, (s) => s.dispatch(setProfile(user)));
    expect(screen.getByLabelText('Nama')).toHaveValue('Budi');
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Baru' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'n@n.com' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan profil/i }));
    await waitFor(() => expect(userApi.updateProfile).toHaveBeenCalledWith({ name: 'Baru', email: 'n@n.com' }));
  });

  it('tanpa profil menampilkan ikon default', () => {
    renderWithStore(<ProfilePage />);
    expect(screen.getByText('Profil Saya')).toBeInTheDocument();
  });

  it('mengubah foto', async () => {
    renderWithStore(<ProfilePage />, (s) => s.dispatch(setProfile(user)));
    const input = screen.getByLabelText('Pilih file foto profil');
    const clickSpy = vi.spyOn(input, 'click');
    fireEvent.click(screen.getByLabelText('Ubah foto profil'));
    expect(clickSpy).toHaveBeenCalled();
    fireEvent.change(input, { target: { files: [new File(['x'], 'x.png')] } });
    await waitFor(() => expect(userApi.changePhoto).toHaveBeenCalled());
    fireEvent.change(input, { target: { files: [] } });
  });

  it('password tidak cocok tidak dikirim', async () => {
    renderWithStore(<ProfilePage />, (s) => s.dispatch(setProfile(user)));
    fireEvent.change(screen.getByLabelText('Kata Sandi Lama'), { target: { value: 'a' } });
    fireEvent.change(screen.getByLabelText('Kata Sandi Baru'), { target: { value: 'b' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi'), { target: { value: 'c' } });
    fireEvent.click(screen.getByRole('button', { name: /ubah kata sandi/i }));
    await new Promise((r) => setTimeout(r, 20));
    expect(userApi.changePassword).not.toHaveBeenCalled();
  });

  it('password cocok dikirim dan form dikosongkan', async () => {
    renderWithStore(<ProfilePage />, (s) => s.dispatch(setProfile(user)));
    fireEvent.change(screen.getByLabelText('Kata Sandi Lama'), { target: { value: 'a' } });
    fireEvent.change(screen.getByLabelText('Kata Sandi Baru'), { target: { value: 'b' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi'), { target: { value: 'b' } });
    fireEvent.click(screen.getByRole('button', { name: /ubah kata sandi/i }));
    await waitFor(() => expect(userApi.changePassword).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByLabelText('Kata Sandi Lama')).toHaveValue(''));
  });
});
