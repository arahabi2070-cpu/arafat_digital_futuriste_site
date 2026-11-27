/**
 * Avis services et messages de contact — couche de données du site
 * (Phase 2 du plan console, volet site ; voir README).
 *
 * Le site n'avait aucune base de données : cette couche ajoute un
 * Postgres PARPARESSEUX, sur le patron éprouvé de la boutique
 * (pilote @neondatabase/serverless, URL lue au premier usage dans
 * DATABASE_URL ou POSTGRES_URL, schéma créé paresseusement, entités
 * entières en JSONB).
 *
 * COMPORTEMENT SANS BASE — l'état de production tant que la base
 * Neon du projet site n'est pas créée dans le tableau de bord
 * Vercel : `obtenirDepotSite()` renvoie null et chaque consommateur
 * échoue en douceur. Le formulaire de contact garde exactement son
 * comportement d'origine (départ WhatsApp, rien d'enregistré), le
 * formulaire d'avis n'est pas affiché, les sections d'administration
 * affichent « base non configurée ». Aucune erreur visible pour un
 * visiteur, aucun appel réseau tenté.
 *
 * Dépôt mémoire de test : derrière la MÊME interface, activé par la
 * seule variable ADF_DEPOT_MEMOIRE=1 — réservé aux preuves locales,
 * jamais défini en production (les données y vivent le temps du
 * processus).
 */

import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { SERVICE_KEYS, type ServiceKey } from './i18n'

export type StatutAvisService = 'en_attente' | 'approuve' | 'masque'

export interface AvisService {
  id: string
  nom: string
  /** Clé du service concerné (SERVICE_KEYS de lib/i18n). */
  service: ServiceKey
  /** Note de 1 à 5. */
  note: number
  texte: string
  statut: StatutAvisService
  creeLe: string
}

export interface MessageContact {
  id: string
  nom: string
  /** Téléphone du visiteur (champ optionnel du formulaire). */
  telephone: string
  /** Libellé du service choisi dans le formulaire (texte libre). */
  service: string
  budget: string
  message: string
  lu: boolean
  creeLe: string
}

export interface DepotAvisMessages {
  creerAvis(a: AvisService): Promise<void>
  listerAvis(statut?: StatutAvisService): Promise<AvisService[]>
  definirStatutAvis(id: string, statut: StatutAvisService): Promise<void>
  supprimerAvis(id: string): Promise<void>
  avisApprouves(): Promise<AvisService[]>
  creerMessage(m: MessageContact): Promise<void>
  listerMessages(): Promise<MessageContact[]>
  definirLuMessage(id: string, lu: boolean): Promise<void>
  supprimerMessage(id: string): Promise<void>
  compterMessagesNonLus(): Promise<number>
}

export function nouvelId(prefixe: string): string {
  return `${prefixe}-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`
}

/** La base du site est-elle configurée (ou le dépôt mémoire de test) ? */
export function baseSiteConfiguree(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.ADF_DEPOT_MEMOIRE === '1',
  )
}

/* ————— Implémentation Postgres (paresseuse) ————— */

type Sql = NeonQueryFunction<false, false>

class DepotPostgresSite implements DepotAvisMessages {
  private client: Sql | null = null
  private schemaPret: Promise<void> | null = null

  private sql(): Sql {
    if (!this.client) {
      const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
      if (!url) {
        throw new Error(
          'DepotPostgresSite : DATABASE_URL (ou POSTGRES_URL) absent de l’environnement.',
        )
      }
      this.client = neon(url)
    }
    return this.client
  }

  private async pret(): Promise<Sql> {
    const sql = this.sql()
    if (!this.schemaPret) {
      this.schemaPret = (async () => {
        await sql`
          CREATE TABLE IF NOT EXISTS avis_services (
            id TEXT PRIMARY KEY,
            donnees JSONB NOT NULL
          )`
        await sql`
          CREATE TABLE IF NOT EXISTS messages_contact (
            id TEXT PRIMARY KEY,
            donnees JSONB NOT NULL
          )`
      })()
      this.schemaPret.catch(() => {
        this.schemaPret = null
      })
    }
    await this.schemaPret
    return sql
  }

  async creerAvis(a: AvisService): Promise<void> {
    const sql = await this.pret()
    await sql`
      INSERT INTO avis_services (id, donnees)
      VALUES (${a.id}, ${JSON.stringify(a)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET donnees = EXCLUDED.donnees`
  }

  async listerAvis(statut?: StatutAvisService): Promise<AvisService[]> {
    const sql = await this.pret()
    const lignes = (await sql`
      SELECT donnees FROM avis_services
      ORDER BY donnees->>'creeLe' DESC`) as { donnees: AvisService }[]
    const liste = lignes.map((l) => l.donnees)
    return statut ? liste.filter((a) => a.statut === statut) : liste
  }

  async definirStatutAvis(
    id: string,
    statut: StatutAvisService,
  ): Promise<void> {
    const sql = await this.pret()
    const lignes = (await sql`
      SELECT donnees FROM avis_services WHERE id = ${id}`) as {
      donnees: AvisService
    }[]
    const a = lignes[0]?.donnees
    if (!a) return
    a.statut = statut
    await sql`
      UPDATE avis_services SET donnees = ${JSON.stringify(a)}::jsonb
      WHERE id = ${id}`
  }

