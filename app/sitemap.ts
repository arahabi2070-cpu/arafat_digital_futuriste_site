import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://adf-go.vercel.app'
  const routes = [
    { path: '', priority: 1 },
    { path: '/services', priority: 0.9 },
    { path: '/portfolio', priority: 0.8 },
    { path: '/formation', priority: 0.7 },
    { path: '/contact', priority: 0.8 },
    { path: '/google-profile', priority: 0.6 },
  ]
  return routes.map(({ path, priority }) => ({ url: `${base}${path}`, changeFrequency: 'weekly', priority }))
}
