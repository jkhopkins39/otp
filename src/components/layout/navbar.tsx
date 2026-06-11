"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  // Lock body scroll when the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "surface-glass border-b transition-all duration-300",
          scrolled ? "border-border shadow-soft" : "border-border/40",
        )}
      >
        <nav
          className="container flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]"
          aria-label="Primary"
        >
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 32 }
                      }
                      className="absolute inset-0 -z-10 rounded-full bg-gold/12 ring-1 ring-gold/25"
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              href="/contact"
              size="sm"
              className="hidden lg:inline-flex"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold/50 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 surface-readable md:hidden"
          >
            <motion.ul
              className="container flex flex-col gap-1 py-6"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition-colors",
                        active
                          ? "bg-gold/12 text-foreground ring-1 ring-gold/25"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {item.label}
                      <ArrowUpRight className="h-5 w-5 opacity-50" />
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li
                className="mt-4"
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0 },
                }}
              >
                <Button href="/contact" className="w-full" size="lg">
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </motion.li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
