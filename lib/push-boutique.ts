/**
 * Déclencheurs push du site vers la boutique (Phase 4 du plan
 * console ; voir le README, section « Console et notifications »).
 *
 * Le site n'a pas d'infrastructure de notification : quand un
 * message de contact ou un avis service est enregistré ici, ce
 * module appelle le point d'entrée de la boutique,
 * POST {BOUTIQUE_URL}/api/push/notifier, authentifié par la clé
 * d'administration partagée (en-tête « x-admin-key »). La
 * boutique envoie alors la notification aux appareils abonnés
 * du propriétaire.
 *
 * Échec doux, par construction : l'appel part en arrière-plan
 * (after de Next.js), sa réponse n'est pas attendue, et toute
 * erreur — boutique injoignable, clé absente — est absorbée en
 * silence. L'enregistrement du message ou de l'avis, lui, ne
 * dépend jamais de cet appel.
 */

import { after } from 'next/server'
import { URL_BOUTIQUE_PUBLIQUE } from './catalogue-boutique'

export type TypeNotificationSite = 'avis' | 'messages'

export interface NotificationSite {
  type: TypeNotificationSite
  titre: string
  corps: string
  /** Écran de l'administration du site à ouvrir au clic. */
  url: string
}

export function notifierBoutiquePush(notification: NotificationSite): void {
  const cle = process.env.ADMIN_API_KEY
  if (!cle) return
  const tache = (async () => {
    try {
      await fetch(`${URL_BOUTIQUE_PUBLIQUE}/api/push/notifier`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-admin-key': cle,
        },
        body: JSON.stringify(notification),
        signal: AbortSignal.timeout(5000),
      })
    } catch {
      // La notification est un plus, jamais un prérequis :
      // l'échec est absorbé sans trace pour le visiteur.
    }
  })()
  try {
    after(tache)
  } catch {
    void tache
  }
}
