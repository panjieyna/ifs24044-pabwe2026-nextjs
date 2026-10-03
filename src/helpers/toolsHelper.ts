async function getSwal() {
  const mod = await import('sweetalert2');
  return mod.default;
}

export async function showSuccessDialog(title: string, text = '') {
  const Swal = await getSwal();
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#0369a1',
  });
}

export async function showErrorDialog(title: string, text = '') {
  const Swal = await getSwal();
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#dc2626',
  });
}

export async function showWarningDialog(title: string, text = '') {
  const Swal = await getSwal();
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#d97706',
  });
}

export async function showConfirmDialog(
  title: string,
  text = '',
  confirmText = 'Ya',
  cancelText = 'Batal'
) {
  const Swal = await getSwal();
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#0369a1',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function coverUrl(cover?: string | null) {
  if (!cover) return null;
  if (cover.startsWith('http')) return cover;
  return `https://open-api.delcom.org/${cover}`;
}

export function photoUrl(photo?: string | null) {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `https://open-api.delcom.org/${photo}`;
}