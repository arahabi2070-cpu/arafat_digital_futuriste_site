import type { Metadata } from 'next'
import { ServicesContent } from '@/components/services-content'

export const metadata: Metadata = {
  title: 'Sites web, boutiques en ligne et communication promotionnelle à Garoua',
  description: 'Depuis Garoua, ADF crée en ligne partout au Cameroun des sites web, boutiques en ligne et campagnes promotionnelles pour les écoles, entreprises, supermarchés, boutiques et organisations.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return <ServicesContent />
}
