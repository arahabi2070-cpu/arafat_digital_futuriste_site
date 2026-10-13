import { PenTool, Megaphone, CreditCard, Clapperboard, Globe2, GraduationCap, BookOpen, type LucideIcon } from 'lucide-react'
import type { ServiceKey } from '@/lib/i18n'

export const serviceIcons: Record<ServiceKey, LucideIcon> = {
  logo: PenTool,
  social: Megaphone,
  print: CreditCard,
  video: Clapperboard,
  web: Globe2,
  training: GraduationCap,
  ebooks: BookOpen,
}
