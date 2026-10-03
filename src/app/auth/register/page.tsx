'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { asyncSetIsAuthRegister } from '@/features/auth/states/action';
import useInput from '@/hooks/useInput';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthRegister } = useAppSelector((s) => s.auth);
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Semua field wajib diisi');
      return;
    }
    try {
      await dispatch(asyncSetIsAuthRegister({ name, email, password }));
      router.replace('/auth/login');
    } catch {
      /* handled */
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Daftar</h1>
        <p className="text-slate-600 mt-1">Buat akun baru</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}
        <div>
          <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nama
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" aria-hidden />
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={onNameChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" aria-hidden />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={onEmailChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" aria-hidden />
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={onPasswordChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 outline-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isAuthRegister}
          className="w-full flex items-center justify-center gap-2 bg-sky-800 hover:bg-sky-900 disabled:bg-sky-600 text-white font-semibold py-2.5 rounded-xl"
        >
          <FiUserPlus aria-hidden />
          {isAuthRegister ? 'Memproses...' : 'Daftar'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-6">
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="text-sky-800 font-semibold hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
