'use client'

import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'
import { WhatsAppButton } from '@/components/contact-buttons'

export function AboutSection() {
  const { t, locale } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24" aria-labelledby="about-heading">
      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading id="about-heading" kicker={t.about.kicker} title={t.about.title} />
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed text-pretty text-muted-foreground">{t.about.text}</p>
          <p className="leading-relaxed text-pretty text-muted-foreground">{t.about.text2}</p>
          <div className="mt-2">
            <WhatsAppButton
              message={
                locale === 'fr'
                  ? 'Bonjour ADF, je souhaite discuter de mon projet et obtenir un devis gratuit.'
                  : 'Hello ADF, I would like to discuss my project and get a free quote.'
              }
              label={t.common.getQuote}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
