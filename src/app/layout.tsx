import type { Metadata } from 'next';
import StoreProvider from '@/store/StoreProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Posts - Delcom',
  description:
    'Aplikasi manajemen postingan Delcom — bagikan status, like, dan komentar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
