import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminKey, createAdminSession, destroyAdminSession, adminKeyConfigured } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  if (!adminKeyConfigured()) {
    return NextResponse.json(
      { error: "La clé administrateur n'est pas configurée sur le serveur (ADMIN_API_KEY)." },
      { status: 503 },
    )
  }

  try {
    const { key } = await request.json()
    if (typeof key !== "string" || !verifyAdminKey(key)) {
      return NextResponse.json({ error: "Clé incorrecte" }, { status: 401 })
    }
    await createAdminSession()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
  }
}

export async function DELETE() {
  await destroyAdminSession()
  return NextResponse.json({ success: true })
}
