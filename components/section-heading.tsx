import { cn } from '@/lib/utils'

export function SectionHeading({
  kicker,
  title,
  subtitle,
  center,
  className,
}: {
  kicker?: string
  title: string
  subtitle?: string
  center?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3', center && 'items-center text-center', className)}>
      {kicker && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {kicker}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
