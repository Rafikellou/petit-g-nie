/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  },
  // Optimisations pour le déploiement
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  // Configuration pour l'API ElevenLabs
  async headers() {
    return [
      {
        source: '/api/tts',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
