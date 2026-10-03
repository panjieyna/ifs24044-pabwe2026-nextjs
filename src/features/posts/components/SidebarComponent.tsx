'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiUser, FiX } from 'react-icons/fi';

const links = [
  { href: '/posts', label: 'Semua Postingan', icon: FiHome },
  { href: '/users', label: 'Pengguna', icon: FiUsers },
  { href: '/profile', label: 'Profil Saya', icon: FiUser },
];

export default function SidebarComponent({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Sidebar navigasi"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 lg:hidden">
          <span className="font-bold text-sky-800">Menu</span>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Tutup menu">
            <FiX size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1" aria-label="Navigasi utama">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/posts' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
