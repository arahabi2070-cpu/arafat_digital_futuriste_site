import { NextResponse } from 'next/server'
import {
  nouvelId,
  obtenirDepotSite,
  type MessageContact,
} from '@/lib/avis-messages'
import { envoiAutorise, ipDepuisRequete } from '@/lib/limitation'

/**
 * POST /api/contact — enregistrement d'un message du formulaire de
 * contact (Phase 2, volet site).
 *
 * Le départ WhatsApp du formulaire est INCHANGÉ et reste le parcours
 * principal : cette route ne fait qu'archiver le message dans la
 * boîte de réception de l'administration, quand la base du site est
 * configurée. Sans base (état actuel de production), elle répond
 * { enregistre: false } — le visiteur ne voit aucune différence,
 * aucune erreur. Même contrat si la base tombe en panne : le message
 * part sur WhatsApp, l'archivage est un plus, jamais un prérequis.
 */

const NOM_MAX = 100
const TELEPHONE_MAX = 30
const SERVICE_MAX = 120
const BUDGET_MAX = 60
const MESSAGE_MAX = 2000

function texte(valeur: unknown, max: number): string {
  return typeof valeur === 'string' ? valeur.trim().slice(0, max) : ''
}

export async function POST(requete: Request) {
  const depot = obtenirDepotSite()
  if (!depot) {
    return NextResponse.json({ enregistre: false })
  }

  // Anti-abus : au plus 5 messages par heure et par adresse IP.
  if (!envoiAutorise(`message-contact:${ipDepuisRequete(requete)}`, 5)) {
    return NextResponse.json({ enregistre: false, limite: true })
  }

  const corps = (await requete.json().catch(() => null)) as Record<
    string,
    unknown
  > | null
  if (!corps) {
    return NextResponse.json({ enregistre: false })
  }

  const nom = texte(corps.nom, NOM_MAX)
  const messageTexte = texte(corps.message, MESSAGE_MAX)
  if (nom.length < 2 || messageTexte.length < 1) {
    return NextResponse.json({ enregistre: false })
  }

  const message: MessageContact = {
    id: nouvelId('MSG'),
    nom,
    telephone: texte(corps.telephone, TELEPHONE_MAX),
    service: texte(corps.service, SERVICE_MAX),
    budget: texte(corps.budget, BUDGET_MAX),
    message: messageTexte,
    lu: false,
    creeLe: new Date().toISOString(),
  }

  try {
    await depot.creerMessage(message)
    return NextResponse.json({ enregistre: true })
  } catch (erreur) {
    console.error('[contact] enregistrement du message impossible :', erreur)
    return NextResponse.json({ enregistre: false })
  }
}
