'use client'

import Image from 'next/image'
import { Truck } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'
import { WhatsAppButton } from '@/components/contact-buttons'

export function ShopSection() {
  const { t, locale } = useLanguage()

  return (
    <section id="boutique" className="scroll-mt-24 border-y border-border bg-secondary/40" aria-labelledby="shop-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[300px_1fr] lg:py-20">
        <div className="mx-auto w-full max-w-[260px] lg:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xl shadow-primary/10">
            <Image
              src="/livre-couverture.png"
              alt={t.shop.coverAlt}
              width={1024}
              height={1536}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <SectionHeading id="shop-heading" kicker={t.shop.kicker} title={t.shop.title} className="items-center lg:items-start" />
          <p className="mt-4 font-display text-lg font-semibold text-foreground">« {t.shop.bookTitle} »</p>
          <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-muted-foreground">{t.shop.text}</p>
          <p className="mt-5 font-display text-3xl font-bold tracking-tight text-primary">{t.shop.priceLabel}</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <Truck className="size-4 text-primary" aria-hidden="true" />
            {t.shop.delivery}
          </p>
          <div className="mt-7">
            <WhatsAppButton
              message={
                locale === 'fr'
                  ? 'Bonjour Arafat, je veux commander le livre imprimé « Révèle et monétise tes compétences avec l’intelligence artificielle » (7 500 FCFA).'
                  : 'Hello Arafat, I would like to order the printed book “Révèle et monétise tes compétences avec l’intelligence artificielle” (7,500 FCFA).'
              }
              label={t.shop.button}
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
