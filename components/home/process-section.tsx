'use client'

import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'

export function ProcessSection() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading kicker={t.process.kicker} title={t.process.title} center className="mx-auto" />

      <ol className="mt-12 grid gap-6 md:grid-cols-4">
        {t.process.steps.map((step, i) => (
          <li key={step.title} className="relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
            <span className="brand-gradient flex size-10 items-center justify-center rounded-full font-display text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="font-display text-base font-semibold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
