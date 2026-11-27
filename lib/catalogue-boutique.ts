/**
 * Catalogue public de la boutique, consommé par la section
 * « Boutique » de la page d'accueil (Étape 3b du plan console —
 * voir le README, section « Catalogue intégré »).
 *
 * Source unique : le flux en lecture seule de la boutique,
 * GET {BOUTIQUE_URL}/api/catalogue-public — produits ACTIFS
 * uniquement, aucune donnée client. La boutique reste la seule
 * source des produits, des prix et des visuels : un produit
 * masqué ou un prix modifié dans l'administration de la boutique
 * se reflète ici sans aucun déploiement du site.
 *
 * Base : variable d'environnement BOUTIQUE_URL, défaut
 * https://adf-store.vercel.app.
 *
 * Revalidation : le flux est relu au plus tard toutes les 60 s
 * (cache de données de `fetch`) ; la page d'accueil étant elle-même
 * régénérée au plus tard toutes les 300 s (son `revalidate`
 * existant), un changement côté boutique paraît ici en cinq
 * minutes au plus tard.
 *
 * Repli : flux injoignable, réponse invalide ou catalogue vide →
 * tableau vide, et la section retombe sur son état « liens »
 * d'origine (étape 3a). Cette fonction ne lève jamais.
 */

export interface ProduitPublicBoutique {
  slug: string
  nom: string
  accroche: string
  prix: number | null
  prixFormate: string | null
  categorie: string
  categorieLibelle: string
  visuel: string | null
  url: string
}

export const URL_BOUTIQUE_PUBLIQUE = (
  process.env.BOUTIQUE_URL || 'https://adf-store.vercel.app'
).replace(/\/$/, '')

const REVALIDATION_FLUX_S = 60

function estProduitPublic(valeur: unknown): valeur is ProduitPublicBoutique {
  if (typeof valeur !== 'object' || valeur === null) return false
  const p = valeur as Record<string, unknown>
  return (
    typeof p.slug === 'string' &&
    typeof p.nom === 'string' &&
    typeof p.url === 'string'
  )
}

function normaliser(valeur: unknown): ProduitPublicBoutique | null {
  if (!estProduitPublic(valeur)) return null
  const p = valeur as unknown as Record<string, unknown>
  return {
    slug: valeur.slug,
    nom: valeur.nom,
    accroche: typeof p.accroche === 'string' ? p.accroche : '',
    prix: typeof p.prix === 'number' ? p.prix : null,
    prixFormate: typeof p.prixFormate === 'string' ? p.prixFormate : null,
    categorie: typeof p.categorie === 'string' ? p.categorie : '',
    categorieLibelle:
      typeof p.categorieLibelle === 'string' ? p.categorieLibelle : '',
    visuel: typeof p.visuel === 'string' ? p.visuel : null,
    url: valeur.url,
  }
}

export async function obtenirProduitsBoutique(): Promise<
  ProduitPublicBoutique[]
> {
  try {
    const reponse = await fetch(`${URL_BOUTIQUE_PUBLIQUE}/api/catalogue-public`, {
      next: { revalidate: REVALIDATION_FLUX_S },
    })
    if (!reponse.ok) return []
    const donnees: unknown = await reponse.json()
    const liste =
      typeof donnees === 'object' && donnees !== null
        ? (donnees as Record<string, unknown>).produits
        : null
    if (!Array.isArray(liste)) return []
    return liste
      .map(normaliser)
      .filter((p): p is ProduitPublicBoutique => p !== null)
  } catch (erreur) {
    console.error('[boutique] flux catalogue injoignable :', erreur)
    return []
  }
}
