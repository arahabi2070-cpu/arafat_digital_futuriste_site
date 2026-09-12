import { PenTool, Megaphone, CreditCard, Clapperboard, GraduationCap, BookOpen, type LucideIcon } from 'lucide-react'
import type { ServiceKey } from '@/lib/i18n'

export const serviceIcons: Record<ServiceKey, LucideIcon> = {
  logo: PenTool,
  social: Megaphone,
  print: CreditCard,
  video: Clapperboard,
  training: GraduationCap,
  ebooks: BookOpen,
}
