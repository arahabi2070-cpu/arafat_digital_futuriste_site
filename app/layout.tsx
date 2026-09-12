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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://adf-go.vercel.app'),
  title: { default: 'ADF — Design graphique et vidéo à Garoua', template: '%s | ADF' },
  alternates: { canonical: '/' },
  description: 'ADF crée des logos, identités visuelles, affiches, cartes de visite et vidéos publicitaires à Garoua, Cameroun.',
  applicationName: 'ADF',
  generator: 'Next.js',
  keywords: ['design graphique Cameroun', 'logo Garoua', 'création affiche', 'vidéo publicitaire', 'ADF'],
  openGraph: { title: 'ADF — Design graphique & vidéo à Garoua', description: 'Studio créatif ADF à Garoua, Cameroun.', type: 'website', locale: 'fr_FR', siteName: 'ADF' },
  twitter: { card: 'summary_large_image', title: 'ADF — Design graphique & vidéo à Garoua', description: 'Studio créatif ADF à Garoua, Cameroun.' },
  icons: { icon: '/favicon.png', shortcut: '/favicon.png', apple: '/apple-icon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#ffffff' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="antialiased font-sans">
        <LanguageProvider><SiteHeader />{children}<SiteFooter /><FloatingContact /></LanguageProvider>
        <PwaRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
