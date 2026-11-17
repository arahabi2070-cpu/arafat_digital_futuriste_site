'use client'

import { useLanguage } from '@/components/language-provider'
import { PageHero } from '@/components/page-hero'

export function LegalContent() {
  const { t } = useLanguage()
  const legal = t.legalPage

  const sections = [
    { title: legal.publisherTitle, text: legal.publisherText },
    { title: legal.hostingTitle, text: legal.hostingText },
    { title: legal.contactTitle, text: legal.contactText },
  ]

  return (
    <main>
      <PageHero kicker={legal.kicker} title={legal.title} subtitle={legal.subtitle} />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
