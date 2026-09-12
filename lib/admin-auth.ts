import { cookies } from "next/headers"

const COOKIE_NAME = "adf_admin"

/**
 * The admin key lives ONLY on the server (env var). It is never sent to the client.
 * Set ADMIN_API_KEY in the project environment variables.
 */
function getAdminKey(): string | undefined {
  return process.env.ADMIN_API_KEY
}

export function adminKeyConfigured(): boolean {
  return Boolean(getAdminKey())
}

/**
 * Validate a submitted key against the server-side ADMIN_API_KEY.
 * Uses a constant-time-ish comparison to reduce timing leaks.
 */
export function verifyAdminKey(submitted: string): boolean {
  const key = getAdminKey()
  if (!key) return false
  if (submitted.length !== key.length) return false
  let mismatch = 0
  for (let i = 0; i < key.length; i++) {
    mismatch |= key.charCodeAt(i) ^ submitted.charCodeAt(i)
  }
  return mismatch === 0
}

/**
 * A signed-ish session token. We store a hash of the admin key in an
 * httpOnly cookie so the raw key never persists in the browser.
 */
async function sessionToken(): Promise<string> {
  const key = getAdminKey() || ""
  const encoder = new TextEncoder()
  const data = encoder.encode(`adf-session:${key}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function createAdminSession(): Promise<void> {
  const token = await sessionToken()
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  })
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!adminKeyConfigured()) return false
  const store = await cookies()
  const cookie = store.get(COOKIE_NAME)?.value
  if (!cookie) return false
  const expected = await sessionToken()
  return cookie === expected
}
