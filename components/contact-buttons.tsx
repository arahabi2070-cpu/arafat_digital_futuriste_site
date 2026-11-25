'use client'

import { MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CONTACT, waLink } from '@/lib/i18n'
import { useLanguage } from '@/components/language-provider'

type Size = 'default' | 'lg'

const sizeClasses: Record<Size, string> = {
  default: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
}

export function WhatsAppButton({
  message,
  label,
  size = 'default',
  className,
  full,
}: {
  message: string
  label?: string
  size?: Size
  className?: string
  full?: boolean
}) {
  const { t } = useLanguage()
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-full brand-gradient font-bold text-white shadow-lg shadow-sky-900/25 transition-all hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40',
        sizeClasses[size],
        full && 'w-full',
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      {label ?? t.common.whatsapp}
    </a>
  )
}

export function CallButton({
  size = 'default',
  className,
  full,
}: {
  size?: Size
  className?: string
  full?: boolean
}) {
  const { t } = useLanguage()
  return (
    <a
      href={`tel:${CONTACT.phoneRaw}`}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-secondary hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
        sizeClasses[size],
        full && 'w-full',
        className,
      )}
    >
      <Phone className="size-5 text-primary" aria-hidden="true" />
      {t.common.call}
    </a>
  )
}
