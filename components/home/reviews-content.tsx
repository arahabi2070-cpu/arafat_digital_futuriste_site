'use client'

import { useState } from 'react'
import { Loader2, Send, Star } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { SectionHeading } from '@/components/section-heading'
import { SERVICE_KEYS, type ServiceKey } from '@/lib/i18n'

/**
 * Contenu visible de la section « Avis » (Phase 2, volet site) :
 * note moyenne et avis approuvés (données fournies par le composant
 * serveur), puis le formulaire public. L'avis envoyé part « en
 * attente » : le visiteur est prévenu qu'il paraîtra après
 * validation — il ne s'affiche jamais immédiatement.
 */

export interface AvisPublic {
  id: string
  nom: string
  service: ServiceKey
  note: number
  texte: string
  creeLe: string
}

function Etoiles({ note, taille = 'size-4' }: { note: number; taille?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${taille} ${n <= note ? 'fill-[#00adf2] text-[#00adf2]' : 'text-muted-foreground/40'}`}
        />
      ))}
    </span>
  )
}

const champ =
  'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30'

export function ReviewsContent({
  avis,
  moyenne,
}: {
  avis: AvisPublic[]
  moyenne: number | null
}) {
  const { t, locale } = useLanguage()
  const [nom, setNom] = useState('')
  const [service, setService] = useState('')
  const [note, setNote] = useState(5)
  const [texte, setTexte] = useState('')
  const [enCours, setEnCours] = useState(false)
  const [merci, setMerci] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  async function envoyer(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      const reponse = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, service, note, texte }),
      })
      const data = (await reponse.json().catch(() => null)) as {
        erreur?: string
      } | null
      if (!reponse.ok) {
        setErreur(data?.erreur ?? t.reviews.formError)
        return
      }
      setMerci(true)
    } catch {
      setErreur(t.reviews.formError)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <section id="avis" className="scroll-mt-24" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          id="reviews-heading"
          kicker={t.reviews.kicker}
          title={t.reviews.title}
          subtitle={t.reviews.subtitle}
          center
          className="items-center"
        />

        {avis.length > 0 && moyenne !== null ? (
          <>
            <p className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-center">
              <Etoiles note={Math.round(moyenne)} taille="size-5" />
              <strong className="font-display text-xl font-bold">
                {moyenne.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                /5
              </strong>
              <span className="text-sm text-muted-foreground">
                {t.reviews.averageLabel} · {avis.length} {t.reviews.publishedCount}
              </span>
            </p>
            <ul className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
              {avis.map((a) => (
                <li key={a.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <Etoiles note={a.note} />
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {t.services[a.service].name}
                    </span>
                  </div>
                  <p className="mt-3 leading-relaxed text-pretty">{a.texte}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">{a.nom}</strong>
                    {' · '}
                    {new Date(a.creeLe).toLocaleDateString(
                      locale === 'fr' ? 'fr-FR' : 'en-US',
                      { day: 'numeric', month: 'long', year: 'numeric' },
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
            {t.reviews.empty}
          </p>
        )}

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h3 className="font-display text-xl font-bold">{t.reviews.formTitle}</h3>
          {merci ? (
            <p role="status" className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              {t.reviews.formThanks}
            </p>
          ) : (
            <form onSubmit={envoyer} className="mt-5 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="avis-nom" className="mb-1.5 block text-sm font-medium text-foreground">
                    {t.reviews.formName} <span className="text-primary">*</span>
                  </label>
                  <input
                    id="avis-nom"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    maxLength={100}
                    className={champ}
                  />
                </div>
                <div>
                  <label htmlFor="avis-service" className="mb-1.5 block text-sm font-medium text-foreground">
                    {t.reviews.formService} <span className="text-primary">*</span>
                  </label>
                  <select
                    id="avis-service"
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={champ}
                  >
                    <option value="" disabled>
                      {t.reviews.selectService}
                    </option>
                    {SERVICE_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t.services[key].name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.reviews.formRating} <span className="text-primary">*</span>
                </span>
                <div className="flex items-center gap-1" role="radiogroup" aria-label={t.reviews.formRating}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={note === n}
                      aria-label={`${n}/5`}
                      onClick={() => setNote(n)}
                      className="rounded-full p-1 transition hover:bg-secondary"
                    >
                      <Star
                        className={`size-6 ${n <= note ? 'fill-[#00adf2] text-[#00adf2]' : 'text-muted-foreground'}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold">{note}/5</span>
                </div>
              </div>
              <div>
                <label htmlFor="avis-texte" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t.reviews.formText} <span className="text-primary">*</span>
                </label>
                <textarea
                  id="avis-texte"
                  required
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder={t.reviews.formTextPlaceholder}
                  className={`${champ} resize-none`}
                />
              </div>
              {erreur && (
                <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                  {erreur}
                </p>
              )}
              <button
                type="submit"
                disabled={enCours}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full brand-gradient font-bold text-white shadow-lg shadow-sky-900/25 transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40 disabled:cursor-wait disabled:opacity-70"
              >
                {enCours ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
                {t.reviews.formSubmit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
