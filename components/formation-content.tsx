"use client"

import { useLanguage } from "@/components/language-provider"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { WhatsAppButton, CallButton } from "@/components/contact-buttons"
import { FinalCta } from "@/components/home/final-cta"
import { GraduationCap, BookOpen, Check } from "lucide-react"

export function FormationContent() {
  const { t } = useLanguage()
  const training = t.services.training
  const ebooks = t.services.ebooks

  return (
    <main>
      <PageHero kicker={t.trainingPage.kicker} title={t.trainingPage.title} subtitle={t.trainingPage.subtitle} />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        {/* Formation */}
        <section aria-labelledby="formation-heading">
          <SectionHeading id="formation-heading" title={t.trainingPage.formationTitle} subtitle={training.desc} />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
              <span className="brand-gradient mb-4 inline-flex size-12 items-center justify-center rounded-xl text-primary-foreground">
                <GraduationCap className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-semibold">{training.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{training.desc}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {training.features.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-5">
                <span className="text-sm text-muted-foreground">{t.common.from}</span>
                <span className="font-display text-2xl font-bold">
                  {training.price} <span className="text-sm font-medium text-muted-foreground">{t.common.fcfa}</span>
                </span>
              </div>
              <div className="mt-5">
                <WhatsAppButton
                  label={t.trainingPage.enroll}
                  message={`${training.name} — ${t.trainingPage.enroll}`}
                  full
                />
              </div>
            </article>

            <div className="brand-soft-surface flex flex-col justify-center rounded-2xl border border-primary/10 p-6">
              <h3 className="font-display text-lg font-semibold text-balance">{t.process.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {t.process.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="brand-gradient flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Ebooks */}
        <section aria-labelledby="ebooks-heading" className="mt-16">
          <SectionHeading id="ebooks-heading" title={t.trainingPage.ebookTitle} subtitle={ebooks.desc} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ebooks.features.map((feature) => (
              <article
                key={feature}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="brand-soft-surface flex aspect-[4/3] items-center justify-center border-b border-primary/10">
                  <BookOpen className="size-14 text-primary" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold">{ebooks.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{feature}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-display text-xl font-bold">
                      {ebooks.price} <span className="text-xs font-medium text-muted-foreground">{t.common.fcfa}</span>
                    </span>
                    <WhatsAppButton label={t.trainingPage.buy} message={`${ebooks.name}: ${feature}`} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <FinalCta />
    </main>
  )
}
