'use client'

import { Cloud, Package, Gift } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'

export function DeliverySection() {
  const { t } = useLanguage()

  const items = [
    { icon: Cloud, ...t.delivery.digital },
    { icon: Package, ...t.delivery.physical },
    { icon: Gift, ...t.delivery.free, highlight: true },
  ]

  return (
    <section className="brand-soft-surface border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading kicker={t.delivery.kicker} title={t.delivery.title} center className="mx-auto" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc, highlight }) => (
            <div
              key={title}
              className={
                'flex flex-col gap-3 rounded-2xl border bg-card p-6 ' +
                (highlight ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border')
              }
            >
              <span className="brand-gradient flex size-11 items-center justify-center rounded-xl text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
