import type { Metadata } from 'next'
import { FormationContent } from "@/components/formation-content"

export const metadata: Metadata = {
  title: 'Formation design graphique et vidéo à Garoua',
  description: 'Formations et ebooks ADF pour apprendre le design graphique et la vidéo, avec accompagnement et ressources pratiques.',
  alternates: { canonical: '/formation' },
}

export default function FormationPage() {
  return <FormationContent />
}
