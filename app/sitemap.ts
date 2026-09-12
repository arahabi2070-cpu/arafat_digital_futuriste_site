import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://adf-go.vercel.app'
  const routes = ['', '/services', '/portfolio', '/formation', '/contact']
  return routes.map((route) => ({ url: `${base}${route}`, changeFrequency: 'weekly', priority: route === '' ? 1 : 0.8 }))
}
