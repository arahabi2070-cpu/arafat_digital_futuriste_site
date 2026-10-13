import type { Metadata } from 'next'
import { ContactContent } from "@/components/contact-content"

export const metadata: Metadata = {
  title: 'Contact ADF Arafat Digital futuriste — Studio de design à Garoua',
  description: 'Contactez ADF à Garoua et au Cameroun pour créer un site web, une boutique en ligne ou promouvoir une école, une entreprise, un supermarché, une boutique ou un événement.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactContent />
}
