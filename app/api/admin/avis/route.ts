import { type NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  obtenirDepotSite,
  type StatutAvisService,
} from '@/lib/avis-messages'

/**
 * Modération des avis services (administration du site — Phase 2).
 * GET   : tous les avis + l'état de la base.
 * PATCH : { id, statut } — approuver, masquer, remettre en attente.
 * DELETE: { id } — suppression définitive.
 * Gardées par la session administrateur existante. Sans base, GET
 * répond { baseConfiguree: false } pour que l'écran affiche son état
 * propre au lieu d'une erreur.
 */

const STATUTS: StatutAvisService[] = ['en_attente', 'approuve', 'masque']

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const depot = obtenirDepotSite()
  if (!depot) {
    return NextResponse.json({ baseConfiguree: false, avis: [] })
  }
  try {
    const avis = await depot.listerAvis()
    return NextResponse.json({ baseConfiguree: true, avis })
  } catch (erreur) {
    console.error('[admin/avis] lecture impossible :', erreur)
    return NextResponse.json({ baseConfiguree: true, avis: [], erreurLecture: true })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const depot = obtenirDepotSite()
  if (!depot) {
    return NextResponse.json(
      { error: 'Base de données non configurée.' },
      { status: 503 },
    )
  }
  const corps = (await request.json().catch(() => null)) as {
    id?: unknown
    statut?: unknown
  } | null
  const id = typeof corps?.id === 'string' ? corps.id : ''
  const statut = corps?.statut as StatutAvisService
  if (!id || !STATUTS.includes(statut)) {
    return NextResponse.json(
      { error: 'Champs « id » et « statut » (valide) requis.' },
      { status: 400 },
    )
  }
  await depot.definirStatutAvis(id, statut)
  return NextResponse.json({ success: true, statut })
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const depot = obtenirDepotSite()
  if (!depot) {
    return NextResponse.json(
      { error: 'Base de données non configurée.' },
      { status: 503 },
    )
  }
  const corps = (await request.json().catch(() => null)) as {
    id?: unknown
  } | null
  const id = typeof corps?.id === 'string' ? corps.id : ''
  if (!id) {
    return NextResponse.json({ error: 'Identifiant manquant' }, { status: 400 })
  }
  await depot.supprimerAvis(id)
  return NextResponse.json({ success: true })
}
