import { put, list, del } from "@vercel/blob"

export type PortfolioCategory = "logo" | "affiche" | "carte" | "video" | "ebook" | "autre"

export type PortfolioItem = {
  id: string
  title: string
  description: string
  category: PortfolioCategory
  projectName?: string
  imageUrl: string
  imagePathname: string
  fileName?: string
  mimeType?: string
  fileSize?: number
  createdAt: string
  updatedAt?: string
}

export type UploadedBlob = {
  url: string
  pathname: string
  contentType?: string
  size?: number
  fileName?: string
}

const INDEX_PATH = "portfolio/index.json"
const FILE_PREFIX = "portfolio/files/"

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const { blobs } = await list({ prefix: INDEX_PATH, limit: 1 })
    const indexBlob = blobs.find((b) => b.pathname === INDEX_PATH)
    if (!indexBlob) return []
    const res = await fetch(indexBlob.url, { cache: "no-store" })
    if (!res.ok) return []
    const data = (await res.json()) as PortfolioItem[]
    return Array.isArray(data)
      ? data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : []
  } catch (error) {
    console.error("[portfolio] read error:", error)
    return []
  }
}

async function saveIndex(items: PortfolioItem[]) {
  await put(INDEX_PATH, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  })
}

function safeExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "")
  return ext ? `.${ext.slice(0, 12)}` : ""
}

function itemFromBlob(input: {
  id: string
  title: string
  description: string
  category: PortfolioCategory
  projectName?: string
  blob: UploadedBlob
  now: string
}): PortfolioItem {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    category: input.category,
    projectName: input.projectName?.trim() || undefined,
    imageUrl: input.blob.url,
    imagePathname: input.blob.pathname,
    fileName: input.blob.fileName,
    mimeType: input.blob.contentType || "application/octet-stream",
    fileSize: input.blob.size,
    createdAt: input.now,
    updatedAt: input.now,
  }
}

export async function addPortfolioItem(input: {
  title: string
  description: string
  category: PortfolioCategory
  projectName?: string
  file: File
}) {
  const id = crypto.randomUUID()
  const pathname = `${FILE_PREFIX}${id}${safeExtension(input.file.name)}`
  const blob = await put(pathname, input.file, {
    access: "public",
    contentType: input.file.type || "application/octet-stream",
  })
  return addPortfolioItemFromBlob({
    title: input.title,
    description: input.description,
    category: input.category,
    projectName: input.projectName,
    blob: { url: blob.url, pathname: blob.pathname, contentType: input.file.type, size: input.file.size, fileName: input.file.name },
  })
}

export async function addPortfolioItemFromBlob(input: {
  title: string
  description: string
  category: PortfolioCategory
  projectName?: string
  blob: UploadedBlob
}) {
  const item = itemFromBlob({ ...input, id: crypto.randomUUID(), now: new Date().toISOString() })
  const items = await getPortfolioItems()
  await saveIndex([item, ...items])
  return item
}

export async function updatePortfolioItem(id: string, input: {
  title: string
  description: string
  category: PortfolioCategory
  projectName?: string
  file?: File
}) {
  const items = await getPortfolioItems()
  const current = items.find((item) => item.id === id)
  if (!current) throw new Error("Réalisation introuvable")
  let next = current
  if (input.file) {
    const pathname = `${FILE_PREFIX}${id}-${crypto.randomUUID()}${safeExtension(input.file.name)}`
    const blob = await put(pathname, input.file, { access: "public", contentType: input.file.type || "application/octet-stream" })
    next = await replacePortfolioBlob(current, { url: blob.url, pathname: blob.pathname, contentType: input.file.type, size: input.file.size, fileName: input.file.name })
  }
  next = { ...next, title: input.title, description: input.description, category: input.category, projectName: input.projectName?.trim() || undefined, updatedAt: new Date().toISOString() }
  await saveIndex(items.map((item) => item.id === id ? next : item))
  return next
}

export async function updatePortfolioItemFromBlob(id: string, input: {
  title: string
  description: string
  category: PortfolioCategory
  projectName?: string
  blob?: UploadedBlob
}) {
  const items = await getPortfolioItems()
  const current = items.find((item) => item.id === id)
  if (!current) throw new Error("Réalisation introuvable")
  let next = input.blob ? await replacePortfolioBlob(current, input.blob) : current
  next = { ...next, title: input.title, description: input.description, category: input.category, projectName: input.projectName?.trim() || undefined, updatedAt: new Date().toISOString() }
  await saveIndex(items.map((item) => item.id === id ? next : item))
  return next
}

async function replacePortfolioBlob(current: PortfolioItem, blob: UploadedBlob) {
  try { await del(current.imageUrl) } catch (error) { console.error("[portfolio] old file delete error:", error) }
  return { ...current, imageUrl: blob.url, imagePathname: blob.pathname, fileName: blob.fileName, mimeType: blob.contentType || "application/octet-stream", fileSize: blob.size }
}

export async function deletePortfolioItem(id: string) {
  const items = await getPortfolioItems()
  const target = items.find((item) => item.id === id)
  if (!target) return
  try { await del(target.imageUrl) } catch (error) { console.error("[portfolio] file delete error:", error) }
  await saveIndex(items.filter((item) => item.id !== id))
}

export const PORTFOLIO_FILE_PREFIX = FILE_PREFIX
export const PORTFOLIO_MAX_FILE_SIZE = 25 * 1024 * 1024
