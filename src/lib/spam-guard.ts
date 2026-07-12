export const MIN_FORM_SUBMIT_MS = 3000;

export type SpamCheckInput = {
  contact_website?: string;
  contact_fax?: string;
  website?: string;
  _honey?: string;
  formLoadTime?: number;
};

export function isSpamSubmission(input: SpamCheckInput): boolean {
  if (String(input.contact_website ?? "").trim()) return true;
  if (String(input.contact_fax ?? "").trim()) return true;
  if (String(input.website ?? "").trim()) return true;
  if (String(input._honey ?? "").trim()) return true;

  const loadTime = input.formLoadTime;
  if (typeof loadTime === "number" && loadTime > 0 && Date.now() - loadTime < MIN_FORM_SUBMIT_MS) {
    return true;
  }

  return false;
}

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 60 * 1000;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_LIMIT.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (bucket.count >= MAX_REQUESTS) return true;
  bucket.count += 1;
  return false;
}

export function getClientIpFromHeaders(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
