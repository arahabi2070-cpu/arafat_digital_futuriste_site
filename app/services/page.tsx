import type { Metadata } from 'next'
import { ServicesContent } from '@/components/services-content'

export const metadata: Metadata = {
  title: 'Sites web, boutiques en ligne et communication promotionnelle à Garoua',
  description: 'ADF crée des sites web, boutiques en ligne et campagnes promotionnelles pour les écoles, entreprises, supermarchés, boutiques et organisations à Garoua et au Cameroun.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesContent />
}
