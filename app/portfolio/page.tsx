import type { Metadata } from 'next'
import { PortfolioGallery } from "@/components/portfolio-gallery"

export const metadata: Metadata = {
  title: 'Portfolio — Réalisations graphiques et vidéos ADF',
  description: 'Explorez les réalisations ADF : logos, affiches, identités visuelles, cartes de visite et vidéos publicitaires conçus à Garoua.',
  alternates: { canonical: '/portfolio' },
}

export default function PortfolioPage() {
  return <PortfolioGallery />
}
