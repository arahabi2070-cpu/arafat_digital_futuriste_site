'use client'

import { useLanguage } from '@/components/language-provider'
import { WhatsAppButton, CallButton } from '@/components/contact-buttons'
import { CONTACT } from '@/lib/i18n'

export function FinalCta() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="brand-gradient relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-primary-foreground sm:text-4xl">
            {t.finalCta.title}
          </h2>
          <p className="text-pretty leading-relaxed text-primary-foreground/90">{t.finalCta.subtitle}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              message="Bonjour ADF, je veux démarrer mon projet. Voici mon besoin :"
              label={t.finalCta.button}
              size="lg"
              className="bg-background !text-primary shadow-xl"
            />
            <CallButton size="lg" className="border-primary-foreground/30 bg-primary-foreground/10 !text-primary-foreground hover:bg-primary-foreground/20" />
          </div>
          <p className="text-sm font-medium text-primary-foreground/80">{CONTACT.phoneDisplay}</p>
        </div>
      </div>
    </section>
  )
}
