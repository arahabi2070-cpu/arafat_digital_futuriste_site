import type { Metadata } from 'next'
import { ContactContent } from "@/components/contact-content"

export const metadata: Metadata = {
  title: 'Contact ADF — Studio de design à Garoua',
  description: 'Contactez ADF à Garoua pour un devis gratuit en design graphique, identité visuelle, impression ou vidéo publicitaire.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactContent />
}
