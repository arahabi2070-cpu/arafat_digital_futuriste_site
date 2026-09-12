'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, MapPin } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { WhatsAppButton, CallButton } from '@/components/contact-buttons'
import { CONTACT } from '@/lib/i18n'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] brand-soft-surface" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-16">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
            <MapPin className="size-3.5 text-primary" aria-hidden="true" />
            {t.hero.badge}
          </span>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.hero.title}
            <span className="mt-2 block brand-text-gradient">{t.hero.titleAccent}</span>
          </h1>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton message="Bonjour ADF, je souhaite discuter de mon projet et obtenir un devis gratuit." label={t.hero.ctaPrimary} size="lg" />
            <CallButton size="lg" />
          </div>

          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {[t.hero.trust1, t.hero.trust2, t.hero.trust3].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Check className="size-4 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
            <Image
              src="/hero-studio.png"
              alt="Réalisations de design ADF : logos, affiches, cartes de visite et vidéos"
              width={720}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <Link
            href="/portfolio"
            className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg transition-transform hover:scale-105"
          >
            {t.common.seeWork}
            <ArrowRight className="size-4 text-primary" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <p className="sr-only">{CONTACT.company}</p>
    </section>
  )
}
