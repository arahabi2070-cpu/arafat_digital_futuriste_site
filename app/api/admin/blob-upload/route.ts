import { type NextRequest, NextResponse } from "next/server"
import { handleUpload } from "@vercel/blob/client"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { PORTFOLIO_FILE_PREFIX, PORTFOLIO_MAX_FILE_SIZE } from "@/lib/portfolio"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Le stockage Blob n’est pas connecté à ce projet Vercel." }, { status: 503 })
  }

  try {
    const body = await request.json()
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        if (!pathname.startsWith(PORTFOLIO_FILE_PREFIX)) throw new Error("Chemin de fichier invalide")
        return {
          allowedContentTypes: ["*/*"],
          maximumSizeInBytes: PORTFOLIO_MAX_FILE_SIZE,
          addRandomSuffix: false,
          tokenPayload: clientPayload,
          validUntil: Date.now() + 10 * 60 * 1000,
        }
      },
      onUploadCompleted: async () => undefined,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("[portfolio] blob token error:", error)
    return NextResponse.json({ error: "Impossible de préparer l’envoi Blob." }, { status: 500 })
  }
}
