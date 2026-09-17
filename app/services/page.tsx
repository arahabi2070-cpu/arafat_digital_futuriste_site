import type { Metadata } from 'next'
import { ServicesContent } from '@/components/services-content'

export const metadata: Metadata = {
  title: 'Services de design graphique et vidéo à Garoua',
  description: 'Découvrez les services ADF à Garoua : logos, identité visuelle, affiches, supports imprimés, vidéos publicitaires, formations et ebooks.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesContent />
}
