"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Check, EyeOff, Loader2, RotateCcw, Star, Trash2 } from "lucide-react"
import { fr } from "@/lib/i18n"
import type { AvisService, StatutAvisService } from "@/lib/avis-messages"

/**
 * Section « Avis services » de l'administration du site (Phase 2) :
 * file de modération — approuver (publier), masquer, remettre en
 * attente, supprimer. Sans base configurée, l'écran affiche son état
 * propre (« base non configurée »), pas une erreur.
 */

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const LIBELLES_STATUT: Record<StatutAvisService, string> = {
  en_attente: "En attente",
  approuve: "Approuvé — public",
  masque: "Masqué",
}

function formaterDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: "Africa/Douala",
    dateStyle: "medium",
  })
}

export function AdminAvis() {
  const { data, mutate, isLoading } = useSWR<{
    baseConfiguree: boolean
    avis: AvisService[]
    erreurLecture?: boolean
  }>("/api/admin/avis", fetcher)

  async function agir(id: string, action: StatutAvisService | "supprimer") {
    if (
      action === "supprimer" &&
      !confirm("Supprimer définitivement cet avis ?")
    ) {
      return
    }
    const res = await fetch("/api/admin/avis", {
      method: action === "supprimer" ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        action === "supprimer" ? { id } : { id, statut: action },
      ),
    })
    if (res.ok) await mutate()
  }

  const enAttente = (data?.avis ?? []).filter((a) => a.statut === "en_attente")
  const autres = (data?.avis ?? []).filter((a) => a.statut !== "en_attente")

  function carte(a: AvisService) {
    return (
      <article key={a.id} className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-0.5" aria-label={`Note : ${a.note}/5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-4 w-4 ${n <= a.note ? "fill-[#00adf2] text-[#00adf2]" : "text-muted-foreground/40"}`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-1.5 text-sm font-bold">{a.note}/5</span>
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              <strong className="text-foreground">{a.nom}</strong>
              {" · "}
              {fr.services[a.service].name}
              {" · "}
              {formaterDate(a.creeLe)}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              a.statut === "en_attente"
                ? "bg-primary/10 text-primary"
                : a.statut === "approuve"
                  ? "brand-gradient text-white"
                  : "bg-secondary text-muted-foreground"
            }`}
          >
            {LIBELLES_STATUT[a.statut]}
          </span>
        </div>
        <p className="mt-3 leading-relaxed whitespace-pre-wrap">{a.texte}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {a.statut !== "approuve" && (
            <Button variant="outline" size="sm" onClick={() => agir(a.id, "approuve")}>
              <Check className="h-4 w-4" />
              Approuver
            </Button>
          )}
          {a.statut !== "masque" && (
            <Button variant="outline" size="sm" onClick={() => agir(a.id, "masque")}>
              <EyeOff className="h-4 w-4" />
              Masquer
            </Button>
          )}
          {a.statut !== "en_attente" && (
            <Button variant="outline" size="sm" onClick={() => agir(a.id, "en_attente")}>
              <RotateCcw className="h-4 w-4" />
              Remettre en attente
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => agir(a.id, "supprimer")}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </article>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <h2 className="text-2xl font-bold md:text-3xl">Avis services</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Les avis laissés sur le site naissent « en attente » : rien n’est
        public avant votre décision. Modérez les abus — jamais les
        critiques honnêtes.
      </p>

      {isLoading ? (
        <Loader2 className="mt-6 animate-spin" />
      ) : data && !data.baseConfiguree ? (
        <p className="mt-6 rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          Base de données non configurée : les avis seront actifs dès la
          création de la base Neon du projet site dans le tableau de bord
          Vercel (voir le README du dépôt).
        </p>
      ) : data?.erreurLecture ? (
        <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
          Lecture de la base impossible pour le moment — réessayez dans un
          instant.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-8">
          <div>
            <h3 className="text-lg font-semibold">
              En attente de modération ({enAttente.length})
            </h3>
            {enAttente.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Aucun avis en attente.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-4">{enAttente.map(carte)}</div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tous les avis ({data?.avis.length ?? 0})</h3>
            {autres.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Aucun avis traité pour le moment.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-4">{autres.map(carte)}</div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
