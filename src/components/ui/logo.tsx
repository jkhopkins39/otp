import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/content";

/**
 * Brand lockup: coin mark + accessible text wordmark (scales crisply in any theme).
 */
export function Logo({
  className,
  showWordmark = true,
  size = 44,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "group inline-flex min-w-0 items-center gap-2.5 rounded-md sm:gap-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-transparent transition-colors duration-200 group-hover:border-gold"
        style={{ width: size, height: size }}
      >
        <Image
          src={site.logoSrc}
          alt=""
          width={size}
          height={size}
          priority
          className="h-full w-full object-contain p-0.5"
        />
      </span>
      {showWordmark ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="truncate font-display text-[0.95rem] font-bold tracking-tight text-foreground sm:text-base">
            One Talent
          </span>
          <span className="mt-0.5 truncate text-[0.72rem] font-medium text-gold-strong">
            Productions
          </span>
        </span>
      ) : null}
    </Link>
  );
}
