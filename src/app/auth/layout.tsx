'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/helpers/apiHelper';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (getAccessToken()) router.replace('/posts');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <aside
        className="hidden md:flex md:w-1/2 bg-sky-800 text-white p-12 flex-col justify-center items-center relative overflow-hidden"
        aria-label="Informasi aplikasi"
      >
        <div className="relative z-10 text-center max-w-md">
          <p className="text-4xl font-extrabold mb-4">Delcom Posts</p>
          <p className="text-sky-100 text-lg leading-relaxed">
            Bagikan postingan, berikan like, dan berdiskusi lewat komentar.
          </p>
        </div>
      </aside>
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
