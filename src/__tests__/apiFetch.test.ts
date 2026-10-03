import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, getAccessToken, putAccessToken, removeAccessToken } from '@/helpers/apiHelper';

function mockFetch(body: any, ok = true, jsonFails = false) {
  const fn = vi.fn().mockResolvedValue({
    ok,
    json: jsonFails ? () => Promise.reject(new Error('bad')) : () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('apiFetch', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('GET sukses dengan token dan params', async () => {
    putAccessToken('tok');
    const fn = mockFetch({ status: 'success', data: { a: 1 } });
    const res = await apiFetch('posts', { params: { a: 1, b: '', c: null, d: undefined, e: true } });
    expect(res.data.a).toBe(1);
    const [url, opts] = fn.mock.calls[0];
    expect(url).toContain('/posts?a=1&e=true');
    expect(opts.headers.Authorization).toBe('Bearer tok');
    expect(opts.headers['Content-Type']).toBe('application/json');
  });

  it('params kosong tidak menambah query string', async () => {
    const fn = mockFetch({ status: 'success' });
    await apiFetch('/posts', { params: { a: '' } });
    expect(fn.mock.calls[0][0]).not.toContain('?');
  });

  it('POST JSON tanpa auth', async () => {
    putAccessToken('tok');
    const fn = mockFetch({ status: 'success' });
    await apiFetch('/auth/login', { method: 'POST', body: { x: 1 }, auth: false });
    const opts = fn.mock.calls[0][1];
    expect(opts.body).toBe(JSON.stringify({ x: 1 }));
    expect(opts.headers.Authorization).toBeUndefined();
  });

  it('tanpa token tidak ada header Authorization', async () => {
    const fn = mockFetch({ status: 'success' });
    await apiFetch('/users');
    expect(fn.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('FormData tidak diberi Content-Type', async () => {
    const fn = mockFetch({ status: 'success' });
    const fd = new FormData();
    await apiFetch('/x', { method: 'POST', body: fd, isFormData: true });
    const opts = fn.mock.calls[0][1];
    expect(opts.body).toBe(fd);
    expect(opts.headers['Content-Type']).toBeUndefined();
  });

  it('melempar error jika response tidak ok', async () => {
    mockFetch({ status: 'fail', message: 'Gagal', data: { f: 1 } }, false);
    await expect(apiFetch('/x')).rejects.toMatchObject({ message: 'Gagal', data: { f: 1 }, status: 'fail' });
  });

  it('melempar error default jika tidak ada pesan', async () => {
    mockFetch({ status: 'fail' }, true);
    await expect(apiFetch('/x')).rejects.toMatchObject({ message: 'Terjadi kesalahan', data: null });
  });

  it('melempar error jika respons bukan JSON', async () => {
    mockFetch(null, true, true);
    await expect(apiFetch('/x')).rejects.toMatchObject({ message: 'Respons tidak valid' });
  });

  it('token helper', () => {
    putAccessToken('abc');
    expect(getAccessToken()).toBe('abc');
    putAccessToken(null);
    expect(getAccessToken()).toBeNull();
    putAccessToken('abc');
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it('token helper aman saat window tidak ada (SSR)', () => {
    const w = globalThis.window;
    vi.stubGlobal('window', undefined);
    expect(getAccessToken()).toBeNull();
    expect(() => putAccessToken('x')).not.toThrow();
    expect(() => removeAccessToken()).not.toThrow();
    vi.stubGlobal('window', w);
  });
});
