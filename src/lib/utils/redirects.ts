/**
 * Only allow same-origin path redirects. Anything absolute, protocol-relative
 * (`//evil`), backslash-tricked, or userinfo-tricked (`@evil`) falls back.
 */
export function safeNext(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || value.length === 0) return fallback;
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("@")
  ) {
    return fallback;
  }
  return value;
}
