"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Check, Loader2, MailOpen, MessageCircle, Trash2 } from "lucide-react"
import type { MessageContact } from "@/lib/avis-messages"

/**
 * Section « Messages » de l'administration du site (Phase 2) : la
 * boîte de réception des messages enregistrés par le formulaire de
 * contact — en plus du départ WhatsApp, qui reste le parcours du
 * visiteur. Non lu / lu, coordonnées, et réponse en un toucher via
 * WhatsApp quand le visiteur a laissé son téléphone.
 */

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formaterDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    timeZone: "Africa/Douala",
    dateStyle: "medium",
    timeStyle: "short",
  })
}

/** Lien wa.me à partir d'un numéro saisi librement (best effort). */
function lienWhatsApp(telephone: string): string | null {
  let chiffres = telephone.replace(/\D/g, "")
  if (chiffres.startsWith("00")) chiffres = chiffres.slice(2)
  // Numéro camerounais local (9 chiffres) : ajouter l'indicatif.
  if (chiffres.length === 9) chiffres = `237${chiffres}`
  if (chiffres.length < 11) return null
  return `https://wa.me/${chiffres}`
}

export function AdminMessages() {
  const { data, mutate, isLoading } = useSWR<{
    baseConfiguree: boolean
    messages: MessageContact[]
    nonLus: number
    erreurLecture?: boolean
  }>("/api/admin/messages", fetcher)

  async function basculerLu(m: MessageContact) {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, lu: !m.lu }),
    })
    if (res.ok) await mutate()
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer définitivement ce message ?")) return
    const res = await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) await mutate()
  }

  const messages = data?.messages ?? []

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="text-2xl font-bold md:text-3xl">
        Messages du site
        {data && data.nonLus > 0 && (
          <span className="brand-gradient ml-3 inline-flex -translate-y-1 items-center rounded-full px-3 py-1 text-sm font-bold text-white">
            {data.nonLus} non lu{data.nonLus > 1 ? "s" : ""}
          </span>
        )}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Les demandes envoyées depuis le formulaire de contact, conservées
        ici en plus du message WhatsApp que le visiteur déclenche.
      </p>

      {isLoading ? (
        <Loader2 className="mt-6 animate-spin" />
      ) : data && !data.baseConfiguree ? (
        <p className="mt-6 rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          Base de données non configurée : les messages seront archivés
          ici dès la création de la base Neon du projet site dans le
          tableau de bord Vercel (voir le README du dépôt). En attendant,
          les demandes continuent d’arriver par WhatsApp, comme avant.
        </p>
      ) : data?.erreurLecture ? (
        <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
          Lecture de la base impossible pour le moment — réessayez dans un
          instant.
        </p>
      ) : messages.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Aucun message enregistré pour le moment.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {messages.map((m) => {
            const wa = m.telephone ? lienWhatsApp(m.telephone) : null
            return (
              <article
                key={m.id}
                className={`rounded-xl border bg-card p-4 shadow-sm ${m.lu ? "" : "border-primary/40"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {m.nom}
                      {!m.lu && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          Non lu
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formaterDate(m.creeLe)}
                      {m.service ? ` · ${m.service}` : ""}
                      {m.budget ? ` · Budget : ${m.budget} FCFA` : ""}
                      {m.telephone ? ` · ${m.telephone}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-7 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-muted"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Répondre sur WhatsApp
                      </a>
                    )}
                    <Button variant="outline" size="sm" onClick={() => basculerLu(m)}>
                      {m.lu ? (
                        <>
                          <MailOpen className="h-4 w-4" />
                          Marquer non lu
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Marquer lu
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => supprimer(m.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
                <p className="mt-3 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
