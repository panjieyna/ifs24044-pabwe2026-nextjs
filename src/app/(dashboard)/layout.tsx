'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/helpers/apiHelper';
import { useAppDispatch } from '@/hooks/redux';
import { asyncGetProfile } from '@/features/users/states/action';
import NavbarComponent from '@/features/posts/components/NavbarComponent';
import SidebarComponent from '@/features/posts/components/SidebarComponent';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (!getAccessToken()) {
        router.replace('/auth/login');
        return;
      }
      try {
        await dispatch(asyncGetProfile());
        setReady(true);
      } catch {
        router.replace('/auth/login');
      }
    }
    init();
  }, [dispatch, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
