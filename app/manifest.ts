import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ADF — Arafat Digital Futuriste',
    short_name: 'ADF',
    description: 'Studio de design graphique et vidéo à Garoua, Cameroun.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    lang: 'fr',
    icons: [
      { src: '/favicon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}

