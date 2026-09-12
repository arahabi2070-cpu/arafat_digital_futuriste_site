export function PageHero({
  kicker,
  title,
  subtitle,
}: {
  kicker: string
  title: string
  subtitle: string
}) {
  return (
    <section className="brand-soft-surface border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6 lg:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-primary" />
          {kicker}
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  )
}
