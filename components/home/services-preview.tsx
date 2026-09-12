'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'
import { ServiceCard } from '@/components/service-card'
import { SERVICE_KEYS } from '@/lib/i18n'

export function ServicesPreview() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading kicker={t.servicesSection.kicker} title={t.servicesSection.title} subtitle={t.servicesSection.subtitle} />
        <Link
          href="/services"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-secondary"
        >
          {t.nav.services}
          <ArrowRight className="size-4 text-primary" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_KEYS.map((key) => (
          <ServiceCard key={key} serviceKey={key} />
        ))}
      </div>
    </section>
  )
}
