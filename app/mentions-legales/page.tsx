import type { Metadata } from 'next'
import { LegalContent } from '@/components/legal-content'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site ADF — Arafat Digital Futuriste, design graphique et vidéo à Garoua, Cameroun.',
  alternates: { canonical: '/mentions-legales' },
}

export default function LegalNoticePage() {
  return <LegalContent />
}
