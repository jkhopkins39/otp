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
        "group inline-flex min-w-0 items-center gap-2.5 rounded-full sm:gap-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent ring-1 ring-gold/25 transition-[transform,box-shadow] duration-300 group-hover:scale-[1.03] group-hover:ring-gold/50 group-hover:shadow-gold"
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
          <span className="truncate font-display text-[0.95rem] font-bold tracking-tight sm:text-base">
            One Talent
          </span>
          <span className="truncate text-[0.7rem] font-medium uppercase tracking-[0.22em] text-gold-strong">
            Productions
          </span>
        </span>
      ) : null}
    </Link>
  );
}
