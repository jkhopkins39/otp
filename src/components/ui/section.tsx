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

/**
 * Section header: a short accent rule, a solid heading, an optional muted lede.
 * No pill, no uppercase letterspaced label, no gradient-clipped words.
 */
export function SectionHeading({
  title,
  description,
  align = "left",
  className,
  compact = false,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        compact ? "gap-3" : "gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <span className="accent-rule" aria-hidden />
      <h2
        className={cn(
          "font-display font-bold tracking-tight text-foreground",
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
