/**
 * Site-wide background motif — deliberately quiet.
 *
 * One fixed, static composition: a faint dot grid (≤5% opacity) plus a single
 * thin diagonal accent band. No parallax, no scroll listeners, no framer —
 * so there is nothing to gate behind `prefers-reduced-motion`, and the layer
 * costs no client JS.
 */
export function SiteBackground() {
  return (
    <div
      className="site-background pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="site-background__base" />
      <div className="site-background__grid" />
      <div className="site-background__band" />
    </div>
  );
}
