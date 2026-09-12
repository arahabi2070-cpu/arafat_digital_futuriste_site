'use client'

import { Truck, RefreshCw, BadgeDollarSign, MessagesSquare } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export function StatsStrip() {
  const { t } = useLanguage()

  const items = [
    { icon: Truck, label: t.stats.delivery, value: t.stats.deliveryValue },
    { icon: RefreshCw, label: t.stats.revisions, value: t.stats.revisionsValue },
    { icon: BadgeDollarSign, label: t.stats.price, value: t.stats.priceValue },
    { icon: MessagesSquare, label: t.stats.support, value: t.stats.supportValue },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col gap-2 bg-card p-5">
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <p className="font-display text-base font-bold leading-tight text-balance">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
