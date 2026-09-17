import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/language-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingContact } from '@/components/floating-contact'
import { PwaRegister } from '@/components/pwa-register'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adf-go.vercel.app'
const siteName = 'ADF — Arafat Digital Futuriste'
const description = 'ADF, studio de design graphique et vidéo à Garoua, Cameroun : logos, identité visuelle, affiches, cartes de visite, vidéos publicitaires, formations et ebooks.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'ADF — Design graphique et vidéo à Garoua', template: '%s | ADF' },
  description,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: { canonical: '/' },
  generator: 'Next.js',
  keywords: ['ADF', 'Arafat Digital Futuriste', 'design graphique à Garoua', 'graphiste à Garoua', 'logo au Cameroun', 'identité visuelle Cameroun', 'vidéo publicitaire Garoua'],
  openGraph: { title: 'ADF — Arafat Digital Futuriste | Design graphique à Garoua', description, url: siteUrl, type: 'website', locale: 'fr_FR', siteName, images: [{ url: '/hero-studio.png', width: 1200, height: 630, alt: 'ADF — studio de design graphique et vidéo à Garoua' }] },
  twitter: { card: 'summary_large_image', title: 'ADF — Arafat Digital Futuriste | Design graphique à Garoua', description, images: ['/hero-studio.png'] },
  icons: { icon: '/favicon.png', shortcut: '/favicon.png', apple: '/apple-icon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#ffffff' }

function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfessionalService', '@id': `${siteUrl}/#business`, name: siteName, alternateName: ['ADF', 'Arafat Digital Futuriste'], url: siteUrl, logo: `${siteUrl}/adf-logo.png`, image: `${siteUrl}/hero-studio.png`, description, telephone: '+237695928319', priceRange: 'FCFA', areaServed: [{ '@type': 'City', name: 'Garoua' }, { '@type': 'Country', name: 'Cameroun' }], address: { '@type': 'PostalAddress', addressLocality: 'Garoua', addressCountry: 'CM' } },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: siteName, publisher: { '@id': `${siteUrl}/#business` }, inLanguage: 'fr-FR' },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="antialiased font-sans">
        <StructuredData />
        <LanguageProvider><SiteHeader />{children}<SiteFooter /><FloatingContact /></LanguageProvider>
        <PwaRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
