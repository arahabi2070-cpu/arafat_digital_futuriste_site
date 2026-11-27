/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // La langue est gérée côté client (LanguageProvider, localStorage).
  // Ces redirections empêchent toute 404 sur les URL /en et /fr :
  // /en (et /en/...) atterrit sur la même page avec ?lang=en, que le
  // provider lit au chargement pour afficher directement l'anglais.
  async redirects() {
    return [
      { source: '/en', destination: '/?lang=en', permanent: false },
      { source: '/en/:path*', destination: '/:path*?lang=en', permanent: false },
      { source: '/fr', destination: '/?lang=fr', permanent: false },
      { source: '/fr/:path*', destination: '/:path*?lang=fr', permanent: false },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
