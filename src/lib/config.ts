// Semua request ke API Delcom lewat proxy milik aplikasi sendiri (same-origin).
// Tujuan sebenarnya diatur lewat rewrites di next.config.ts.
export const DELCOM_BASEURL = '/api/delcom';

export const APP_PORT = parseInt(process.env.APP_PORT || '3000', 10);