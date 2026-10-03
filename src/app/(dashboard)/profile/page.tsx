'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from '@/features/users/states/action';
import useInput from '@/hooks/useInput';
import { photoUrl } from '@/helpers/toolsHelper';
import { FiUser, FiCamera, FiSave, FiLock } from 'react-icons/fi';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, isChangeProfile, isChangeProfilePhoto, isChangeProfilePassword } =
    useAppSelector((s) => s.users);
  const [name, onNameChange, setName] = useInput('');
  const [email, onEmailChange, setEmail] = useInput('');
  const [password, onPasswordChange, setPassword] = useInput('');
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput('');
  const [confirmPassword, onConfirmPasswordChange, setConfirmPassword] = useInput('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
    }
  }, [profile, setName, setEmail]);

  async function handleProfile(e: React.FormEvent) {
    e.preventDefault();
    await dispatch(asyncChangeProfile({ name, email }));
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await dispatch(asyncChangeProfilePhoto(file));
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    await dispatch(
      asyncChangeProfilePassword({
        password,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })
    );
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <p className="text-slate-600 text-sm">Kelola informasi akun</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center">
            {profile?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl(profile.photo) || ''} alt="" className="w-full h-full object-cover" />
            ) : (
              <FiUser className="text-sky-800" size={36} aria-hidden />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isChangeProfilePhoto}
            aria-label="Ubah foto profil"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-800 text-white flex items-center justify-center"
          >
            <FiCamera size={14} aria-hidden />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="hidden"
            aria-label="Pilih file foto profil"
          />
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-lg text-slate-800">{profile?.name}</p>
          <p className="text-slate-600 text-sm">{profile?.email}</p>
        </div>
      </div>

      <form onSubmit={handleProfile} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800">Informasi Profil</h2>
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700 mb-1">
            Nama
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={onNameChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-700"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={onEmailChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-700"
          />
        </div>
        <button
          type="submit"
          disabled={isChangeProfile}
          className="inline-flex items-center gap-2 bg-sky-800 hover:bg-sky-900 disabled:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl"
        >
          <FiSave size={16} aria-hidden />
          {isChangeProfile ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </form>

      <form onSubmit={handlePassword} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <FiLock size={18} aria-hidden /> Ubah Kata Sandi
        </h2>
        <div>
          <label htmlFor="old-pass" className="block text-sm font-medium text-slate-700 mb-1">
            Kata Sandi Lama
          </label>
          <input
            id="old-pass"
            type="password"
            value={password}
            onChange={onPasswordChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-700"
            required
          />
        </div>
        <div>
          <label htmlFor="new-pass" className="block text-sm font-medium text-slate-700 mb-1">
            Kata Sandi Baru
          </label>
          <input
            id="new-pass"
            type="password"
            value={newPassword}
            onChange={onNewPasswordChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-700"
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-pass" className="block text-sm font-medium text-slate-700 mb-1">
            Konfirmasi
          </label>
          <input
            id="confirm-pass"
            type="password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-sky-700"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isChangeProfilePassword}
          className="inline-flex items-center gap-2 bg-sky-800 hover:bg-sky-900 disabled:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl"
        >
          {isChangeProfilePassword ? 'Menyimpan...' : 'Ubah Kata Sandi'}
        </button>
      </form>
    </div>
  );
}
