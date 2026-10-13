import type { Metadata } from 'next'
import { ServicesContent } from '@/components/services-content'

export const metadata: Metadata = {
  title: 'Communication promotionnelle pour écoles, entreprises et commerces à Garoua',
  description: 'ADF accompagne les écoles, entreprises, supermarchés, boutiques et organisations à Garoua : campagnes promotionnelles, affiches, réseaux sociaux, supports imprimés et vidéos publicitaires.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesContent />
}
