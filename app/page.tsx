import { Hero } from '@/components/home/hero'
import { StatsStrip } from '@/components/home/stats-strip'
import { ServicesPreview } from '@/components/home/services-preview'
import { ProcessSection } from '@/components/home/process-section'
import { DeliverySection } from '@/components/home/delivery-section'
import { AboutSection } from '@/components/home/about-section'
import { ShopSection } from '@/components/home/shop-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { FinalCta } from '@/components/home/final-cta'

// La section Avis lit la base du site quand elle existe : une
// revalidation périodique suffit (un avis approuvé paraît en quelques
// minutes, sans redéploiement). Sans base, la section ne rend rien et
// la page reste exactement celle d'origine.
export const revalidate = 300

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <ServicesPreview />
      <AboutSection />
      <ProcessSection />
      <DeliverySection />
      <ShopSection />
      <ReviewsSection />
      <FinalCta />
    </main>
  )
}
