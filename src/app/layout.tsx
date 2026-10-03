import type { Metadata } from 'next';
import StoreProvider from '@/store/StoreProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Posts - Delcom',
  description: 'Aplikasi manajemen postingan Delcom',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}