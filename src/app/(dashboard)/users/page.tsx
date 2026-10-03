'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { asyncGetUsers } from '@/features/users/states/action';
import { formatDate, photoUrl } from '@/helpers/toolsHelper';
import { FiSearch, FiUser } from 'react-icons/fi';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((s) => s.users);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u: any) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengguna</h1>
        <p className="text-slate-600 text-sm">Daftar pengguna sistem</p>
      </div>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          aria-label="Cari pengguna"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-sky-700"
        />
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {filtered.map((user: any) => (
            <li key={user.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-12 h-12 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center">
                {user.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl(user.photo) || ''} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-sky-800" aria-hidden />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-sm text-slate-600 truncate">{user.email}</p>
              </div>
              <span className="text-xs text-slate-600 hidden sm:block">{formatDate(user.created_at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
