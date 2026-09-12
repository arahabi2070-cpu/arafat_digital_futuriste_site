'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { CONTACT, waLink } from '@/lib/i18n'

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Image src="/adf-logo.png" alt="ADF" width={40} height={40} className="size-10 rounded-lg object-contain" />
            <div>
              <p className="font-display text-lg font-bold leading-none">ADF</p>
              <p className="text-xs text-muted-foreground">Arafat Digital Futuriste</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.footer.tagline}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">{t.footer.services}</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-primary">{t.services.logo.name}</Link></li>
            <li><Link href="/services" className="hover:text-primary">{t.services.social.name}</Link></li>
            <li><Link href="/services" className="hover:text-primary">{t.services.video.name}</Link></li>
            <li><Link href="/formation" className="hover:text-primary">{t.nav.training}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">{t.footer.contact}</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {CONTACT.city}
            </li>
            <li>
              <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={waLink('Bonjour ADF !')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {CONTACT.company}. {t.footer.rights}</p>
          <Link href="/admin" className="hover:text-primary">{t.footer.admin}</Link>
        </div>
      </div>
    </footer>
  )
}
