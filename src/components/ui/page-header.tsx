import { Eyebrow } from "@/components/ui/section";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden surface-readable">
      <div className="container py-5 sm:py-7">
        <div className="flex max-w-3xl flex-col gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
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
