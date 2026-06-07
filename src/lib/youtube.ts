/**
 * Parse a YouTube video id from a wide range of inputs:
 *  - raw id:                 "dQw4w9WgXcQ"
 *  - watch url:              https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *  - short url:              https://youtu.be/dQw4w9WgXcQ
 *  - embed url:              https://www.youtube.com/embed/dQw4w9WgXcQ
 *  - shorts url:             https://www.youtube.com/shorts/dQw4w9WgXcQ
 *  - with extra query/time:  ...&t=42s
 */
const YT_ID = /^[a-zA-Z0-9_-]{11}$/;

export function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const value = input.trim();

  if (YT_ID.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && YT_ID.test(id) ? id : null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && YT_ID.test(v)) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((p) =>
        ["embed", "shorts", "v", "live"].includes(p),
      );
      if (marker !== -1 && parts[marker + 1] && YT_ID.test(parts[marker + 1])) {
        return parts[marker + 1];
      }
    }
  } catch {
    // Not a URL — fall through.
  }

  return null;
}

export function isValidYouTube(input: string): boolean {
  return parseYouTubeId(input) !== null;
}

export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeEmbedUrl(id: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
