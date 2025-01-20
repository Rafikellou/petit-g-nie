/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
