'use client'

import { Info } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { PageHero } from '@/components/page-hero'
import { ServiceCard } from '@/components/service-card'
import { FinalCta } from '@/components/home/final-cta'
import { DeliverySection } from '@/components/home/delivery-section'
import { SERVICE_KEYS } from '@/lib/i18n'

export function ServicesContent() {
  const { t } = useLanguage()

  return (
    <main>
      <PageHero kicker={t.servicesSection.kicker} title={t.nav.services} subtitle={t.servicesSection.subtitle} />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-primary/20 bg-accent/60 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-accent-foreground">
            {t.common.from} — {t.finalCta.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_KEYS.map((key) => (
            <ServiceCard key={key} serviceKey={key} detailed />
          ))}
        </div>
      </section>

      <DeliverySection />
      <FinalCta />
    </main>
  )
}
