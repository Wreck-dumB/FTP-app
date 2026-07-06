const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const DEFAULT_COLOR = "#3b82f6";

/** Validate a calendar color; anything that isn't #rrggbb falls back to blue. */
export function sanitizeColor(value: unknown): string {
  return typeof value === "string" && HEX_COLOR.test(value) ? value : DEFAULT_COLOR;
}

/** Trim and cap free-text input; returns "" for non-strings. */
export function cleanText(value: unknown, maxLength = 80): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}
