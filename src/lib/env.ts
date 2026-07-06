/**
 * The public base URL for links we generate (invite links, email redirects).
 * Falls back to localhost in dev; refuses to run without it in production so
 * confirmation emails can never silently point at http://localhost:3000.
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set in production");
  }
  return "http://localhost:3000";
}
