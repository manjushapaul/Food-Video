/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'unsplash.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
        port: '1337',
      },
      {
        protocol: 'https',
        hostname: '**.ngrok-free.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.ngrok-free.dev',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.loca.lt',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    return [
      {
        source: '/admin/:path*',
        destination: `${STRAPI_URL}/admin/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${STRAPI_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${STRAPI_URL}/uploads/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
