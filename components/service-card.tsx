'use client'

import { Check } from 'lucide-react'
import { serviceIcons } from '@/components/service-icons'
import { WhatsAppButton } from '@/components/contact-buttons'
import { useLanguage } from '@/components/language-provider'
import type { ServiceKey } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function ServiceCard({ serviceKey, detailed }: { serviceKey: ServiceKey; detailed?: boolean }) {
  const { t } = useLanguage()
  const Icon = serviceIcons[serviceKey]
  const s = t.services[serviceKey]

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5',
      )}
    >
      <div className="flex items-center gap-3">
        <span className="brand-soft-surface flex size-12 items-center justify-center rounded-xl border border-primary/10 text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <h3 className="font-display text-lg font-semibold leading-tight text-balance">{s.name}</h3>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

      {detailed && (
        <ul className="mt-5 flex flex-col gap-2.5">
          {s.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-end justify-between gap-3 border-t border-border pt-5">
        <div>
          <p className="text-xs text-muted-foreground">{t.common.from}</p>
          <p className="font-display text-2xl font-bold">
            {s.price} <span className="text-sm font-medium text-muted-foreground">{t.common.fcfa}</span>
          </p>
        </div>
      </div>

      {detailed && (
        <div className="mt-4">
          <WhatsAppButton
            message={`Bonjour ADF, je suis intéressé par: ${s.name}. Pouvez-vous me faire un devis ?`}
            label={t.common.getQuote}
            full
          />
        </div>
      )}
    </div>
  )
}
