import { type NextRequest, NextResponse } from "next/server"
import {
  addPortfolioItem,
  addPortfolioItemFromBlob,
  deletePortfolioItem,
  updatePortfolioItem,
  updatePortfolioItemFromBlob,
  type PortfolioCategory,
  PORTFOLIO_MAX_FILE_SIZE,
  type UploadedBlob,
} from "@/lib/portfolio"
import { isAdminAuthenticated } from "@/lib/admin-auth"

const CATEGORIES: PortfolioCategory[] = ["logo", "affiche", "carte", "video", "ebook", "autre"]

function parseForm(formData: FormData) {
  const categoryRaw = String(formData.get("category") || "autre")
  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    projectName: String(formData.get("projectName") || "").trim(),
    category: CATEGORIES.includes(categoryRaw as PortfolioCategory) ? categoryRaw as PortfolioCategory : "autre" as PortfolioCategory,
  }
}

function parseUploadedBlob(formData: FormData): UploadedBlob | undefined {
  const url = String(formData.get("blobUrl") || "").trim()
  const pathname = String(formData.get("blobPathname") || "").trim()
  if (!url || !pathname) return undefined
  const size = Number(formData.get("blobSize") || 0)
  if (!pathname.startsWith("portfolio/files/")) throw new Error("Fichier Blob invalide")
  if (size > PORTFOLIO_MAX_FILE_SIZE) throw new Error("Fichier trop lourd (maximum 25 Mo)")
  return {
    url,
    pathname,
    contentType: String(formData.get("blobContentType") || "application/octet-stream"),
    size: Number.isFinite(size) && size > 0 ? size : undefined,
    fileName: String(formData.get("blobFileName") || "fichier"),
  }
}

function validateFile(file: File | null) {
  if (!file || file.size === 0) return "Aucun fichier fourni"
  if (file.size > PORTFOLIO_MAX_FILE_SIZE) return "Fichier trop lourd (maximum 25 Mo)"
  return null
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  try {
    const formData = await request.formData()
    const fields = parseForm(formData)
    if (!fields.title) return NextResponse.json({ error: "Le titre est requis" }, { status: 400 })
    const uploadedBlob = parseUploadedBlob(formData)
    if (uploadedBlob) {
      return NextResponse.json({ item: await addPortfolioItemFromBlob({ ...fields, blob: uploadedBlob }) })
    }
    const file = formData.get("file") as File | null
    const fileError = validateFile(file)
    if (fileError) return NextResponse.json({ error: fileError }, { status: 400 })
    return NextResponse.json({ item: await addPortfolioItem({ ...fields, file: file! }) })
  } catch (error) {
    console.error("[portfolio] admin upload error:", error)
    const message = error instanceof Error ? error.message : "Échec de l’envoi"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  try {
    const formData = await request.formData()
    const id = String(formData.get("id") || "")
    if (!id) return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 })
    const fields = parseForm(formData)
    if (!fields.title) return NextResponse.json({ error: "Le titre est requis" }, { status: 400 })
    const uploadedBlob = parseUploadedBlob(formData)
    if (uploadedBlob) return NextResponse.json({ item: await updatePortfolioItemFromBlob(id, { ...fields, blob: uploadedBlob }) })
    const file = formData.get("file") as File | null
    const fileError = file && file.size > 0 ? validateFile(file) : null
    if (fileError) return NextResponse.json({ error: fileError }, { status: 400 })
    return NextResponse.json({ item: await updatePortfolioItem(id, { ...fields, file: file && file.size > 0 ? file : undefined }) })
  } catch (error) {
    console.error("[portfolio] admin update error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Échec de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 })
    await deletePortfolioItem(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[portfolio] admin delete error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Échec de la suppression" }, { status: 500 })
  }
}
