// ─────────────────────────────────────────────────────────────────────────────
// Canonical site URL resolution.
// Used by metadata, robots.txt and sitemap.xml so every absolute URL is
// consistent. Priority:
//   1. NEXT_PUBLIC_BASE_URL          (explicit override)
//   2. VERCEL_PROJECT_PRODUCTION_URL (stable production domain on Vercel)
//   3. VERCEL_URL                    (preview deployment)
//   4. http://localhost:3000         (local development)
// A localhost URL is never used while running on Vercel.
// ─────────────────────────────────────────────────────────────────────────────

function normalize(url: string): string {
  const withProtocol =
    url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, '');
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  const isVercel = Boolean(process.env.VERCEL);
  const explicitIsLocalhost = Boolean(explicit && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(explicit));

  if (explicit && !(isVercel && explicitIsLocalhost)) {
    return normalize(explicit);
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return normalize(`https://${vercelProd}`);

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return normalize(`https://${vercelUrl}`);

  if (isVercel) return 'https://photobooth-cse-viyugam.vercel.app';

  return normalize(explicit || 'http://localhost:3000');
}

export const siteUrl = resolveSiteUrl();
