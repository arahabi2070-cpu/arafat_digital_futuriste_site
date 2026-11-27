import {
  neutraliserLiens,
  noteMoyenne,
  obtenirDepotSite,
} from '@/lib/avis-messages'
import { ReviewsContent, type AvisPublic } from './reviews-content'

/**
 * Section « Avis » de la page d'accueil (Phase 2, volet site) —
 * composant SERVEUR : il lit les avis approuvés dans la base du site
 * et les rend dans le HTML public, avec les données structurées
 * schema.org (Review + AggregateRating) pour Google.
 *
 * Sans base configurée (état de production tant que la base Neon du
 * site n'est pas créée dans Vercel), la section ne rend RIEN : ni
 * formulaire, ni emplacement vide. Avec une base mais aucun avis
 * approuvé, elle rend le formulaire et un état vide honnête ; la
 * moyenne et le JSON-LD n'apparaissent qu'avec au moins un avis
 * approuvé — aucune note inventée.
 */
export async function ReviewsSection() {
  const depot = obtenirDepotSite()
  if (!depot) return null

  let avisApprouves
  try {
    avisApprouves = await depot.avisApprouves()
  } catch (erreur) {
    console.error('[avis] lecture publique impossible :', erreur)
    return null
  }

  const moyenne = noteMoyenne(avisApprouves)
  const avisPublics: AvisPublic[] = avisApprouves.map((a) => ({
    id: a.id,
    nom: a.nom,
    service: a.service,
    note: a.note,
    texte: neutraliserLiens(a.texte),
    creeLe: a.creeLe,
  }))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adf-go.vercel.app'
  const donneesStructurees =
    avisPublics.length > 0 && moyenne !== null
      ? {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${siteUrl}/#business`,
          name: 'ADF Arafat Digital Futuriste',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: moyenne,
            reviewCount: avisPublics.length,
          },
          review: avisPublics.map((a) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: a.nom },
            datePublished: a.creeLe.slice(0, 10),
            reviewRating: { '@type': 'Rating', ratingValue: a.note },
            reviewBody: a.texte,
          })),
        }
      : null

  return (
    <>
      {donneesStructurees && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(donneesStructurees),
          }}
        />
      )}
      <ReviewsContent avis={avisPublics} moyenne={moyenne} />
    </>
  )
}
