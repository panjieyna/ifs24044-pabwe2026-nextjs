'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { asyncSetIsAuthLogout } from '@/features/auth/states/action';
import { photoUrl } from '@/helpers/toolsHelper';
import { FiMenu, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

export default function NavbarComponent({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((s) => s.users.profile);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    await dispatch(asyncSetIsAuthLogout());
    router.replace('/auth/login');
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 h-16 flex items-center px-4 gap-4">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
        aria-label="Buka menu navigasi"
      >
        <FiMenu size={22} />
      </button>
      <Link href="/posts" className="font-bold text-lg text-sky-800 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-sky-800 text-white flex items-center justify-center text-sm font-extrabold">
          DP
        </span>
        <span className="hidden sm:inline">Delcom Posts</span>
      </Link>
      <div className="flex-1" />
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100"
          aria-label="Menu profil"
          aria-expanded={open}
        >
          <div className="w-9 h-9 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center">
            {profile?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl(profile.photo) || ''} alt="" className="w-full h-full object-cover" />
            ) : (
              <FiUser className="text-sky-800" aria-hidden />
            )}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
            {profile?.name || 'Pengguna'}
          </span>
          <FiChevronDown className="text-slate-600" size={16} aria-hidden />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50" role="menu">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              role="menuitem"
            >
              <FiUser size={16} aria-hidden /> Profil Saya
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
              aria-label="Keluar dari akun"
            >
              <FiLogOut size={16} aria-hidden /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
