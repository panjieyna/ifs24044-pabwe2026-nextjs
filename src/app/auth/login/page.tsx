'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { asyncSetIsAuthLogin } from '@/features/auth/states/action';
import useInput from '@/hooks/useInput';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthLogin } = useAppSelector((s) => s.auth);
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email dan kata sandi wajib diisi');
      return;
    }
    try {
      await dispatch(asyncSetIsAuthLogin({ email, password }));
      router.replace('/posts');
    } catch {
      /* handled */
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Masuk</h1>
        <p className="text-slate-600 mt-1">Selamat datang kembali</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}
        <div>
          <label htmlFor="login-email-input" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" aria-hidden />
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="login-password-input" className="block text-sm font-medium text-slate-700 mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" aria-hidden />
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none"
              required
            />
          </div>
        </div>
        <button
          id="login-submit-button"
          type="submit"
          disabled={isAuthLogin}
          className="w-full flex items-center justify-center gap-2 bg-sky-800 hover:bg-sky-900 disabled:bg-sky-600 text-white font-semibold py-2.5 rounded-xl"
        >
          <FiLogIn aria-hidden />
          {isAuthLogin ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-6">
        Belum punya akun?{' '}
        <Link href="/auth/register" className="text-sky-800 font-semibold hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
