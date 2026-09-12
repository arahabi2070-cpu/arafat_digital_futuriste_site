import { NextResponse } from "next/server"
import { getPortfolioItems } from "@/lib/portfolio"

// Public read endpoint — anyone can view the published portfolio.
export async function GET() {
  const items = await getPortfolioItems()
  return NextResponse.json({ items })
}
