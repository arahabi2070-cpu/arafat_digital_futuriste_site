import type { Metadata } from 'next'
import { ContactContent } from "@/components/contact-content"

export const metadata: Metadata = {
  title: 'Contact ADF Arafat Digital futuriste — Studio de design à Garoua',
  description: 'Contactez ADF à Garoua pour promouvoir une école, une entreprise, un supermarché, une boutique ou un événement avec une campagne visuelle et vidéo.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactContent />
}
