import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "blog", label: "Blog Posts" },
  { key: "team", label: "Team" },
  { key: "venues", label: "Venues" },
  { key: "jobs", label: "Recent Jobs" },
  { key: "events", label: "Events" },
  { key: "testimonials", label: "Testimonials" },
  { key: "contacts", label: "Contact Leads" },
];

export function TabNav({ activeTab }: { activeTab: string }) {
  return (
    <nav
      aria-label="Admin sections"
      className="mb-8 flex gap-1 overflow-x-auto rounded-2xl border border-border surface-card p-1.5 shadow-soft"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`/admin?tab=${tab.key}`}
          className={cn(
            "shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.key
              ? "bg-gold/15 text-gold-strong ring-1 ring-gold/20"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
