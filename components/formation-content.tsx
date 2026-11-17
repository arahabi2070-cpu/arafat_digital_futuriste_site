"use client"

import { useLanguage } from "@/components/language-provider"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { WhatsAppButton } from "@/components/contact-buttons"
import { FinalCta } from "@/components/home/final-cta"
import { GraduationCap, Check } from "lucide-react"

export function FormationContent() {
  const { t, locale } = useLanguage()
  const training = t.services.training

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
                  message={
                    locale === "fr"
                      ? "Bonjour ADF, je souhaite m'inscrire à la formation design & vidéo. Pouvez-vous me donner les détails ?"
                      : "Hello ADF, I would like to enroll in the design & video training. Could you send me the details?"
                  }
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
      </div>

      <FinalCta />
    </main>
  )
}