  async supprimerAvis(id: string): Promise<void> {
    const sql = await this.pret()
    await sql`
      DELETE FROM avis_services WHERE id = ${id}`
  }

  async avisApprouves(): Promise<AvisService[]> {
    return this.listerAvis('approuve')
  }

  async creerMessage(m: MessageContact): Promise<void> {
    const sql = await this.pret()
    await sql`
      INSERT INTO messages_contact (id, donnees)
      VALUES (${m.id}, ${JSON.stringify(m)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET donnees = EXCLUDED.donnees`
  }

  async listerMessages(): Promise<MessageContact[]> {
    const sql = await this.pret()
    const lignes = (await sql`
      SELECT donnees FROM messages_contact
      ORDER BY donnees->>'creeLe' DESC`) as { donnees: MessageContact }[]
    return lignes.map((l) => l.donnees)
  }

  async definirLuMessage(id: string, lu: boolean): Promise<void> {
    const sql = await this.pret()
    const lignes = (await sql`
      SELECT donnees FROM messages_contact WHERE id = ${id}`) as {
      donnees: MessageContact
    }[]
    const m = lignes[0]?.donnees
    if (!m) return
    m.lu = lu
    await sql`
      UPDATE messages_contact SET donnees = ${JSON.stringify(m)}::jsonb
      WHERE id = ${id}`
  }

  async supprimerMessage(id: string): Promise<void> {
    const sql = await this.pret()
    await sql`
      DELETE FROM messages_contact WHERE id = ${id}`
  }

  async compterMessagesNonLus(): Promise<number> {
    const messages = await this.listerMessages()
    return messages.filter((m) => !m.lu).length
  }
}

/* ————— Implémentation mémoire (preuves locales uniquement) ————— */

class DepotMemoireSite implements DepotAvisMessages {
  private avis = new Map<string, AvisService>()
  private messages = new Map<string, MessageContact>()

  async creerAvis(a: AvisService): Promise<void> {
    this.avis.set(a.id, { ...a })
  }

  async listerAvis(statut?: StatutAvisService): Promise<AvisService[]> {
    let liste = [...this.avis.values()]
    if (statut) liste = liste.filter((a) => a.statut === statut)
    return liste
      .sort((a, b) => b.creeLe.localeCompare(a.creeLe))
      .map((a) => ({ ...a }))
  }

  async definirStatutAvis(
    id: string,
    statut: StatutAvisService,
  ): Promise<void> {
    const a = this.avis.get(id)
    if (a) a.statut = statut
  }

  async supprimerAvis(id: string): Promise<void> {
    this.avis.delete(id)
  }

  async avisApprouves(): Promise<AvisService[]> {
    return this.listerAvis('approuve')
  }

  async creerMessage(m: MessageContact): Promise<void> {
    this.messages.set(m.id, { ...m })
  }

  async listerMessages(): Promise<MessageContact[]> {
    return [...this.messages.values()]
      .sort((a, b) => b.creeLe.localeCompare(a.creeLe))
      .map((m) => ({ ...m }))
  }

  async definirLuMessage(id: string, lu: boolean): Promise<void> {
    const m = this.messages.get(id)
    if (m) m.lu = lu
  }

  async supprimerMessage(id: string): Promise<void> {
    this.messages.delete(id)
  }

  async compterMessagesNonLus(): Promise<number> {
    return [...this.messages.values()].filter((m) => !m.lu).length
  }
}

/* ————— Point d'accès unique ————— */

const globalDepotSite = globalThis as unknown as {
  __adfDepotSite?: DepotAvisMessages | null
}

/**
 * Le dépôt du site, ou null si aucune base n'est configurée — l'état
 * normal du site tant que la base Neon n'est pas créée dans Vercel.
 * Les consommateurs traitent null comme « fonction inactive », jamais
 * comme une erreur.
 */
export function obtenirDepotSite(): DepotAvisMessages | null {
  if (globalDepotSite.__adfDepotSite === undefined) {
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      globalDepotSite.__adfDepotSite = new DepotPostgresSite()
    } else if (process.env.ADF_DEPOT_MEMOIRE === '1') {
      globalDepotSite.__adfDepotSite = new DepotMemoireSite()
    } else {
      globalDepotSite.__adfDepotSite = null
    }
  }
  return globalDepotSite.__adfDepotSite
}

/** Un service valide pour un avis : une des clés réelles du site. */
export function serviceValide(valeur: unknown): valeur is ServiceKey {
  return (
    typeof valeur === 'string' &&
    (SERVICE_KEYS as readonly string[]).includes(valeur)
  )
}

/**
 * Neutralisation des liens dans les textes publics (même règle que
 * la boutique) : toute URL devient « lien retiré » à l'affichage.
 */
const MOTIF_URL =
  /(?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"']+|[a-z0-9-]+\.(?:com|net|org|io|co|cm|fr|info|biz|xyz|top|site|online|shop|store|link|me|tv|app)(?:\/[^\s<>"']*)?/gi

export function neutraliserLiens(texte: string): string {
  return texte.replace(MOTIF_URL, '« lien retiré »')
}

/** Note moyenne au dixième ; null si aucun avis. */
export function noteMoyenne(avis: AvisService[]): number | null {
  if (avis.length === 0) return null
  const total = avis.reduce((somme, a) => somme + a.note, 0)
  return Math.round((total / avis.length) * 10) / 10
}
