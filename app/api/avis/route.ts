import { NextResponse } from 'next/server'
import {
  nouvelId,
  obtenirDepotSite,
  serviceValide,
  type AvisService,
} from '@/lib/avis-messages'
import { envoiAutorise, ipDepuisRequete } from '@/lib/limitation'

/**
 * POST /api/avis — dépôt public d'un avis sur un service (Phase 2,
 * volet site). L'avis naît « en attente » : rien n'est public avant
 * la modération dans l'administration. Sans base configurée, la
 * route répond 503 — le formulaire n'est de toute façon pas affiché
 * dans ce cas (la section Avis ne se rend pas).
 */

const NOM_MAX = 100
const TEXTE_MAX = 1000

export async function POST(requete: Request) {
  const depot = obtenirDepotSite()
  if (!depot) {
    return NextResponse.json(
      { erreur: 'Les avis ne sont pas encore activés sur ce site.' },
      { status: 503 },
    )
  }

  // Anti-abus : au plus 5 avis par heure et par adresse IP.
  if (!envoiAutorise(`avis-service:${ipDepuisRequete(requete)}`, 5)) {
    return NextResponse.json(
      { erreur: 'Trop d’avis envoyés en peu de temps. Réessayez dans une heure.' },
      { status: 429 },
    )
  }

  const corps = (await requete.json().catch(() => null)) as {
    nom?: unknown
    service?: unknown
    note?: unknown
    texte?: unknown
  } | null
  if (!corps) {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 })
  }

  const nom = typeof corps.nom === 'string' ? corps.nom.trim() : ''
  const texte = typeof corps.texte === 'string' ? corps.texte.trim() : ''
  const note = typeof corps.note === 'number' ? corps.note : NaN

  if (nom.length < 2 || nom.length > NOM_MAX) {
    return NextResponse.json(
      { erreur: 'Votre nom est requis (2 caractères minimum).' },
      { status: 400 },
    )
  }
  if (!serviceValide(corps.service)) {
    return NextResponse.json(
      { erreur: 'Choisissez le service concerné.' },
      { status: 400 },
    )
  }
  if (!Number.isInteger(note) || note < 1 || note > 5) {
    return NextResponse.json(
      { erreur: 'Choisissez une note entre 1 et 5.' },
      { status: 400 },
    )
  }
  if (texte.length < 1 || texte.length > TEXTE_MAX) {
    return NextResponse.json(
      { erreur: `Votre avis doit faire entre 1 et ${TEXTE_MAX} caractères.` },
      { status: 400 },
    )
  }

  const avis: AvisService = {
    id: nouvelId('AVIS'),
    nom,
    service: corps.service,
    note,
    texte,
    statut: 'en_attente',
    creeLe: new Date().toISOString(),
  }

  try {
    await depot.creerAvis(avis)
  } catch (erreur) {
    console.error('[avis] création impossible :', erreur)
    return NextResponse.json(
      { erreur: 'Envoi impossible pour le moment. Réessayez dans un instant.' },
      { status: 500 },
    )
  }
  return NextResponse.json({ ok: true, statut: avis.statut }, { status: 201 })
}
