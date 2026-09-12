import { Hero } from '@/components/home/hero'
import { StatsStrip } from '@/components/home/stats-strip'
import { ServicesPreview } from '@/components/home/services-preview'
import { ProcessSection } from '@/components/home/process-section'
import { DeliverySection } from '@/components/home/delivery-section'
import { FinalCta } from '@/components/home/final-cta'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <ServicesPreview />
      <ProcessSection />
      <DeliverySection />
      <FinalCta />
    </main>
  )
}
