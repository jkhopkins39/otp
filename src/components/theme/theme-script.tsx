/**
 * Inline script injected in <head> BEFORE first paint to prevent a flash of
 * the wrong theme (FOUC). Reads localStorage, falls back to the OS preference,
 * and sets the `.dark` class + color-scheme on <html> synchronously.
 */
export const THEME_STORAGE_KEY = "otp.theme";

export function ThemeScript() {
  const code = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=s?s==="dark":m;var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(_){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
