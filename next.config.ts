import type { NextConfig } from 'next';

const DELCOM_TARGET =
  process.env.NEXT_PUBLIC_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/delcom/:path*',
        destination: `${DELCOM_TARGET}/:path*`,
      },
    ];
  },
};

export default nextConfig;