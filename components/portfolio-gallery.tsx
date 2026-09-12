"use client"

import { useState } from "react"
import useSWR from "swr"
import { useLanguage } from "@/components/language-provider"
import { PageHero } from "@/components/page-hero"
import { WhatsAppButton, CallButton } from "@/components/contact-buttons"
import { FinalCta } from "@/components/home/final-cta"
import Image from "next/image"
import { ImageIcon, Loader2, FileText, ExternalLink } from "lucide-react"
import type { PortfolioItem, PortfolioCategory } from "@/lib/portfolio"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const FILTERS: (PortfolioCategory | "all")[] = ["all", "logo", "affiche", "carte", "video", "ebook", "autre"]
const CATEGORY_LABELS: Record<PortfolioCategory | "all", { fr: string; en: string }> = {
  all: { fr: "Tout", en: "All" }, logo: { fr: "Logos", en: "Logos" }, affiche: { fr: "Affiches", en: "Posters" }, carte: { fr: "Print", en: "Print" }, video: { fr: "Vidéos", en: "Videos" }, ebook: { fr: "Ebooks", en: "Ebooks" }, autre: { fr: "Autre", en: "Other" },
}

export function PortfolioGallery() {
  const { t, locale } = useLanguage()
  const { data, isLoading } = useSWR<{ items: PortfolioItem[] }>("/api/portfolio", fetcher)
  const [filter, setFilter] = useState<PortfolioCategory | "all">("all")
  const items = data?.items ?? []
  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter)
  const grouped = filtered.reduce<Record<string, PortfolioItem[]>>((acc, item) => { const key = item.projectName?.trim() || "__standalone__"; (acc[key] ||= []).push(item); return acc }, {})
  const groups = Object.entries(grouped)

  return <main><PageHero kicker={t.portfolio.kicker} title={t.portfolio.title} subtitle={t.portfolio.subtitle} /><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
    {items.length > 0 && <div className="mb-10 flex flex-wrap justify-center gap-2">{FILTERS.map((f) => <button key={f} onClick={() => setFilter(f)} className={filter === f ? "brand-gradient rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground" : "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"}>{CATEGORY_LABELS[f][locale]}</button>)}</div>}
    {isLoading ? <div className="flex justify-center py-24"><Loader2 className="animate-spin" /></div> : groups.length === 0 ? <div className="flex flex-col items-center rounded-3xl border border-dashed px-6 py-20 text-center"><ImageIcon className="size-8 text-primary" /><h2 className="mt-5 font-display text-xl font-semibold">{locale === "fr" ? "Réalisations à venir" : "Work coming soon"}</h2><p className="mt-2 max-w-md text-sm text-muted-foreground">{t.portfolio.empty}</p><div className="mt-6 flex gap-3"><WhatsAppButton message={t.finalCta.button} /><CallButton /></div></div> : <div className="space-y-14">{groups.map(([project, projectItems]) => <section key={project}><div className="mb-5 flex items-center gap-3"><h2 className="font-display text-2xl font-semibold">{project === "__standalone__" ? (locale === "fr" ? "Réalisations individuelles" : "Individual work") : project}</h2><span className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">{projectItems.length}</span></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projectItems.map((item) => <article key={item.id} className="group overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl"><div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-secondary">{item.mimeType?.startsWith("image/") ? <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <a href={item.imageUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 p-4 text-center text-primary"><FileText className="size-10" /><span className="text-sm">{item.fileName || "Ouvrir le fichier"}</span><ExternalLink className="size-4" /></a>}</div><div className="p-5"><span className="inline-block rounded-full border border-primary/15 bg-accent px-2.5 py-0.5 text-xs">{CATEGORY_LABELS[item.category][locale]}</span><h3 className="mt-2 font-display font-semibold">{item.title}</h3>{item.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}</div></article>)}</div></section>)}</div>}
  </div>{filtered.length > 0 && <FinalCta />}</main>
}
