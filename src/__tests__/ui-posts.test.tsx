import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Swal from 'sweetalert2';
import { renderWithStore } from './testUtils';
import PostsHomePage from '@/app/(dashboard)/posts/page';
import PostDetailPage from '@/app/(dashboard)/posts/[id]/page';
import { setProfile } from '@/features/users/states/action';
import * as postApi from '@/features/posts/api/postApi';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useParams: () => ({ id: '7' }),
}));
vi.mock('@/features/posts/api/postApi');
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

const A = (m: any) => m as ReturnType<typeof vi.fn>;

const posts = [
  {
    id: 1,
    description: 'Halo dunia',
    cover: 'c.png',
    author: { name: 'Budi' },
    created_at: '2026-01-01T00:00:00Z',
    likes_count: 3,
    comments_count: 2,
  },
  { id: 2, description: 'Kedua', user: { name: 'Sari' }, likes: [1], comments: [1, 2] },
  { id: 3, description: 'Ketiga' },
];

beforeEach(() => {
  vi.clearAllMocks();
  (Swal.fire as any).mockResolvedValue({ isConfirmed: true });
});

describe('PostsHomePage', () => {
  beforeEach(() => {
    A(postApi.getPosts).mockResolvedValue({ data: { posts } });
    A(postApi.addPost).mockResolvedValue({});
  });

  it('menampilkan, mencari, dan filter postingan saya', async () => {
    renderWithStore(<PostsHomePage />);
    expect(await screen.findByText('Halo dunia')).toBeInTheDocument();
    expect(screen.getByText('Kedua')).toBeInTheDocument();
    expect(screen.getByText('Ketiga')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Cari postingan'), { target: { value: 'sari' } });
    expect(screen.queryByText('Halo dunia')).toBeNull();
    fireEvent.change(screen.getByLabelText('Cari postingan'), { target: { value: 'budi' } });
    expect(screen.getByText('Halo dunia')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Cari postingan'), { target: { value: 'tidak ada' } });
    expect(screen.getByText('Belum ada postingan')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Postingan Saya'));
    await waitFor(() => expect(postApi.getPosts).toHaveBeenLastCalledWith({ is_me: 1 }));
  });

  it('menambah postingan', async () => {
    renderWithStore(<PostsHomePage />);
    fireEvent.click(screen.getByRole('button', { name: /tambah postingan/i }));
    const form = screen.getByLabelText('Deskripsi').closest('form')!;
    fireEvent.submit(form); // kosong -> tidak dikirim
    expect(postApi.addPost).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Deskripsi'), { target: { value: 'baru' } });
    fireEvent.submit(form);
    await waitFor(() => expect(postApi.addPost).toHaveBeenCalledWith({ description: 'baru' }));
    await waitFor(() => expect(screen.queryByLabelText('Deskripsi')).toBeNull());
  });

  it('batal menambah dan gagal menambah', async () => {
    renderWithStore(<PostsHomePage />);
    fireEvent.click(screen.getByRole('button', { name: /tambah postingan/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.queryByLabelText('Deskripsi')).toBeNull();

    A(postApi.addPost).mockRejectedValue(new Error('x'));
    fireEvent.click(screen.getByRole('button', { name: /tambah postingan/i }));
    fireEvent.change(screen.getByLabelText('Deskripsi'), { target: { value: 'baru' } });
    fireEvent.submit(screen.getByLabelText('Deskripsi').closest('form')!);
    await waitFor(() => expect(postApi.addPost).toHaveBeenCalled());
    expect(screen.getByLabelText('Deskripsi')).toBeInTheDocument();
  });
});

describe('PostDetailPage', () => {
  const post = {
    id: 7,
    user_id: 1,
    description: 'Isi post',
    cover: 'c.png',
    author: { id: 1, name: 'Budi' },
    created_at: '2026-01-01T00:00:00Z',
    likes_count: 2,
    comments: [
      { id: 10, author: { name: 'Sari' }, comment: 'Bagus' },
      { id: 11, user: { name: 'Eko' }, content: 'Mantap' },
      { id: 12 },
    ],
  };

  beforeEach(() => {
    A(postApi.getPostById).mockResolvedValue({ data: { post } });
    A(postApi.likePost).mockResolvedValue({});
    A(postApi.addComment).mockResolvedValue({});
    A(postApi.deleteComment).mockResolvedValue({});
    A(postApi.updatePost).mockResolvedValue({});
    A(postApi.changeCover).mockResolvedValue({});
    A(postApi.deletePost).mockResolvedValue({});
  });

  const owner = (s: any) => s.dispatch(setProfile({ id: 1 }));

  it('menampilkan loading lalu detail (bukan pemilik)', async () => {
    renderWithStore(<PostDetailPage />, (s) => s.dispatch(setProfile({ id: 99 })));
    expect(await screen.findByText('Isi post')).toBeInTheDocument();
    expect(screen.queryByText(/Ubah/)).toBeNull();
    expect(screen.getByText('Bagus')).toBeInTheDocument();
    expect(screen.getByText('Mantap')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('like postingan', async () => {
    renderWithStore(<PostDetailPage />);
    fireEvent.click(await screen.findByRole('button', { name: /like/i }));
    await waitFor(() => expect(postApi.likePost).toHaveBeenCalledWith('7', 1));
  });

    it('unlike jika sudah di-like oleh saya', async () => {
    A(postApi.getPostById).mockResolvedValue({ data: { post: { ...post, likes: [1, 5] } } });
    renderWithStore(<PostDetailPage />, (s) => s.dispatch(setProfile({ id: 1 })));
    const btn = await screen.findByRole('button', { name: /unlike \(2\)/i });
    fireEvent.click(btn);
    await waitFor(() => expect(postApi.likePost).toHaveBeenCalledWith('7', 0));
  });

  it('tombol Like jika orang lain yang me-like', async () => {
    A(postApi.getPostById).mockResolvedValue({ data: { post: { ...post, likes: [2, 3] } } });
    renderWithStore(<PostDetailPage />, (s) => s.dispatch(setProfile({ id: 1 })));
    expect(await screen.findByRole('button', { name: /^like \(2\)/i })).toBeInTheDocument();
  });
  
  it('like gagal ditangani', async () => {
    A(postApi.likePost).mockRejectedValue(new Error('x'));
    renderWithStore(<PostDetailPage />);
    fireEvent.click(await screen.findByRole('button', { name: /like/i }));
    await waitFor(() => expect(postApi.likePost).toHaveBeenCalled());
  });

  it('komentar: kosong diabaikan, isi dikirim, gagal ditangani', async () => {
    renderWithStore(<PostDetailPage />);
    const input = await screen.findByLabelText('Tulis komentar');
    fireEvent.submit(input.closest('form')!);
    expect(postApi.addComment).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: 'halo' } });
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => expect(postApi.addComment).toHaveBeenCalledWith('7', { comment: 'halo' }));
    await waitFor(() => expect(screen.getByLabelText('Tulis komentar')).toHaveValue(''));

    A(postApi.addComment).mockRejectedValue(new Error('x'));
    const input2 = await screen.findByLabelText('Tulis komentar');
    fireEvent.change(input2, { target: { value: 'lagi' } });
    fireEvent.submit(input2.closest('form')!);
    await waitFor(() => expect(postApi.addComment).toHaveBeenCalledTimes(2));
  });

  it('pemilik: ubah postingan', async () => {
    renderWithStore(<PostDetailPage />, owner);
    fireEvent.click(await screen.findByRole('button', { name: /ubah/i }));
    const area = screen.getByLabelText('Deskripsi');
    fireEvent.change(area, { target: { value: 'diubah' } });
    fireEvent.submit(area.closest('form')!);
    await waitFor(() => expect(postApi.updatePost).toHaveBeenCalledWith('7', { description: 'diubah' }));
    await waitFor(() => expect(screen.queryByLabelText('Deskripsi')).toBeNull());
  });

  it('pemilik: batal ubah dan ubah gagal', async () => {
    renderWithStore(<PostDetailPage />, owner);
    fireEvent.click(await screen.findByRole('button', { name: /ubah/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.queryByLabelText('Deskripsi')).toBeNull();
    A(postApi.updatePost).mockRejectedValue(new Error('x'));
    fireEvent.click(screen.getByRole('button', { name: /ubah/i }));
    fireEvent.submit(screen.getByLabelText('Deskripsi').closest('form')!);
    await waitFor(() => expect(postApi.updatePost).toHaveBeenCalled());
  });

  it('pemilik: ganti cover', async () => {
    renderWithStore(<PostDetailPage />, owner);
    const input = await screen.findByLabelText('Unggah cover');
    fireEvent.change(input, { target: { files: [] } });
    expect(postApi.changeCover).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { files: [new File(['x'], 'x.png')] } });
    await waitFor(() => expect(postApi.changeCover).toHaveBeenCalled());
  });

  it('pemilik: ganti cover gagal ditangani', async () => {
    A(postApi.changeCover).mockRejectedValue(new Error('x'));
    renderWithStore(<PostDetailPage />, owner);
    const input = await screen.findByLabelText('Unggah cover');
    fireEvent.change(input, { target: { files: [new File(['x'], 'x.png')] } });
    await waitFor(() => expect(postApi.changeCover).toHaveBeenCalled());
  });

  it('pemilik: hapus postingan (konfirmasi)', async () => {
    renderWithStore(<PostDetailPage />, owner);
    fireEvent.click(await screen.findByRole('button', { name: /hapus$/i }));
    await waitFor(() => expect(postApi.deletePost).toHaveBeenCalledWith('7'));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/posts'));
  });

  it('pemilik: hapus dibatalkan', async () => {
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
    renderWithStore(<PostDetailPage />, owner);
    fireEvent.click(await screen.findByRole('button', { name: /hapus$/i }));
    await new Promise((r) => setTimeout(r, 20));
    expect(postApi.deletePost).not.toHaveBeenCalled();
  });

  it('pemilik: hapus gagal tidak redirect', async () => {
    A(postApi.deletePost).mockRejectedValue(new Error('x'));
    renderWithStore(<PostDetailPage />, owner);
    fireEvent.click(await screen.findByRole('button', { name: /hapus$/i }));
    await waitFor(() => expect(postApi.deletePost).toHaveBeenCalled());
    expect(replace).not.toHaveBeenCalled();
  });

  it('pemilik: hapus komentar', async () => {
    renderWithStore(<PostDetailPage />, owner);
    const btns = await screen.findAllByLabelText('Hapus komentar');
    fireEvent.click(btns[0]);
    await waitFor(() => expect(postApi.deleteComment).toHaveBeenCalledWith('7', 10));
  });

  it('postingan tanpa komentar dan tanpa cover', async () => {
    A(postApi.getPostById).mockResolvedValue({ data: { post: { id: 7, description: 'Polos' } } });
    renderWithStore(<PostDetailPage />);
    expect(await screen.findByText('Polos')).toBeInTheDocument();
  });
});
