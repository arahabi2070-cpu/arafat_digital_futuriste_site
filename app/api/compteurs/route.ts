import { NextResponse } from 'next/server'
import { verifyAdminKey } from '@/lib/admin-auth'
import { obtenirDepotSite } from '@/lib/avis-messages'

/**
 * GET /api/compteurs — pont de compteurs site → console
 * (Phase 4 du plan console ; constat n°5 de l'état des lieux).
 *
 * La console d'administration vit dans la boutique ; les avis
 * services et les messages vivent ici. Cette route répond donc,
 * à la seule console, deux NOMBRES — jamais aucun contenu :
 * { avisEnAttente, messagesNonLus }.
 *
 * Authentification : la clé d'administration partagée (la même
 * valeur ADMIN_API_KEY des deux projets), en en-tête
 * « x-admin-key » ou « Authorization: Bearer … », comparée en
 * temps constant par verifyAdminKey. Sans clé valide : 401.
 *
 * Sans base configurée (état actuel de production), la route
 * répond { nonConfigure: true } : la console affiche alors « — »
 * pour la part du site, sans erreur.
 */

export const dynamic = 'force-dynamic'

function clePartageeValide(requete: Request): boolean {
  const directe = requete.headers.get('x-admin-key')
  if (directe && verifyAdminKey(directe)) return true
  const autorisation = requete.headers.get('authorization') || ''
  const bearer = autorisation.replace(/^Bearer\s+/i, '')
  return bearer !== '' && verifyAdminKey(bearer)
}

export async function GET(requete: Request) {
  if (!clePartageeValide(requete)) {
    return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 })
  }
  const depot = obtenirDepotSite()
  if (!depot) {
    return NextResponse.json({ nonConfigure: true })
  }
  try {
    const [avisEnAttente, messagesNonLus] = await Promise.all([
      depot.listerAvis('en_attente'),
      depot.compterMessagesNonLus(),
    ])
    return NextResponse.json({
      avisEnAttente: avisEnAttente.length,
      messagesNonLus,
    })
  } catch (erreur) {
    console.error('[compteurs] lecture impossible :', erreur)
    return NextResponse.json({ nonConfigure: true })
  }
}
