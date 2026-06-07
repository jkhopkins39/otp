import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "header";
};

/**
 * Lightweight layout wrapper. Content is always visible immediately —
 * no scroll-triggered or mount animations (those caused missing text on
 * client-side route changes).
 */
export function Reveal({
  children,
  className,
  as = "div",
}: RevealProps) {
  const Tag = as;
  return <Tag className={cn(className)}>{children}</Tag>;
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
