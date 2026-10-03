import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import Swal from 'sweetalert2';
import { APP_PORT, DELCOM_BASEURL } from '@/lib/config';
import useInput from '@/hooks/useInput';
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
  coverUrl,
  photoUrl,
} from '@/helpers/toolsHelper';

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

describe('config', () => {
  it('memiliki nilai default', () => {
    expect(DELCOM_BASEURL).toContain('http');
    expect(typeof APP_PORT).toBe('number');
  });
});

describe('useInput', () => {
  it('menyimpan dan mengubah nilai', () => {
    const { result } = renderHook(() => useInput('awal'));
    expect(result.current[0]).toBe('awal');
    act(() => {
      result.current[1]({ target: { value: 'baru' } } as any);
    });
    expect(result.current[0]).toBe('baru');
    act(() => result.current[2]('manual'));
    expect(result.current[0]).toBe('manual');
  });

  it('default kosong', () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe('');
  });
});

describe('toolsHelper', () => {
  beforeEach(() => vi.clearAllMocks());

  it('dialog memanggil Swal.fire dengan ikon yang tepat', async () => {
    await showSuccessDialog('a');
    await showErrorDialog('b', 'c');
    await showWarningDialog('d');
    await showConfirmDialog('e');
    await showConfirmDialog('f', 'g', 'Hapus', 'Tidak');
    const icons = (Swal.fire as any).mock.calls.map((c: any[]) => c[0].icon);
    expect(icons).toEqual(['success', 'error', 'warning', 'question', 'question']);
  });

  it('formatDate', () => {
    expect(formatDate()).toBe('-');
    expect(formatDate(null)).toBe('-');
    expect(formatDate('2026-01-02T03:04:05Z')).toMatch(/2026/);
  });

  it('formatDate mengembalikan input jika toLocaleString error', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => {
      throw new Error('x');
    });
    expect(formatDate('abc')).toBe('abc');
    spy.mockRestore();
  });

  it('coverUrl dan photoUrl', () => {
    expect(coverUrl()).toBeNull();
    expect(coverUrl('http://x/y.png')).toBe('http://x/y.png');
    expect(coverUrl('a/b.png')).toBe('https://open-api.delcom.org/a/b.png');
    expect(photoUrl(null)).toBeNull();
    expect(photoUrl('https://x/y.png')).toBe('https://x/y.png');
    expect(photoUrl('a/b.png')).toBe('https://open-api.delcom.org/a/b.png');
  });
});
