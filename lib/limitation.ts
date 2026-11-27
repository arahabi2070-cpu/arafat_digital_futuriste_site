/**
 * Limitation simple des envois publics (avis services, messages de
 * contact) — protection anti-abus de premier niveau.
 *
 * Implémentation volontairement simple : compteurs EN MÉMOIRE, par
 * processus serveur (même patron que la boutique ADF Store). Sur un
 * hébergement multi-instances, chaque instance compte de son côté :
 * la borne réelle est un multiple de la borne affichée. C'est assumé
 * et documenté (README, « Avis et messages ») — une limite distribuée
 * ne se justifiera que si l'abus devient réel.
 */

const globalLimites = globalThis as unknown as {
  __adfLimitesEnvois?: Map<string, { debut: number; nombre: number }>
}

/**
 * Renvoie true si l'envoi est autorisé (et le comptabilise), false si
 * la clé a déjà consommé `max` envois dans la fenêtre.
 */
export function envoiAutorise(
  cle: string,
  max = 5,
  fenetreMs = 60 * 60 * 1000,
): boolean {
  if (!globalLimites.__adfLimitesEnvois) {
    globalLimites.__adfLimitesEnvois = new Map()
  }
  const carte = globalLimites.__adfLimitesEnvois
  const maintenant = Date.now()
  const entree = carte.get(cle)
  if (!entree || maintenant - entree.debut > fenetreMs) {
    carte.set(cle, { debut: maintenant, nombre: 1 })
    return true
  }
  if (entree.nombre >= max) return false
  entree.nombre += 1
  return true
}

/** Adresse IP du visiteur : premier élément de `x-forwarded-for`. */
export function ipDepuisRequete(requete: Request): string {
  const transfere = requete.headers.get('x-forwarded-for')
  if (transfere) {
    const premier = transfere.split(',')[0]?.trim()
    if (premier) return premier
  }
  return requete.headers.get('x-real-ip')?.trim() || 'inconnue'
}
