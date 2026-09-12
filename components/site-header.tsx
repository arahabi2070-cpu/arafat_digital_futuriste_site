'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'
import { WhatsAppButton } from '@/components/contact-buttons'

export function SiteHeader() {
  const { t, toggle } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/services', label: t.nav.services },
    { href: '/portfolio', label: t.nav.portfolio },
    { href: '/formation', label: t.nav.training },
    { href: '/contact', label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/adf-logo.png" alt="ADF Arafat Digital Futuriste" width={40} height={40} className="size-10 rounded-lg object-contain" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight">ADF</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Arafat Digital Futuriste</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                pathname === l.href && 'bg-secondary text-foreground',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            aria-label="Change language"
          >
            <Languages className="size-4 text-primary" aria-hidden="true" />
            {t.common.langLabel}
          </button>

          <div className="hidden sm:block">
            <WhatsAppButton message="Bonjour ADF, je souhaite un devis." label={t.nav.quote} />
          </div>

          <button
            className="inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary',
                  pathname === l.href && 'bg-secondary',
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2">
              <WhatsAppButton message="Bonjour ADF, je souhaite un devis." label={t.nav.quote} full />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
