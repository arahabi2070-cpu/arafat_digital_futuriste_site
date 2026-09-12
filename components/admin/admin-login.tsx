"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Lock, Loader2, ShieldCheck } from "lucide-react"

export function AdminLogin() {
  const router = useRouter()
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Connexion refusée")
        return
      }
      router.refresh()
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-primary-foreground">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="text-center text-2xl font-bold text-foreground">Espace administrateur</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Entrez votre clé d&apos;accès pour gérer le portfolio.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="admin-key" className="mb-1.5 block text-sm font-medium text-foreground">
              Clé administrateur
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="admin-key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
