import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'ADF sur Google',
  description: 'Informations officielles de ADF Arafat Digital futuriste : sites web, boutiques en ligne et communication promotionnelle à Garoua et au Cameroun.',
  alternates: { canonical: '/google-profile' },
}

export default function GoogleProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Identité officielle</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{CONTACT.company}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{CONTACT.category} · {CONTACT.city}</p>

        <dl className="mt-10 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Téléphone</dt>
            <dd className="mt-1 font-semibold"><a className="hover:text-primary" href={`tel:${CONTACT.phoneRaw}`}>{CONTACT.phoneDisplay}</a></dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Site officiel</dt>
            <dd className="mt-1 font-semibold"><Link className="hover:text-primary" href="/">adf-go.vercel.app</Link></dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href={CONTACT.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">Voir la fiche Google</a>
          <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 font-semibold hover:bg-secondary">Nous contacter</Link>
        </div>
      </div>
    </main>
  )
}
