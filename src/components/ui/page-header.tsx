/**
 * Interior page header. Solid band on the page background, an accent rule
 * instead of the old eyebrow pill, and a solid (never gradient-clipped) h1.
 */
export function PageHeader({
  title,
  description,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <section className="border-b border-border surface-readable">
      <div className="container py-8 sm:py-10">
        <div className="flex max-w-3xl flex-col gap-3">
          <span className="accent-rule" aria-hidden />
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
