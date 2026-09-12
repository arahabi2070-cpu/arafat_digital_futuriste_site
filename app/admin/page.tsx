import { isAdminAuthenticated, adminKeyConfigured } from "@/lib/admin-auth"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = { title: "ADF Hub — Administration", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const configured = adminKeyConfigured()
  const authenticated = configured && (await isAdminAuthenticated())
  if (!configured) return <div className="flex min-h-[70vh] items-center justify-center px-4 py-16"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm"><h1 className="text-xl font-bold text-foreground">ADF Hub</h1><p className="mt-3 text-sm text-muted-foreground">La variable d&apos;environnement <code className="rounded bg-muted px-1.5 py-0.5">ADMIN_API_KEY</code> doit être définie sur le serveur.</p></div></div>
  return authenticated ? <AdminDashboard /> : <AdminLogin />
}
