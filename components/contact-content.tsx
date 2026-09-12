"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { PageHero } from "@/components/page-hero"
import { WhatsAppButton, CallButton } from "@/components/contact-buttons"
import { CONTACT, waLink, SERVICE_KEYS } from "@/lib/i18n"
import { MapPin, Phone, MessageCircle, Clock, Truck, Send } from "lucide-react"

export function ContactContent() {
  const { t, locale } = useLanguage()
  const [service, setService] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get("name") || "")
    const svc = String(fd.get("service") || "")
    const budget = String(fd.get("budget") || "")
    const details = String(fd.get("details") || "")

    const hi = locale === "fr" ? "Bonjour ADF, voici ma demande :" : "Hello ADF, here is my request:"
    const lines = [
      hi,
      "",
      `${t.contactPage.formName}: ${name}`,
      `${t.contactPage.formService}: ${svc}`,
      budget ? `${t.contactPage.formBudget}: ${budget}` : "",
      details ? `${t.contactPage.formMessage}: ${details}` : "",
    ].filter(Boolean)

    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer")
  }

  const infos = [
    { icon: Phone, label: t.contactPage.infoTitle, value: CONTACT.phoneDisplay },
    { icon: MapPin, label: locale === "fr" ? "Localisation" : "Location", value: CONTACT.city },
    {
      icon: Truck,
      label: locale === "fr" ? "Livraison" : "Delivery",
      value: t.delivery.free.desc,
    },
    { icon: Clock, label: t.contactPage.hoursTitle, value: t.contactPage.hours },
  ]

  return (
    <main>
      <PageHero kicker={t.contactPage.kicker} title={t.contactPage.title} subtitle={t.contactPage.subtitle} />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Info column */}
          <div>
            <h2 className="font-display text-2xl font-bold text-balance">{t.contactPage.infoTitle}</h2>
            <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{t.finalCta.subtitle}</p>

            <div className="mt-8 flex flex-col gap-4">
              {infos.map((info) => (
                <div key={info.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                  <span className="brand-soft-surface inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-primary/10">
                    <info.icon className="size-5 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                    <p className="font-semibold text-foreground">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton message={t.finalCta.button} />
              <CallButton />
            </div>
          </div>

          {/* Form column */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5 text-primary" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold">{t.contactPage.title}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.contactPage.subtitle}</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contactPage.formName} <span className="text-primary">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              <div>
                <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contactPage.formService} <span className="text-primary">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  <option value="" disabled>
                    {t.contactPage.selectService}
                  </option>
                  {SERVICE_KEYS.map((key) => (
                    <option key={key} value={t.services[key].name}>
                      {t.services[key].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contactPage.formBudget}
                </label>
                <input
                  id="budget"
                  name="budget"
                  inputMode="numeric"
                  placeholder="10 000"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              <div>
                <label htmlFor="details" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.contactPage.formMessage}
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              <button
                type="submit"
                className="brand-gradient inline-flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
              >
                <Send className="size-4" aria-hidden="true" />
                {t.contactPage.formSubmit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
