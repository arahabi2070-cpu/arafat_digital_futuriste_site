import { type NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { obtenirDepotSite } from '@/lib/avis-messages'

/**
 * Boîte de réception des messages du formulaire de contact
 * (administration du site — Phase 2).
 * GET   : tous les messages, récents d'abord + compteur de non-lus.
 * PATCH : { id, lu } — marquer lu / non lu.
 * DELETE: { id } — suppression définitive.
 * Gardées par la session administrateur existante. Sans base, GET
 * répond { baseConfiguree: false } (état propre, pas une erreur).
 */

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const depot = obtenirDepotSite()
  if (!depot) {
    return NextResponse.json({ baseConfiguree: false, messages: [], nonLus: 0 })
  }
  try {
    const messages = await depot.listerMessages()
    return NextResponse.json({
      baseConfiguree: true,
      messages,
      nonLus: messages.filter((m) => !m.lu).length,
    })
  } catch (erreur) {
    console.error('[admin/messages] lecture impossible :', erreur)
    return NextResponse.json({
      baseConfiguree: true,
      messages: [],
      nonLus: 0,
      erreurLecture: true,
    })
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
    lu?: unknown
  } | null
  const id = typeof corps?.id === 'string' ? corps.id : ''
  if (!id || typeof corps?.lu !== 'boolean') {
    return NextResponse.json(
      { error: 'Champs « id » et « lu » (booléen) requis.' },
      { status: 400 },
    )
  }
  await depot.definirLuMessage(id, corps.lu)
  return NextResponse.json({ success: true, lu: corps.lu })
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
  await depot.supprimerMessage(id)
  return NextResponse.json({ success: true })
}
