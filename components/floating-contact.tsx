'use client'

import { useState } from 'react'
import { MessageCircle, Phone, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CONTACT, waLink } from '@/lib/i18n'
import { useLanguage } from '@/components/language-provider'

export function FloatingContact() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-3">
          <a
            href={waLink('Bonjour ADF, je souhaite un devis gratuit.')}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-gradient flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            {t.common.whatsapp}
          </a>
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-lg transition-transform hover:scale-105"
          >
            <Phone className="size-5 text-primary" aria-hidden="true" />
            {t.common.call}
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fermer' : 'Contact'}
        aria-expanded={open}
        className={cn(
          'flex size-14 items-center justify-center rounded-full text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105',
          open ? 'bg-foreground' : 'brand-gradient animate-pulse',
        )}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-7" />}
      </button>
    </div>
  )
}
