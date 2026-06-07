import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-24 lg:py-28", className)}>
      <div className="container">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-gold/35 px-3 py-1",
        "surface-readable text-xs font-semibold uppercase tracking-[0.18em] text-gold-strong shadow-soft",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  compact = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-panel flex flex-col",
        compact ? "gap-3" : "gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "font-display font-bold tracking-tight",
          compact
            ? "text-2xl sm:text-3xl lg:text-[2.25rem] lg:leading-[1.08]"
            : "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl leading-relaxed text-muted-foreground",
            compact ? "text-sm sm:text-base" : "text-base sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
