/** @type {import('next').NextConfig} */
const nextConfig = {
  // DigitalOcean App Platform: bind ke PORT dari environment
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
      },
    ],
  },
};

export default nextConfig;
