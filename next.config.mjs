/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.userapi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bike-caucasus.hb.vkcs.cloud',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bike-caucasus-dev.hb.vkcs.cloud',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bike-caucasus-dev.hb.bizmrg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bike-caucasus.hb.bizmrg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gw.cmo.sai.msu.ru',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
