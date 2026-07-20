import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { nav, site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-border surface-readable">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-gradient"
        aria-hidden
      />
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo size={48} />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-strong">
              Explore
            </h3>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-strong">
              Contact
            </h3>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4 text-gold" />
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4 text-gold" />
              {site.phone}
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-gold" />
              {site.location}
            </span>
          </div>
        </div>

        <div className="divider-gold my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
          <p className="text-center sm:text-right">
            Website by{" "}
            <a
              href="https://www.hoppytech.com/?utm_source=otp"
              target="_blank"
              rel="noopener"
              className="font-medium text-gold-strong underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              Hoppy Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
