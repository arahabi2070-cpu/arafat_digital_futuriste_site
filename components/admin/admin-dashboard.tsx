"use client"

import { useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, Trash2, LogOut, FileText, Check, Pencil, X } from "lucide-react"
import type { PortfolioItem, PortfolioCategory } from "@/lib/portfolio"

const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  logo: "Logo & identité", affiche: "Affiche / réseaux", carte: "Carte de visite / print",
  video: "Vidéo publicitaire", ebook: "Ebook", autre: "Autre",
}
const fetcher = (url: string) => fetch(url).then((r) => r.json())

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.size < 3.5 * 1024 * 1024) return file
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0)
  bitmap.close()
  for (const quality of [0.86, 0.75, 0.64, 0.52]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality))
    if (blob && blob.size < file.size && blob.size <= 3.5 * 1024 * 1024) {
      return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp", lastModified: Date.now() })
    }
  }
  return file
}

export function AdminDashboard() {
  const router = useRouter()
  const { data, mutate, isLoading } = useSWR<{ items: PortfolioItem[] }>("/api/portfolio", fetcher)
  const items = data?.items ?? []
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectName, setProjectName] = useState("")
  const [category, setCategory] = useState<PortfolioCategory>("logo")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  function resetForm() {
    setEditing(null); setTitle(""); setDescription(""); setProjectName(""); setCategory("logo"); setFile(null); setPreview("")
  }
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0]
    if (!original) return
    try {
      const prepared = await compressImage(original)
      setFile(prepared)
      setPreview(prepared.type.startsWith("image/") ? URL.createObjectURL(prepared) : "")
      setMessage(prepared.size < original.size ? { type: "ok", text: `Image compressée sans changer sa résolution (${Math.round(prepared.size / 1024)} Ko).` } : null)
    } catch { setFile(original); setMessage(null) }
  }
  function startEdit(item: PortfolioItem) {
    setEditing(item); setTitle(item.title); setDescription(item.description); setProjectName(item.projectName || ""); setCategory(item.category); setFile(null); setPreview(item.mimeType?.startsWith("image/") ? item.imageUrl : ""); setMessage(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage(null)
    try {
      const fd = new FormData(); fd.append("title", title); fd.append("description", description); fd.append("projectName", projectName); fd.append("category", category)
      if (editing) fd.append("id", editing.id)
      if (file) {
        const blob = await upload(`portfolio/files/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
          multipart: file.size > 4 * 1024 * 1024,
          clientPayload: JSON.stringify({ fileName: file.name, size: file.size }),
        })
        fd.append("blobUrl", blob.url); fd.append("blobPathname", blob.pathname); fd.append("blobContentType", file.type || "application/octet-stream"); fd.append("blobSize", String(file.size)); fd.append("blobFileName", file.name)
      }
      const res = await fetch("/api/admin/portfolio", { method: editing ? "PUT" : "POST", body: fd })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Échec de l'opération")
      setMessage({ type: "ok", text: editing ? "Réalisation mise à jour." : "Réalisation ajoutée." }); resetForm(); await mutate()
    } catch (error) { setMessage({ type: "err", text: error instanceof Error ? error.message : "Échec de l'opération" }) } finally { setBusy(false) }
  }
  async function remove(id: string) {
    if (!confirm("Supprimer définitivement cette réalisation ?")) return
    setBusy(true)
    try { const res = await fetch("/api/admin/portfolio", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (!res.ok) throw new Error("Échec de la suppression"); await mutate() } finally { setBusy(false) }
  }
  async function logout() { await fetch("/api/admin/session", { method: "DELETE" }); router.refresh() }
  const projects = Array.from(new Set(items.map((i) => i.projectName).filter(Boolean))) as string[]

  return <div className="mx-auto max-w-6xl px-4 py-12">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold md:text-3xl">Gestion du portfolio</h1><p className="mt-1 text-sm text-muted-foreground">Ajoutez, regroupez, remplacez, modifiez ou supprimez vos fichiers. Les images sont compressées sans réduction de résolution.</p></div><Button variant="outline" onClick={logout}><LogOut className="h-4 w-4" />Déconnexion</Button></div>
    <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="h-fit rounded-2xl border bg-card p-6 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-semibold"><Upload className="h-5 w-5 text-primary" />{editing ? "Modifier la réalisation" : "Nouvelle réalisation"}</h2>
        <div className="mt-5 flex flex-col gap-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Titre (ex. Logo HNOVA)" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm" />
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Projet / client (optionnel, ex. HNOVA)" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value as PortfolioCategory)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm">{Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Description" className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm" />
          <div><label className="mb-1.5 block text-sm font-medium">Fichier (jusqu’à 25 Mo ; tous formats)</label><input type="file" onChange={onFileChange} required={!editing} className="block w-full text-sm" />{preview && <img src={preview} alt="Aperçu" className="mt-3 h-40 w-full rounded-lg object-cover" />}</div>
          {message && <p role="alert" className={`rounded-lg px-3 py-2 text-sm ${message.type === "ok" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{message.text}</p>}
          <div className="flex gap-2"><Button type="submit" disabled={busy} className="flex-1 justify-center">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? <Pencil className="h-4 w-4" /> : <Check className="h-4 w-4" />}{editing ? "Mettre à jour" : "Publier"}</Button>{editing && <Button type="button" variant="outline" onClick={resetForm}><X className="h-4 w-4" />Annuler</Button>}</div>
        </div>
      </form>
      <div><h2 className="text-lg font-semibold">Réalisations ({items.length})</h2>{projects.length > 0 && <p className="mt-1 text-sm text-muted-foreground">{projects.length} projet(s) regroupé(s) : {projects.join(", ")}</p>}
        {isLoading ? <Loader2 className="mt-6 animate-spin" /> : <div className="mt-6 grid gap-4 sm:grid-cols-2">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border bg-card shadow-sm"><div className="flex h-36 items-center justify-center bg-muted">{item.mimeType?.startsWith("image/") ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /> : <a href={item.imageUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 text-sm text-primary"><FileText className="h-10 w-10" />{item.fileName || "Ouvrir le fichier"}</a>}</div><div className="p-4"><span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{CATEGORY_LABELS[item.category]}</span>{item.projectName && <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{item.projectName}</span>}<h3 className="mt-2 font-semibold">{item.title}</h3>{item.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}<div className="mt-3 flex gap-2"><Button variant="outline" size="sm" onClick={() => startEdit(item)}><Pencil className="h-4 w-4" />Modifier</Button><Button variant="outline" size="sm" onClick={() => remove(item.id)} disabled={busy} className="text-destructive"><Trash2 className="h-4 w-4" />Supprimer</Button></div></div></article>)}</div>}
      </div>
    </div>
  </div>
}
