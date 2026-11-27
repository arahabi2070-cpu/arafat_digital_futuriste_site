'use client'

import Image from 'next/image'
import { ShoppingBag, Store, Truck } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'
import { WhatsAppButton } from '@/components/contact-buttons'
import type { ProduitPublicBoutique } from '@/lib/catalogue-boutique'

/**
 * Contenu de la section « Boutique » — composant client (textes
 * FR/EN via le LanguageProvider), alimenté par le composant
 * serveur ShopSection : les produits numériques viennent du flux
 * public de la boutique (étape 3b). L'offre du livre IMPRIMÉ
 * ci-dessous est celle du site, présentée séparément : elle ne
 * fait pas partie du flux et ne s'y mélange jamais.
 *
 * Repli (étape 3a) : sans produit reçu — flux injoignable ou
 * catalogue vide — la section affiche exactement son état
 * d'origine : l'offre imprimée et les deux boutons en nouvel
 * onglet (version numérique, boutique). Aucune erreur visible.
 */
export function ShopContent({
  produits,
  boutiqueUrl,
}: {
  produits: ProduitPublicBoutique[]
  boutiqueUrl: string
}) {
  const { t, locale } = useLanguage()
  const livreNumeriqueUrl = `${boutiqueUrl}/produit/livre-revele-et-monetise-pdf`
  const avecProduits = produits.length > 0

  return (
    <section id="boutique" className="scroll-mt-24 border-y border-border bg-secondary/40" aria-labelledby="shop-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[300px_1fr]">
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
            {!avecProduits && (
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <p className="font-display text-xl font-bold tracking-tight text-primary">{t.shop.digitalPrice}</p>
                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <a
                    href={livreNumeriqueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-14 items-center justify-center gap-2 rounded-full brand-gradient px-7 text-base font-bold text-white shadow-lg shadow-sky-900/25 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
                  >
                    <ShoppingBag className="size-5" aria-hidden="true" />
                    {t.shop.digitalButton}
                  </a>
                  <a
                    href={boutiqueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-background px-7 text-base font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-secondary hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  >
                    <Store className="size-5 text-primary" aria-hidden="true" />
                    {t.shop.storeButton}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {avecProduits && (
          <div className="mt-14">
            <h3 className="text-center font-display text-2xl font-bold tracking-tight text-foreground lg:text-left">
              {t.shop.digitalTitle}
            </h3>
            <div className="mt-8 flex flex-wrap justify-center gap-6 lg:justify-start">
              {produits.map((produit) => (
                <article
                  key={produit.slug}
                  className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_8px_32px_rgba(0,173,242,0.10)]"
                >
                  <div className="flex h-56 items-center justify-center bg-white p-4">
                    {produit.visuel ? (
                      // Visuel servi par la boutique (autre origine) :
                      // img simple, affichée entière, jamais rognée.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={produit.visuel}
                        alt={produit.nom}
                        loading="lazy"
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex size-20 items-center justify-center rounded-full brand-gradient">
                        <ShoppingBag className="size-9 text-white" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-6">
                    {produit.categorieLibelle && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {produit.categorieLibelle}
                      </p>
                    )}
                    <h4 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
                      {produit.nom}
                    </h4>
                    {produit.accroche && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {produit.accroche}
                      </p>
                    )}
                    <p className="mt-4 font-display text-xl font-bold text-primary">
                      {produit.prixFormate ??
                        (produit.prix !== null
                          ? `${new Intl.NumberFormat('fr-FR').format(produit.prix)} FCFA`
                          : '')}
                    </p>
                    <a
                      href={produit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full brand-gradient px-6 text-base font-bold text-white shadow-lg shadow-sky-900/25 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
                    >
                      <ShoppingBag className="size-5" aria-hidden="true" />
                      {t.shop.orderButton}
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 flex justify-center lg:justify-start">
              <a
                href={boutiqueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-background px-7 text-base font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-secondary hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <Store className="size-5 text-primary" aria-hidden="true" />
                {t.shop.storeButton}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
