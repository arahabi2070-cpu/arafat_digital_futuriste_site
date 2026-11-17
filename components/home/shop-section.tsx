'use client'

import { Store } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'
import { WhatsAppButton } from '@/components/contact-buttons'

export function ShopSection() {
  const { t, locale } = useLanguage()

  return (
    <section id="boutique" className="scroll-mt-24 border-y border-border bg-secondary/40" aria-labelledby="shop-heading">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-20">
        <span className="brand-soft-surface flex size-12 items-center justify-center rounded-xl border border-primary/10 text-primary">
          <Store className="size-6" aria-hidden="true" />
        </span>
        <SectionHeading id="shop-heading" kicker={t.shop.kicker} title={t.shop.title} center className="mx-auto mt-5" />
        <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-muted-foreground">{t.shop.text}</p>
        <div className="mt-7">
          <WhatsAppButton
            message={
              locale === 'fr'
                ? 'Bonjour ADF, je souhaite commander un produit. Que proposez-vous ?'
                : 'Hello ADF, I would like to order a product. What do you offer?'
            }
            label={t.shop.button}
            size="lg"
          />
        </div>
      </div>
    </section>
  )
}
